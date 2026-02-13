<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('database_backups', function (Blueprint $table) {
            $table->id();
            $table->string('filename')->unique();
            $table->string('driver', 20);
            $table->unsignedBigInteger('size_bytes')->default(0);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->string('source', 20)->default('generated');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('database_backups');
    }
};
