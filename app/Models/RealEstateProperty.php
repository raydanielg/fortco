<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RealEstateProperty extends Model
{
    protected $table = 'real_estate_properties';

    protected $fillable = [
        'category_id',
        'title',
        'type',
        'status',
        'location',
        'price',
        'beds',
        'baths',
        'size',
        'image',
        'featured',
        'description',
    ];

    protected $casts = [
        'featured' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(RealEstatePropertyCategory::class, 'category_id');
    }
}
