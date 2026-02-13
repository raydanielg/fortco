<?php

use App\Models\Setting;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        Setting::setValue('theme_direction', 'ltr', 'theme');
        Setting::setValue('theme_mode', 'light', 'theme');
        Setting::setValue('theme_bg', '#f7f5f0', 'theme');
    }

    public function down(): void
    {
        // no-op
    }
};
