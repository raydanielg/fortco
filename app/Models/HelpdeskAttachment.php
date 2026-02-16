<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HelpdeskAttachment extends Model
{
    protected $fillable = [
        'helpdesk_message_id',
        'kind',
        'original_name',
        'mime',
        'size',
        'path',
    ];

    public function message(): BelongsTo
    {
        return $this->belongsTo(HelpdeskMessage::class, 'helpdesk_message_id');
    }
}
