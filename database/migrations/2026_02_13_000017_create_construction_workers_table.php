<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('construction_workers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('group_id')->constrained('construction_worker_groups')->cascadeOnDelete();
            $table->string('name');
            $table->unsignedTinyInteger('age')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('nida')->nullable();
            $table->timestamps();

            $table->index(['group_id', 'name']);
            $table->unique('nida');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('construction_workers');
    }
};
