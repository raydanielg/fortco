<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        $rows = [
            ['group' => 'social_login_google', 'key' => 'social_google_enabled', 'value' => '0'],
            ['group' => 'social_login_google', 'key' => 'social_google_client_id', 'value' => ''],
            ['group' => 'social_login_google', 'key' => 'social_google_client_secret', 'value' => ''],

            ['group' => 'social_login_apple', 'key' => 'social_apple_enabled', 'value' => '0'],
            ['group' => 'social_login_apple', 'key' => 'social_apple_client_id', 'value' => ''],
            ['group' => 'social_login_apple', 'key' => 'social_apple_client_secret', 'value' => ''],

            ['group' => 'social_login_facebook', 'key' => 'social_facebook_enabled', 'value' => '0'],
            ['group' => 'social_login_facebook', 'key' => 'social_facebook_client_id', 'value' => ''],
            ['group' => 'social_login_facebook', 'key' => 'social_facebook_client_secret', 'value' => ''],
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
            'social_google_enabled',
            'social_google_client_id',
            'social_google_client_secret',
            'social_apple_enabled',
            'social_apple_client_id',
            'social_apple_client_secret',
            'social_facebook_enabled',
            'social_facebook_client_id',
            'social_facebook_client_secret',
        ])->delete();
    }
};
