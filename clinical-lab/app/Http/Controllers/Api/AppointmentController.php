<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class AppointmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Appointment::with(['patient', 'createdBy']);

        // Filtro por fecha
        if ($request->has('date')) {
            $query->whereDate('appointment_date', $request->date);
        }

        // Filtro por estado
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $appointments = $query->orderBy('appointment_date')->get();

        return response()->json($appointments);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'type' => 'required|in:toma_muestra,entrega_resultados,consulta',
            'appointment_date' => 'required|date|after:now',
            'notes' => 'nullable|string|max:500',
        ]);

        $appointment = Appointment::create([
            'patient_id' => $request->patient_id,
            'type' => $request->type,
            'appointment_date' => $request->appointment_date,
            'status' => 'scheduled',
            'notes' => $request->notes,
            'created_by' => Auth::id(),
        ]);

        return response()->json([
            'message' => 'Cita agendada correctamente',
            'data' => $appointment->load(['patient'])
        ], 201);
    }

    public function updateStatus(Request $request, Appointment $appointment): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:scheduled,completed,cancelled,no_show',
        ]);

        $appointment->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Estado actualizado',
            'data' => $appointment
        ]);
    }

    public function destroy(Appointment $appointment): JsonResponse
    {
        $appointment->delete();
        return response()->json(['message' => 'Cita eliminada']);
    }
}
