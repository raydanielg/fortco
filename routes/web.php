<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\AdminFaqController;
use App\Http\Controllers\Admin\FrontSettingsController;
use App\Http\Controllers\Admin\SettingsController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/api/hero-slides', function () {
    $dir = public_path('slides');
    if (!File::exists($dir)) {
        return response()->json([]);
    }

    $ordered = [
        'beautiful-view-construction-site-city-building_653669-11417.jpg',
        'beautiful-view-construction-site-city-sunset_181624-9347.jpg',
        'building-new-concrete-houses_1398-3932.jpg',
        'close-up-hard-hat-holding-by-construction-worker_329181-2825.jpg',
        'construction-silhouette_1127-2991.jpg',
        'construction-silhouette_1127-3246.jpg',
        'construction-silhouette_1150-8336.jpg',
        'construction-site-silhouettes_1127-3253.jpg',
        'construction-works-frankfurt-downtown-germany_1268-20907.jpg',
        'excavator-action_1112-1598.jpg',
        'heavy-machines-construction-workers-working-building_181624-8234.jpg',
        'photo-construction-site-engineers-workers-labors_763111-52772.jpg',
        'power-plant-construction_1127-2891.jpg',
        'professional-engineer-team-working-engineering-worker-safety-hardhat-architect-looking_38052-4318.jpg',
        'warehouse-smiling-colleagues-scanning-cardboard-box-barcode-chatting_482257-77667.jpg',
        'working-housing-project_1098-17511.jpg',
        'young-black-race-man-with-blueprint-stading-near-glass-building_1157-50906.jpg',
    ];

    $urls = [];
    foreach ($ordered as $filename) {
        $path = $dir.DIRECTORY_SEPARATOR.$filename;
        if (File::exists($path)) {
            $urls[] = '/slides/'.$filename;
        }
    }

    return response()->json($urls);
})->name('hero.slides');

Route::get('/properties', function () {
    return Inertia::render('Properties', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('properties.index');

Route::get('/portfolio', function () {
    return Inertia::render('Portfolio/Index', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('portfolio.page');

Route::get('/gallery', function () {
    return Inertia::render('Gallery/Index', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('gallery.page');

Route::get('/about', function () {
    return Inertia::render('About', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('about.page');

Route::get('/services', function () {
    return Inertia::render('Services', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('services.page');

use App\Http\Controllers\DashboardController;

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::prefix('admin')->group(function () {
        Route::get('settings', [SettingsController::class, 'index'])->name('admin.settings');
        Route::get('front-settings', [FrontSettingsController::class, 'index'])->name('admin.front-settings');
        Route::get('faq', [AdminFaqController::class, 'index'])->name('admin.faq');
    });
});

require __DIR__.'/auth.php';
