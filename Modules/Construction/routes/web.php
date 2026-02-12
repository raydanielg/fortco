<?php

use Illuminate\Support\Facades\Route;
use Modules\Construction\Http\Controllers\ConstructionController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('constructions', ConstructionController::class)->names('construction');
});
