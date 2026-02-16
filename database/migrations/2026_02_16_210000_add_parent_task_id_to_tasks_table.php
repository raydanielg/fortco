<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            if (!Schema::hasColumn('tasks', 'parent_task_id')) {
                $table->foreignId('parent_task_id')
                    ->nullable()
                    ->after('id')
                    ->constrained('tasks')
                    ->nullOnDelete();

                $table->index(['parent_task_id', 'created_at']);
            }
        });
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            if (Schema::hasColumn('tasks', 'parent_task_id')) {
                $table->dropConstrainedForeignId('parent_task_id');
            }
        });
    }
};
