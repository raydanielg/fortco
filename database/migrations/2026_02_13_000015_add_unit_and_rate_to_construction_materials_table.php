<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('construction_materials', function (Blueprint $table) {
            $table->string('unit')->default('pcs')->after('name');
            $table->decimal('unit_rate', 14, 2)->nullable()->after('unit');

            $table->index('unit');
        });
    }

    public function down(): void
    {
        Schema::table('construction_materials', function (Blueprint $table) {
            $table->dropIndex(['unit']);
            $table->dropColumn(['unit', 'unit_rate']);
        });
    }
};
