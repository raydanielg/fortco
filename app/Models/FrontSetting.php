<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FrontSetting extends Model
{
    protected $fillable = [
        'section',
        'key',
        'value',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'value' => 'array',
        ];
    }
}
