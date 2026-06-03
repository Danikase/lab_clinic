<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lab_orders', function (Blueprint $table) {
            $table->string('sample_type')->default('SANGRE')->after('exam_id');
            // Opciones comunes: SANGRE, ORINA, HECES, LCR, ESPERMA, etc.
        });
    }

    public function down(): void
    {
        Schema::table('lab_orders', function (Blueprint $table) {
            $table->dropColumn('sample_type');
        });
    }
};
