<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        $rows = [
            ['group' => 'smtp', 'key' => 'smtp_enabled', 'value' => '0'],
            ['group' => 'smtp', 'key' => 'smtp_host', 'value' => ''],
            ['group' => 'smtp', 'key' => 'smtp_port', 'value' => ''],
            ['group' => 'smtp', 'key' => 'smtp_username', 'value' => ''],
            ['group' => 'smtp', 'key' => 'smtp_password', 'value' => ''],
            ['group' => 'smtp', 'key' => 'smtp_encryption', 'value' => 'tls'],
            ['group' => 'smtp', 'key' => 'smtp_from_address', 'value' => ''],
            ['group' => 'smtp', 'key' => 'smtp_from_name', 'value' => ''],

            ['group' => 'sms', 'key' => 'sms_enabled', 'value' => '0'],
            ['group' => 'sms', 'key' => 'sms_provider', 'value' => 'africastalking'],
            ['group' => 'sms', 'key' => 'sms_sender_id', 'value' => ''],
            ['group' => 'sms', 'key' => 'sms_api_key', 'value' => ''],
            ['group' => 'sms', 'key' => 'sms_username', 'value' => ''],
        ];

        foreach ($rows as $row) {
            DB::table('settings')->updateOrInsert(
                ['key' => $row['key']],
                [
                    'group' => $row['group'],
                    'value' => $row['value'],
                    'updated_at' => $now,
                    'created_at' => $now,
                ]
            );
        }
    }

    public function down(): void
    {
        DB::table('settings')->whereIn('key', [
            'smtp_enabled',
            'smtp_host',
            'smtp_port',
            'smtp_username',
            'smtp_password',
            'smtp_encryption',
            'smtp_from_address',
            'smtp_from_name',
            'sms_enabled',
            'sms_provider',
            'sms_sender_id',
            'sms_api_key',
            'sms_username',
        ])->delete();
    }
};
