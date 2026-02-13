<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyVendor extends Model
{
    protected $fillable = [
        'company_name',
        'tin_number',
        'verification_document_path',
        'verification_status',
    ];
}
