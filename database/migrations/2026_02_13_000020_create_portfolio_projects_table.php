<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('portfolio_projects', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('type')->default('featured');
            $table->string('name');
            $table->string('location')->nullable();
            $table->unsignedSmallInteger('year')->nullable();
            $table->string('category')->nullable();
            $table->string('value')->nullable();
            $table->text('desc')->nullable();
            $table->json('features')->nullable();
            $table->json('occupied_by')->nullable();
            $table->text('testimonial')->nullable();

            $table->string('expected')->nullable();
            $table->string('progress')->nullable();
            $table->json('status_updates')->nullable();

            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(true);

            $table->timestamps();

            $table->index(['type', 'is_published', 'sort_order']);
            $table->index(['year', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolio_projects');
    }
};
