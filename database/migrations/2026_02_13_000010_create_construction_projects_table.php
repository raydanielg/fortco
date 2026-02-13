<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('construction_projects', function (Blueprint $table) {
            $table->id();
            $table->string('code')->nullable();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('status')->default('planned');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->decimal('budget', 14, 2)->nullable();
            $table->timestamps();

            $table->index(['status', 'start_date']);
            $table->index('name');
            $table->unique('code');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('construction_projects');
    }
};
