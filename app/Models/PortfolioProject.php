<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioProject extends Model
{
    protected $fillable = [
        'slug',
        'type',
        'name',
        'location',
        'year',
        'category',
        'value',
        'desc',
        'features',
        'occupied_by',
        'testimonial',
        'expected',
        'progress',
        'status_updates',
        'sort_order',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'features' => 'array',
            'occupied_by' => 'array',
            'status_updates' => 'array',
            'is_published' => 'boolean',
            'year' => 'integer',
            'sort_order' => 'integer',
        ];
    }
}
