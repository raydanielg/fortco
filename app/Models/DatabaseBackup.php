<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DatabaseBackup extends Model
{
    protected $fillable = [
        'filename',
        'driver',
        'size_bytes',
        'created_by',
        'source',
    ];
}
