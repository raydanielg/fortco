<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('construction_worker_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('worker_id')->constrained('construction_workers')->cascadeOnDelete();
            $table->string('type');
            $table->string('status')->default('pending');
            $table->date('expiry_date')->nullable();
            $table->text('notes')->nullable();
            $table->string('file_path')->nullable();
            $table->timestamps();

            $table->unique(['worker_id', 'type']);
            $table->index(['type', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('construction_worker_documents');
    }
};
