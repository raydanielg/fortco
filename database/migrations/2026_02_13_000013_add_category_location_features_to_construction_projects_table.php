<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('construction_projects', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable()->after('id')
                ->constrained('construction_project_categories')->nullOnDelete();
            $table->foreignId('location_id')->nullable()->after('category_id')
                ->constrained('construction_locations')->nullOnDelete();
            $table->json('features')->nullable()->after('description');

            $table->index(['category_id', 'status']);
            $table->index(['location_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::table('construction_projects', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropForeign(['location_id']);
            $table->dropColumn(['category_id', 'location_id', 'features']);
        });
    }
};
