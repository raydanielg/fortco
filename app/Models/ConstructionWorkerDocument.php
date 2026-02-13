<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConstructionWorkerDocument extends Model
{
    protected $fillable = [
        'worker_id',
        'type',
        'status',
        'expiry_date',
        'notes',
        'file_path',
    ];

    protected function casts(): array
    {
        return [
            'expiry_date' => 'date',
        ];
    }

    public function worker(): BelongsTo
    {
        return $this->belongsTo(ConstructionWorker::class, 'worker_id');
    }
}
