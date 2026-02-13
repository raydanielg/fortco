<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ConstructionWorker extends Model
{
    protected $fillable = [
        'group_id',
        'name',
        'age',
        'date_of_birth',
        'nida',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
        ];
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(ConstructionWorkerGroup::class, 'group_id');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(ConstructionWorkerDocument::class, 'worker_id');
    }
}
