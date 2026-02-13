<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConstructionProject extends Model
{
    protected $fillable = [
        'category_id',
        'location_id',
        'code',
        'name',
        'description',
        'features',
        'status',
        'start_date',
        'end_date',
        'budget',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'budget' => 'decimal:2',
            'features' => 'array',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ConstructionProjectCategory::class, 'category_id');
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(ConstructionLocation::class, 'location_id');
    }
}
