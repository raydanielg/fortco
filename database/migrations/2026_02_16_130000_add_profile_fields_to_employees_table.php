<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->string('first_name')->nullable()->after('user_id');
            $table->string('middle_name')->nullable()->after('first_name');
            $table->string('last_name')->nullable()->after('middle_name');
            $table->date('hire_date')->nullable()->after('last_name');
            $table->string('national_id')->nullable()->after('hire_date');
            $table->string('department')->nullable()->after('national_id');
            $table->string('sex')->nullable()->after('department');
        });
    }

    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn([
                'first_name',
                'middle_name',
                'last_name',
                'hire_date',
                'national_id',
                'department',
                'sex',
            ]);
        });
    }
};
