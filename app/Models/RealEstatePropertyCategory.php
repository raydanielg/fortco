<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RealEstatePropertyCategory extends Model
{
    protected $table = 'real_estate_property_categories';

    protected $fillable = [
        'name',
    ];
}
