<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        $rows = [
            ['group' => 'payment', 'key' => 'payment_provider', 'value' => 'pesapal'],

            ['group' => 'payment_pesapal', 'key' => 'pesapal_environment', 'value' => 'sandbox'],
            ['group' => 'payment_pesapal', 'key' => 'pesapal_consumer_key', 'value' => ''],
            ['group' => 'payment_pesapal', 'key' => 'pesapal_consumer_secret', 'value' => ''],

            ['group' => 'payment_selcom', 'key' => 'selcom_environment', 'value' => 'sandbox'],
            ['group' => 'payment_selcom', 'key' => 'selcom_vendor_id', 'value' => ''],
            ['group' => 'payment_selcom', 'key' => 'selcom_api_key', 'value' => ''],
            ['group' => 'payment_selcom', 'key' => 'selcom_api_secret', 'value' => ''],

            ['group' => 'payment_zenopay', 'key' => 'zenopay_environment', 'value' => 'sandbox'],
            ['group' => 'payment_zenopay', 'key' => 'zenopay_account_id', 'value' => ''],
            ['group' => 'payment_zenopay', 'key' => 'zenopay_api_key', 'value' => ''],
            ['group' => 'payment_zenopay', 'key' => 'zenopay_api_secret', 'value' => ''],

            ['group' => 'payment_webhook', 'key' => 'payment_webhook_secret', 'value' => ''],
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
            'payment_provider',
            'pesapal_environment',
            'pesapal_consumer_key',
            'pesapal_consumer_secret',
            'selcom_environment',
            'selcom_vendor_id',
            'selcom_api_key',
            'selcom_api_secret',
            'zenopay_environment',
            'zenopay_account_id',
            'zenopay_api_key',
            'zenopay_api_secret',
            'payment_webhook_secret',
        ])->delete();
    }
};
