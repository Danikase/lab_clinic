<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PatientRequest;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth; // ✅ Agregado para mejor análisis estático

class PatientController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Patient::query();

        if ($request->has('search')) {
            $query->search($request->search);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // ✅ Cambiado get() por input() (Laravel 11+ prefiere input)
        $patients = $query->latest()
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        return response()->json($patients);
    }

    public function store(PatientRequest $request): JsonResponse
    {
        $patient = Patient::create([
            ...$request->validated(),
            'created_by' => Auth::id(), // ✅ Reemplazado auth()->id()
        ]);

        return response()->json([
            'message' => 'Paciente registrado exitosamente',
            'data' => $patient->load(['createdBy'])
        ], 201);
    }

    public function show(Patient $patient): JsonResponse
    {
        return response()->json([
            'data' => $patient->load(['createdBy', 'updatedBy']) // ✅ labOrders comentado temporalmente
        ]);
    }

    public function update(PatientRequest $request, Patient $patient): JsonResponse
    {
        $patient->update([
            ...$request->validated(),
            'updated_by' => Auth::id(), // ✅ Reemplazado
        ]);

        return response()->json([
            'message' => 'Paciente actualizado exitosamente',
            'data' => $patient->fresh(['updatedBy'])
        ]);
    }

    public function destroy(Patient $patient): JsonResponse
    {
        $patient->delete();
        return response()->json(['message' => 'Paciente eliminado exitosamente']);
    }

    public function toggleStatus(Patient $patient): JsonResponse
    {
        $patient->update([
            'is_active' => !$patient->is_active,
            'updated_by' => Auth::id(), // ✅ Reemplazado
        ]);

        return response()->json([
            'message' => 'Estado del paciente actualizado',
            'is_active' => $patient->is_active
        ]);
    }
}
