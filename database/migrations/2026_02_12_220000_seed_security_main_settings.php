<?php

use App\Models\Setting;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        Setting::setValue('security_pyramid_l1_enabled', '1', 'security');
        Setting::setValue('security_pyramid_l2_enabled', '1', 'security');
        Setting::setValue('security_pyramid_l3_enabled', '1', 'security');
        Setting::setValue('security_pyramid_l4_enabled', '1', 'security');
        Setting::setValue('security_pyramid_l5_enabled', '1', 'security');
        Setting::setValue('security_pyramid_l6_enabled', '1', 'security');
        Setting::setValue('security_pyramid_l7_enabled', '1', 'security');

        Setting::setValue('security_maintenance_enabled', '0', 'security');
        Setting::setValue('security_maintenance_message', '', 'security');
    }

    public function down(): void
    {
        // no-op
    }
};
