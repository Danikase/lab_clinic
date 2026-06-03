<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('exam_fields', function (Blueprint $table) {
            $table->boolean('is_reference')->default(false)->after('is_required');
            // Si es TRUE = el campo es solo referencia (no se edita)
            // Si es FALSE = el campo requiere resultado (se edita)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('exam_fields', function (Blueprint $table) {
            //
        });
    }
};
