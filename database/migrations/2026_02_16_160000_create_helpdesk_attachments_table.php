<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('helpdesk_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('helpdesk_message_id')->constrained('helpdesk_messages')->cascadeOnDelete();
            $table->string('kind', 30);
            $table->string('original_name')->nullable();
            $table->string('mime')->nullable();
            $table->unsignedBigInteger('size')->nullable();
            $table->string('path');
            $table->timestamps();

            $table->index(['helpdesk_message_id', 'kind']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('helpdesk_attachments');
    }
};
