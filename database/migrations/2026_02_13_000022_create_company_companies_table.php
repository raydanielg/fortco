<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_companies', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('tin_number');
            $table->timestamps();

            $table->unique('tin_number');
            $table->index('full_name');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_companies');
    }
};
