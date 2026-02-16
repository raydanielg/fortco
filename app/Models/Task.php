<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Task extends Model
{
    protected $fillable = [
        'parent_task_id',
        'year',
        'title',
        'description',
        'status',
        'submission_count',
        'priority',
        'due_at',
        'approved_at',
        'approved_by',
        'assigned_to',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'due_at' => 'datetime',
            'approved_at' => 'datetime',
        ];
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_task_id');
    }

    public function subTasks(): HasMany
    {
        return $this->hasMany(self::class, 'parent_task_id');
    }

    public function evaluations(): HasMany
    {
        return $this->hasMany(TaskEvaluation::class);
    }
}
