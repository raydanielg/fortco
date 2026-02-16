<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('front_settings', function (Blueprint $table) {
            $table->id();
            $table->string('section')->index();
            $table->string('key')->index();
            $table->json('value')->nullable();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['section', 'key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('front_settings');
    }
};
