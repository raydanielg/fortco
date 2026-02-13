<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('construction_project_worker_group', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('construction_projects')->cascadeOnDelete();
            $table->foreignId('group_id')->constrained('construction_worker_groups')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['project_id', 'group_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('construction_project_worker_group');
    }
};
