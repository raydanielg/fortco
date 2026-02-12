<?php

use Illuminate\Support\Facades\Route;
use Modules\LoanManagement\Http\Controllers\LoanManagementController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('loanmanagements', LoanManagementController::class)->names('loanmanagement');
});
