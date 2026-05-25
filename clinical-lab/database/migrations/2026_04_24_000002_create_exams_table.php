<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tabla de Exámenes (Hemograma, Glucosa, etc.)
        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->string('category')->nullable(); // Hematología, Química, etc.
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['code', 'is_active']);
            $table->index(['category']);
        });

        // Tabla de Campos del Examen (Campos dinámicos)
        Schema::create('exam_fields', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained()->cascadeOnDelete();
            $table->string('field_name'); // "Hemoglobina", "Glucosa", etc.
            $table->enum('field_type', ['text', 'number', 'select', 'boolean', 'range']);
            $table->string('unit')->nullable(); // "mg/dL", "%", "g/dL"
            $table->string('ref_min')->nullable(); // Valor mínimo de referencia
            $table->string('ref_max')->nullable(); // Valor máximo de referencia
            $table->json('options')->nullable(); // Para tipo 'select': ["Opción 1", "Opción 2"]
            $table->boolean('is_required')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index(['exam_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exam_fields');
        Schema::dropIfExists('exams');
    }
};
