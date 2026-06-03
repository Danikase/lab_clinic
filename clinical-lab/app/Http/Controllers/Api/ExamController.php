<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ExamRequest;
use App\Models\Exam;
use App\Models\ExamField;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ExamController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Exam::query();

        if ($request->has('search')) {
            $query->search($request->search);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $exams = $query->withCount('fields')
            ->latest()
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        return response()->json($exams);
    }

    public function store(ExamRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $validated = $request->validated();

            // ✅ Asegurar que price sea numérico y con 2 decimales
            if (isset($validated['price'])) {
                $validated['price'] = round(floatval($validated['price']), 2);
            }

            $exam = Exam::create($validated);

            if ($request->has('fields') && is_array($request->fields)) {
                foreach ($request->fields as $index => $fieldData) {
                    ExamField::create([
                        'exam_id' => $exam->id,
                        'field_name' => $fieldData['field_name'],
                        'field_type' => $fieldData['field_type'],
                        'unit' => $fieldData['unit'] ?? null,
                        'ref_min' => $fieldData['ref_min'] ?? null,
                        'ref_max' => $fieldData['ref_max'] ?? null,
                        'options' => $fieldData['options'] ?? null,
                        'is_required' => $fieldData['is_required'] ?? false,
                        'is_reference' => $fieldData['is_reference'] ?? false,
                        'sort_order' => $fieldData['sort_order'] ?? $index,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Examen creado exitosamente',
                'data' => $exam->load('fields')
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al crear examen: ' . $e->getMessage());
            return response()->json(['message' => 'Error al crear examen', 'error' => $e->getMessage()], 500);
        }
    }

    public function show(Exam $exam): JsonResponse
    {
        return response()->json([
            'data' => $exam->load('fields')
        ]);
    }

    public function update(ExamRequest $request, Exam $exam): JsonResponse
    {
        DB::beginTransaction();
        try {
            $validated = $request->validated();

            // ✅ Asegurar que price sea numérico y con 2 decimales
            if (isset($validated['price'])) {
                $validated['price'] = round(floatval($validated['price']), 2);
            }

            $exam->update($validated);

            if ($request->has('fields')) {
                // Eliminar campos existentes
                $exam->fields()->delete();

                // Crear nuevos campos
                foreach ($request->fields as $index => $fieldData) {
                    ExamField::create([
                        'exam_id' => $exam->id,
                        'field_name' => $fieldData['field_name'],
                        'field_type' => $fieldData['field_type'],
                        'unit' => $fieldData['unit'] ?? null,
                        'ref_min' => $fieldData['ref_min'] ?? null,
                        'ref_max' => $fieldData['ref_max'] ?? null,
                        'options' => $fieldData['options'] ?? null,
                        'is_required' => $fieldData['is_required'] ?? false,
                        'is_reference' => $fieldData['is_reference'] ?? false,
                        'sort_order' => $fieldData['sort_order'] ?? $index,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Examen actualizado exitosamente',
                'data' => $exam->fresh('fields')
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al actualizar examen: ' . $e->getMessage());
            return response()->json(['message' => 'Error al actualizar examen', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Exam $exam): JsonResponse
    {
        $exam->delete();
        return response()->json(['message' => 'Examen eliminado exitosamente']);
    }

    public function toggleStatus(Exam $exam): JsonResponse
    {
        $exam->update(['is_active' => !$exam->is_active]);
        return response()->json([
            'message' => 'Estado actualizado',
            'is_active' => $exam->is_active
        ]);
    }
}
