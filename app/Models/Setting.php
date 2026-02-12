<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'group',
        'key',
        'value',
    ];

    public static function getValue(string $key, mixed $default = null): mixed
    {
        $row = static::query()->where('key', $key)->first();
        return $row?->value ?? $default;
    }

    public static function setValue(string $key, mixed $value, ?string $group = null): void
    {
        static::query()->updateOrCreate(
            ['key' => $key],
            [
                'group' => $group,
                'value' => is_scalar($value) || $value === null ? (string) $value : json_encode($value),
            ]
        );
    }
}
