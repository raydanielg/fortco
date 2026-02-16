<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Carbon;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            if (!Schema::hasColumn('tasks', 'year')) {
                $table->unsignedSmallInteger('year')->nullable()->after('parent_task_id');
                $table->index(['year', 'created_at']);
            }

            if (!Schema::hasColumn('tasks', 'approved_at')) {
                $table->timestamp('approved_at')->nullable()->after('due_at');
            }

            if (!Schema::hasColumn('tasks', 'approved_by')) {
                $table->foreignId('approved_by')->nullable()->after('approved_at')->constrained('users')->nullOnDelete();
                $table->index(['approved_by', 'approved_at']);
            }
        });

        if (Schema::hasColumn('tasks', 'year')) {
            $currentYear = (int) Carbon::now()->year;
            DB::table('tasks')->whereNull('year')->update(['year' => $currentYear]);
        }
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            if (Schema::hasColumn('tasks', 'approved_by')) {
                $table->dropConstrainedForeignId('approved_by');
            }

            if (Schema::hasColumn('tasks', 'approved_at')) {
                $table->dropColumn('approved_at');
            }

            if (Schema::hasColumn('tasks', 'year')) {
                $table->dropIndex('tasks_year_created_at_index');
                $table->dropColumn('year');
            }
        });
    }
};
