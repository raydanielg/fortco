<?php

use App\Models\Setting;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        Setting::setValue('google_calendar_enabled', '0', 'google_calendar');
        Setting::setValue('google_calendar_client_id', '', 'google_calendar');
        Setting::setValue('google_calendar_client_secret', '', 'google_calendar');
        Setting::setValue('google_calendar_sync_enabled', '1', 'google_calendar');
        Setting::setValue('google_calendar_sync_interval_min', '10', 'google_calendar');
    }

    public function down(): void
    {
        // no-op
    }
};
