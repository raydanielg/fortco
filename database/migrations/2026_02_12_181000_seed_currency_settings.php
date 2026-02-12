<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        $rows = [
            ['group' => 'currency', 'key' => 'currency_code', 'value' => 'USD'],
            ['group' => 'currency', 'key' => 'currency_symbol', 'value' => '$'],
            ['group' => 'currency', 'key' => 'currency_symbol_position', 'value' => 'before'],
            ['group' => 'currency', 'key' => 'currency_decimals', 'value' => '2'],
            ['group' => 'currency', 'key' => 'currency_decimal_separator', 'value' => '.'],
            ['group' => 'currency', 'key' => 'currency_thousand_separator', 'value' => ','],
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
            'currency_code',
            'currency_symbol',
            'currency_symbol_position',
            'currency_decimals',
            'currency_decimal_separator',
            'currency_thousand_separator',
        ])->delete();
    }
};
