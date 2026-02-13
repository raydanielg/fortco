<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('real_estate_property_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->nullable()->constrained('real_estate_properties')->nullOnDelete();
            $table->string('property_title')->nullable();
            $table->string('full_name');
            $table->string('phone_number');
            $table->string('status')->default('received');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('real_estate_property_bookings');
    }
};
