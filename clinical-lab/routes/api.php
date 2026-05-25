<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\ExamController;
use App\Http\Controllers\Api\LabOrderController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\UserController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Pacientes
    Route::prefix('patients')->group(function () {
        Route::get('/', [PatientController::class, 'index']);
        Route::post('/', [PatientController::class, 'store']);
        Route::get('/{patient}', [PatientController::class, 'show']);
        Route::put('/{patient}', [PatientController::class, 'update']);
        Route::delete('/{patient}', [PatientController::class, 'destroy']);
        Route::post('/{patient}/toggle-status', [PatientController::class, 'toggleStatus']);
    });

    // Exámenes
    Route::prefix('exams')->group(function () {
        Route::get('/', [ExamController::class, 'index']);
        Route::post('/', [ExamController::class, 'store']);
        Route::get('/{exam}', [ExamController::class, 'show']);
        Route::put('/{exam}', [ExamController::class, 'update']);
        Route::delete('/{exam}', [ExamController::class, 'destroy']);
        Route::post('/{exam}/toggle-status', [ExamController::class, 'toggleStatus']);
    });

    // Órdenes de laboratorio
    Route::prefix('lab-orders')->group(function () {
        Route::get('/', [LabOrderController::class, 'index']);
        Route::get('/create-form', [LabOrderController::class, 'createForm']);
        Route::get('/patient/{patientId}/history', [LabOrderController::class, 'patientHistory']);
        Route::get('/{order}/resume', [LabOrderController::class, 'resume']);
        Route::get('/{order}', [LabOrderController::class, 'show']);
        Route::post('/', [LabOrderController::class, 'store']);
        Route::post('/{order}/results', [LabOrderController::class, 'saveResults']);
        Route::get('/{order}/download-pdf', [LabOrderController::class, 'downloadPdf']);
    });

    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    // Rutas para citas
    Route::prefix('appointments')->group(function () {
        Route::get('/', [AppointmentController::class, 'index']);
        Route::post('/', [AppointmentController::class, 'store']);
        Route::post('/{appointment}/status', [AppointmentController::class, 'updateStatus']);
        Route::delete('/{appointment}', [AppointmentController::class, 'destroy']);
    });

    // Rutas de Perfil
    Route::get('/profile', [App\Http\Controllers\Api\UserController::class, 'profile']);
    Route::put('/profile', [App\Http\Controllers\Api\UserController::class, 'updateProfile']);
    Route::put('/password', [App\Http\Controllers\Api\UserController::class, 'changePassword']);
});
