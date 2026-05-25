<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Órdenes de laboratorio (vincula paciente + examen + estado)
        Schema::create('lab_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->foreignId('exam_id')->constrained()->cascadeOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('status', ['pending', 'in_progress', 'completed', 'cancelled'])->default('pending');
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['patient_id', 'status']);
            $table->index(['exam_id']);
        });

        // Resultados individuales por campo
        Schema::create('exam_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lab_order_id')->constrained()->cascadeOnDelete();
            $table->string('field_name'); // Nombre del campo (ej: "Hemoglobina")
            $table->string('value')->nullable(); // Valor ingresado
            $table->enum('reference_status', ['normal', 'low', 'high', 'na'])->default('na');
            $table->timestamps();

            $table->index(['lab_order_id', 'field_name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exam_results');
        Schema::dropIfExists('lab_orders');
    }
};
