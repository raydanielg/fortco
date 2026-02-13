<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ConstructionWorkerGroup extends Model
{
    protected $fillable = [
        'name',
        'type',
    ];

    public function workers(): HasMany
    {
        return $this->hasMany(ConstructionWorker::class, 'group_id');
    }

    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(ConstructionProject::class, 'construction_project_worker_group', 'group_id', 'project_id')
            ->withTimestamps();
    }
}
