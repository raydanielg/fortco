<?php

use Illuminate\Support\Facades\Route;
use Modules\LoanManagement\Http\Controllers\LoanManagementController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('loanmanagements', LoanManagementController::class)->names('loanmanagement');
});
