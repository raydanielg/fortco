<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\AdminFaqController;
use App\Http\Controllers\Admin\DatabaseBackupController;
use App\Http\Controllers\Admin\FrontSettingsController;
use App\Http\Controllers\Admin\RestApiInventoryController;
use App\Http\Controllers\Admin\RolePermissionController;
use App\Http\Controllers\Admin\SecurityController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\UserManagementPagesController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::post('/locale', function (Request $request) {
    $locale = (string) $request->input('locale', '');
    if ($locale !== '') {
        $request->session()->put('locale', $locale);
    }

    return back()->withCookie(cookie('locale', $locale, 60 * 24 * 365));
})->name('locale.set');

Route::prefix('webhooks')->group(function () {
    Route::post('payment/pesapal', [\App\Http\Controllers\PaymentWebhookController::class, 'pesapal'])->name('webhooks.payment.pesapal');
    Route::post('payment/selcom', [\App\Http\Controllers\PaymentWebhookController::class, 'selcom'])->name('webhooks.payment.selcom');
    Route::post('payment/zenopay', [\App\Http\Controllers\PaymentWebhookController::class, 'zenopay'])->name('webhooks.payment.zenopay');
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

Route::get('/api/timezones', function () {
    $now = new \DateTimeImmutable('now', new \DateTimeZone('UTC'));

    $timezones = [];
    foreach (\DateTimeZone::listIdentifiers() as $tz) {
        $tzObj = new \DateTimeZone($tz);
        $offsetSeconds = $tzObj->getOffset($now);
        $sign = $offsetSeconds >= 0 ? '+' : '-';
        $abs = abs($offsetSeconds);
        $hours = str_pad((string) floor($abs / 3600), 2, '0', STR_PAD_LEFT);
        $mins = str_pad((string) floor(($abs % 3600) / 60), 2, '0', STR_PAD_LEFT);

        $timezones[] = [
            'value' => $tz,
            'offset' => $offsetSeconds,
            'label' => "(GMT{$sign}{$hours}:{$mins}) {$tz}",
        ];
    }

    usort($timezones, fn ($a, $b) => $a['offset'] <=> $b['offset']);

    return response()->json($timezones);
})->name('api.timezones');

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
        Route::get('dashboard/metrics', [DashboardController::class, 'metrics'])->name('admin.dashboard.metrics');

        Route::get('analytics', [DashboardController::class, 'analytics'])->name('admin.analytics');
        Route::get('analytics/data', [DashboardController::class, 'analyticsData'])->name('admin.analytics.data');

        Route::get('system-health', [DashboardController::class, 'systemHealth'])->name('admin.system-health');
        Route::get('system-health/data', [DashboardController::class, 'systemHealthData'])->name('admin.system-health.data');

        Route::prefix('user-management')->group(function () {
            Route::get('users', [UserManagementPagesController::class, 'users'])->name('admin.user-management.users');
            Route::get('employees', [UserManagementPagesController::class, 'employees'])->name('admin.user-management.employees');
            Route::get('roles', [UserManagementPagesController::class, 'roles'])->name('admin.user-management.roles');
            Route::get('permissions', [UserManagementPagesController::class, 'permissions'])->name('admin.user-management.permissions');
            Route::get('sessions-logs', [UserManagementPagesController::class, 'sessionsLogs'])->name('admin.user-management.sessions-logs');
        });

        Route::get('settings', [SettingsController::class, 'index'])->name('admin.settings');
        Route::post('settings', [SettingsController::class, 'update'])->name('admin.settings.update');
        Route::post('settings/upload', [SettingsController::class, 'updateUploadSettings'])->name('admin.settings.upload.update');
        Route::post('settings/maps', [SettingsController::class, 'updateMapsSettings'])->name('admin.settings.maps.update');
        Route::post('settings/language', [SettingsController::class, 'updateLanguageSettings'])->name('admin.settings.language.update');
        Route::post('settings/language/auto-translate', [SettingsController::class, 'autoTranslateLanguages'])->name('admin.settings.language.auto_translate');
        Route::post('settings/currency', [SettingsController::class, 'updateCurrencySettings'])->name('admin.settings.currency.update');
        Route::post('settings/payment', [SettingsController::class, 'updatePaymentSettings'])->name('admin.settings.payment.update');
        Route::post('settings/storage', [SettingsController::class, 'updateStorageSettings'])->name('admin.settings.storage.update');
        Route::post('settings/social-login', [SettingsController::class, 'updateSocialLoginSettings'])->name('admin.settings.social_login.update');
        Route::post('settings/google-calendar', [SettingsController::class, 'updateGoogleCalendarSettings'])->name('admin.settings.google_calendar.update');
        Route::post('settings/theme', [SettingsController::class, 'updateThemeSettings'])->name('admin.settings.theme.update');
        Route::post('settings/modules', [SettingsController::class, 'updateModuleSettings'])->name('admin.settings.modules.update');
        Route::post('settings/notification/smtp', [SettingsController::class, 'updateSmtpSettings'])->name('admin.settings.notification.smtp.update');
        Route::post('settings/notification/sms', [SettingsController::class, 'updateSmsSettings'])->name('admin.settings.notification.sms.update');
        Route::post('settings/profile', [SettingsController::class, 'updateProfileSettings'])->name('admin.settings.profile.update');
        Route::post('settings/profile/avatar', [SettingsController::class, 'updateProfileAvatar'])->name('admin.settings.profile.avatar');
        Route::post('settings/profile/documents', [SettingsController::class, 'uploadProfileDocument'])->name('admin.settings.profile.documents.upload');
        Route::delete('settings/profile/documents/{mediaId}', [SettingsController::class, 'deleteProfileDocument'])->name('admin.settings.profile.documents.delete');
        Route::get('front-settings', [FrontSettingsController::class, 'index'])->name('admin.front-settings');
        Route::get('faq', [AdminFaqController::class, 'index'])->name('admin.faq');

        Route::get('role-permission', [RolePermissionController::class, 'index'])->name('admin.role-permission');
        Route::get('role-permission/data', [RolePermissionController::class, 'data'])->name('admin.role-permission.data');
        Route::post('role-permission/roles', [RolePermissionController::class, 'storeRole'])->name('admin.role-permission.roles.store');
        Route::put('role-permission/roles/{role}', [RolePermissionController::class, 'updateRole'])->name('admin.role-permission.roles.update');
        Route::delete('role-permission/roles/{role}', [RolePermissionController::class, 'destroyRole'])->name('admin.role-permission.roles.destroy');
        Route::post('role-permission/permissions', [RolePermissionController::class, 'storePermission'])->name('admin.role-permission.permissions.store');
        Route::delete('role-permission/permissions/{permission}', [RolePermissionController::class, 'destroyPermission'])->name('admin.role-permission.permissions.destroy');
        Route::put('role-permission/roles/{role}/permissions', [RolePermissionController::class, 'syncRolePermissions'])->name('admin.role-permission.roles.permissions.sync');

        Route::prefix('security')->group(function () {
            Route::get('main', [SecurityController::class, 'main'])->name('admin.security.main');
            Route::post('main', [SecurityController::class, 'updateMain'])->name('admin.security.main.update');
            Route::get('users', [SecurityController::class, 'users'])->name('admin.security.users');
            Route::get('employees', [SecurityController::class, 'employees'])->name('admin.security.employees');
            Route::post('users/{user}/ban', [SecurityController::class, 'banUser'])->name('admin.security.users.ban');
            Route::post('users/{user}/unban', [SecurityController::class, 'unbanUser'])->name('admin.security.users.unban');
            Route::post('users/{user}/password-reset', [SecurityController::class, 'sendPasswordResetLink'])->name('admin.security.users.password-reset');
            Route::delete('users/{user}', [SecurityController::class, 'deleteUser'])->name('admin.security.users.delete');
            Route::get('users/{user}/sessions', [SecurityController::class, 'userSessions'])->name('admin.security.users.sessions');
            Route::get('users/{user}/logs', [SecurityController::class, 'userLogs'])->name('admin.security.users.logs');
            Route::delete('users/{user}/sessions/{sessionId}', [SecurityController::class, 'deleteUserSession'])->name('admin.security.users.sessions.delete');
            Route::delete('users/{user}/sessions', [SecurityController::class, 'clearUserSessions'])->name('admin.security.users.sessions.clear');
            Route::get('logs/tail', [SecurityController::class, 'tailLogs'])->name('admin.security.logs.tail');
        });

        Route::get('rest-api/inventory', [RestApiInventoryController::class, 'index'])->name('admin.rest-api.inventory');

        Route::prefix('database-backups')->group(function () {
            Route::get('/', [DatabaseBackupController::class, 'index'])->name('admin.database-backups.index');
            Route::post('generate', [DatabaseBackupController::class, 'generate'])->name('admin.database-backups.generate');
            Route::post('restore', [DatabaseBackupController::class, 'restore'])->name('admin.database-backups.restore');
            Route::get('{file}/download', [DatabaseBackupController::class, 'download'])->name('admin.database-backups.download');
            Route::delete('{file}', [DatabaseBackupController::class, 'destroy'])->name('admin.database-backups.destroy');
        });
    });
});

require __DIR__.'/auth.php';
