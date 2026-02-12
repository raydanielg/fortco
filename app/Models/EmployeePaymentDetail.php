<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeePaymentDetail extends Model
{
    protected $fillable = [
        'employee_id',
        'payment_method',
        'bank_name',
        'bank_account_name',
        'bank_account_number',
        'mobile_money_provider',
        'mobile_money_number',
        'tax_number',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
