<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\LabOrder;
use App\Models\ExamResult;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Barryvdh\DomPDF\Facade\Pdf as PDF;
use Carbon\Carbon;

class LabOrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = LabOrder::with(['patient', 'exam']);

        // ✅ Búsqueda por paciente (nombre o DUI)
        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('patient', function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('dui', 'like', "%{$search}%");
            });
        }

        // ✅ Filtro por estado
        if ($request->has('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        // ✅ Filtro por examen
        if ($request->has('exam_id') && $request->exam_id !== '') {
            $query->where('exam_id', $request->exam_id);
        }

        // ✅ Filtro por fecha (desde)
        if ($request->has('date_from') && $request->date_from !== '') {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        // ✅ Filtro por fecha (hasta)
        if ($request->has('date_to') && $request->date_to !== '') {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // ✅ Paginación
        $orders = $query->latest()->paginate($request->input('per_page', 15));

        return response()->json($orders);
    }

    public function createForm(): JsonResponse
    {
        return response()->json([
            'patients' => \App\Models\Patient::active()->orderBy('last_name')->get(['id', 'first_name', 'last_name', 'dui']),
            'exams' => Exam::active()->orderBy('name')->get(['id', 'name', 'code']),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'exam_id' => 'required|exists:exams,id',
            'sample_type' => 'required|string|max:50',
        ]);

        // 1️⃣ Buscar el examen para obtener su precio actual
        $exam = Exam::findOrFail($request->exam_id);

        // 2️⃣ Crear la orden guardando el precio (unit_price)
        $order = LabOrder::create([
            'patient_id' => $request->patient_id,
            'exam_id' => $request->exam_id,
            'sample_type' => $request->sample_type,
            'created_by' => Auth::id(),
            'status' => 'in_progress',
            'unit_price' => $exam->price, // <--- ¡ESTA LÍNEA ES LA CLAVE!
        ]);

        return response()->json([
            'message' => 'Orden creada',
            'order_id' => $order->id,
            'exam' => $exam->load('fields')
        ], 201);
    }

    public function saveResults(Request $request, LabOrder $order): JsonResponse
    {
        // Validar que la orden exista
        if (!$order || !$order->id) {
            return response()->json(['message' => 'Orden no encontrada'], 404);
        }

        $request->validate([
            'results' => 'required|array',
            'results.*.field_name' => 'required|string',
            'results.*.value' => 'nullable|string',
            'action' => 'required|in:draft,complete', // ✅ NUEVO: acción a realizar
        ]);

        $action = $request->input('action'); // 'draft' o 'complete'

        // ✅ Solo validar obligatorios si es "complete"
        if ($action === 'complete') {
            $exam = Exam::with('fields')->findOrFail($order->exam_id);
            $requiredFields = $exam->fields->where('is_required', true)->pluck('field_name');

            foreach ($requiredFields as $reqField) {
                $submittedValue = collect($request->results)->firstWhere('field_name', $reqField)['value'] ?? null;
                if (empty(trim($submittedValue))) {
                    return response()->json([
                        'message' => "El campo '{$reqField}' es obligatorio para completar la orden."
                    ], 422);
                }
            }
        }

        DB::beginTransaction();
        try {
            // Limpiar resultados anteriores
            $order->results()->delete();

            // Procesar cada resultado
            $resultsData = is_array($request->results) ? $request->results : json_decode(json_encode($request->results), true);

            foreach ($resultsData as $res) {
                // Validar que tenga el campo requerido
                if (!isset($res['field_name'])) {
                    throw new \Exception('Falta el campo "field_name" en algunos resultados');
                }

                $fieldName = $res['field_name'];
                $value = $res['value'] ?? '';
                $refMin = $res['ref_min'] ?? null;
                $refMax = $res['ref_max'] ?? null;
                $fieldType = $res['field_type'] ?? 'text';

                // Calcular estado de referencia
                $status = $this->calculateReferenceStatus($value, $refMin, $refMax, $fieldType);

                // Crear resultado
                ExamResult::create([
                    'lab_order_id' => $order->id,
                    'field_name' => $fieldName,
                    'value' => $value,
                    'reference_status' => $status,
                ]);
            }

            // ✅ Actualizar estado según acción
            $newStatus = $action === 'complete' ? 'completed' : 'in_progress';
            $order->update([
                'status' => $newStatus,
                'completed_at' => $newStatus === 'completed' ? now() : null,
            ]);

            DB::commit();

            return response()->json([
                'message' => $action === 'complete'
                    ? '✅ Resultados guardados. Orden completada.'
                    : '💾 Borrador guardado. Puedes continuar después.',
                'status' => $newStatus
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error en saveResults', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'request_data' => $request->all()
            ]);
            return response()->json([
                'message' => 'Error al guardar: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(LabOrder $order): JsonResponse
    {
        $order->load(['patient', 'exam.fields', 'results']);

        // Fusiona resultados con metadatos del examen para un reporte limpio
        $reportData = $order->exam->fields->map(function ($field) use ($order) {
            $result = $order->results->firstWhere('field_name', $field->field_name);
            return [
                'field_name' => $field->field_name,
                'unit' => $field->unit,
                'ref_min' => $field->ref_min,
                'ref_max' => $field->ref_max,
                'value' => $result?->value,
                'reference_status' => $result?->reference_status ?? 'na'
            ];
        });

        return response()->json([
            'data' => [
                'id' => $order->id,
                'patient' => $order->patient,
                'exam' => $order->exam,
                'created_at' => $order->created_at,
                'status' => $order->status,
                'report' => $reportData
            ]
        ]);
    }

    // Continuar orden en proceso
    public function resume(int $orderId): JsonResponse
    {
        $order = LabOrder::with(['patient', 'exam.fields', 'results'])->findOrFail($orderId);

        if ($order->status === 'completed') {
            return response()->json(['message' => 'Esta orden ya está completada. Use "Ver Resultados".'], 400);
        }

        // Fusionar campos del examen con los valores ya guardados
        $fields = $order->exam->fields->map(function ($field) use ($order) {
            $result = $order->results->firstWhere('field_name', $field->field_name);
            return [
                'field_name' => $field->field_name,
                'unit' => $field->unit,
                'ref_min' => $field->ref_min,
                'ref_max' => $field->ref_max,
                'field_type' => $field->field_type,
                'is_required' => $field->is_required,
                'value' => $result?->value ?? '',
                'status' => $result?->reference_status ?? 'na'
            ];
        });

        return response()->json([
            'order' => $order,
            'fields' => $fields
        ]);
    }

    private function calculateReferenceStatus(?string $value, ?string $refMin, ?string $refMax, string $fieldType): string
    {
        if (!$value || $fieldType !== 'number' || ($refMin === null && $refMax === null)) {
            return 'na';
        }

        $val = floatval($value);
        $min = $refMin !== null ? floatval($refMin) : null;
        $max = $refMax !== null ? floatval($refMax) : null;

        if ($min !== null && $val < $min) return 'low';
        if ($max !== null && $val > $max) return 'high';

        return 'normal';
    }

    // 1. Historial Clínico del Paciente
    public function patientHistory(int $patientId): JsonResponse
    {
        $orders = LabOrder::with(['patient', 'exam', 'results'])
            ->where('patient_id', $patientId)
            ->where('status', 'completed')
            ->latest()
            ->get();

        return response()->json($orders);
    }

    // 2. Descargar PDF
    public function downloadPdf(LabOrder $order)
    {
        $order->load(['patient', 'exam.fields', 'results']);

        // Calcular edad del paciente
        $ageText = 'N/A';
        if ($order->patient->birth_date) {
            try {
                $ageText = Carbon::parse($order->patient->birth_date)->age . ' años';
            } catch (\Exception $e) {
                $ageText = $order->patient->birth_date;
            }
        }

        // Preparar datos de los resultados
        $reportData = $order->exam->fields->map(function ($field) use ($order) {
            $result = $order->results->firstWhere('field_name', $field->field_name);
            return [
                'name' => $field->field_name,
                'unit' => $field->unit,
                'ref_min' => $field->ref_min,
                'ref_max' => $field->ref_max,
                'value' => $result?->value ?? '-',
                'is_reference' => $field->is_reference ?? false,
            ];
        });

        // Cargar logo de marca de agua (si existe)
        $logoPath = public_path('img/logo.jpg');
        $logoBase64 = null;

        if (file_exists($logoPath)) {
            try {
                $imageData = file_get_contents($logoPath);
                $logoBase64 = 'data:image/jpg;base64,' . base64_encode($imageData);
            } catch (\Exception $e) {
                Log::error('Error cargando logo watermark: ' . $e->getMessage());
            }
        }

        // Cargar logo de color para encabezado (si existe)
        $headerLogoPath = public_path('img/logoColor.jpg');
        $headerLogoBase64 = null;

        if (file_exists($headerLogoPath)) {
            try {
                $imageData = file_get_contents($headerLogoPath);
                $headerLogoBase64 = 'data:image/jpg;base64,' . base64_encode($imageData);
            } catch (\Exception $e) {
                Log::error('Error cargando logo header: ' . $e->getMessage());
            }
        }

        // Determinar qué plantilla usar según el tipo de examen
        $templateType = $order->exam->template_type ?? 'simple';
        $allowedTemplates = ['simple', 'table', 'hemoglobin', 'card', 'espermograma', 'heces', 'frotis', 'cultivo', 'orina'];

        if (!in_array($templateType, $allowedTemplates)) {
            $templateType = 'simple';
        }

        $template = 'pdf.templates.' . $templateType;

        // Generar PDF con la plantilla correspondiente
        $pdf = PDF::loadView($template, [
            'order' => $order,
            'reportData' => $reportData,
            'ageText' => $ageText,
            'date' => now()->format('d/m/Y'),
            'logo' => $logoBase64,           // Para marca de agua
            'header_logo' => $headerLogoBase64, // Para logo en encabezado
        ]);

        // Configurar tamaño de página
        $pdf->setPaper('letter', 'portrait');

        // Generar nombre del archivo
        $filename = "Resultado_{$order->patient->first_name}_{$order->patient->last_name}_{$order->exam->code}.pdf";

        // Descargar PDF
        return $pdf->download($filename);
    }
}
