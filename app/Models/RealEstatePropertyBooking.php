<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RealEstatePropertyBooking extends Model
{
    protected $table = 'real_estate_property_bookings';

    protected $fillable = [
        'property_id',
        'property_title',
        'full_name',
        'phone_number',
        'email',
        'status',
    ];

    public function property(): BelongsTo
    {
        return $this->belongsTo(RealEstateProperty::class, 'property_id');
    }
}
