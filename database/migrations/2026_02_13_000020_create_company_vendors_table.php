<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_vendors', function (Blueprint $table) {
            $table->id();
            $table->string('company_name');
            $table->string('tin_number');
            $table->string('verification_document_path')->nullable();
            $table->string('verification_status')->default('pending');
            $table->timestamps();

            $table->unique('tin_number');
            $table->index('verification_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_vendors');
    }
};
