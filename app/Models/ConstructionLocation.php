<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConstructionLocation extends Model
{
    protected $fillable = [
        'name',
        'region',
        'country',
    ];
}
