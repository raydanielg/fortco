<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskEvaluation extends Model
{
    protected $fillable = [
        'task_id',
        'user_id',
        'percent',
        'entry_date',
    ];

    protected function casts(): array
    {
        return [
            'entry_date' => 'date',
        ];
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
