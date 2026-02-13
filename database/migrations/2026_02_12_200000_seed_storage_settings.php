<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        $rows = [
            ['group' => 'storage', 'key' => 'storage_default_disk', 'value' => 'public'],
            ['group' => 'storage', 'key' => 'storage_quota_mb', 'value' => '1024'],
            ['group' => 'storage', 'key' => 'storage_retention_days', 'value' => '0'],
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
            'storage_default_disk',
            'storage_quota_mb',
            'storage_retention_days',
        ])->delete();
    }
};
