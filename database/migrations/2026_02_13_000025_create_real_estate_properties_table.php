<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('real_estate_properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained('real_estate_property_categories')->nullOnDelete();
            $table->string('title');
            $table->string('type')->default('House');
            $table->string('status')->default('For Sale');
            $table->string('location')->nullable();
            $table->string('price')->nullable();
            $table->unsignedInteger('beds')->nullable();
            $table->unsignedInteger('baths')->nullable();
            $table->string('size')->nullable();
            $table->string('image')->nullable();
            $table->boolean('featured')->default(false);
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('real_estate_properties');
    }
};
