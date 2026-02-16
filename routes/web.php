<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\AdminFaqController;
use App\Http\Controllers\Admin\DatabaseBackupController;
use App\Http\Controllers\Admin\FrontSettingsController;
use App\Http\Controllers\Admin\RestApiInventoryController;
use App\Http\Controllers\Admin\RolePermissionController;
use App\Http\Controllers\Admin\SecurityController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\ConstructionProjectsController;
use App\Http\Controllers\Admin\ConstructionPagesController;
use App\Http\Controllers\Admin\ConstructionMaterialsController;
use App\Http\Controllers\Admin\UserManagementPagesController;
use App\Http\Controllers\Admin\PortfolioProjectsController;
use App\Http\Controllers\Admin\ConstructionWorkersController;
use App\Http\Controllers\Admin\CompaniesPagesController;
use App\Http\Controllers\Admin\CompanyVendorsController;
use App\Http\Controllers\Admin\CompanyPartnersController;
use App\Http\Controllers\Admin\CompanyCompaniesController;
use App\Http\Controllers\Admin\TasksPagesController;
use App\Http\Controllers\Admin\TasksDataController;
use App\Http\Controllers\Admin\ReportsPagesController;
use App\Http\Controllers\Admin\RealEstatePagesController;
use App\Http\Controllers\Admin\RealEstatePropertiesController;
use App\Http\Controllers\Admin\RealEstateBookingsController;
use App\Http\Controllers\Admin\RealEstateClientsController;
use App\Http\Controllers\Admin\LoansPagesController;
use App\Http\Controllers\Admin\AppointmentsPagesController;
use App\Http\Controllers\Admin\BillingPagesController;
use App\Http\Controllers\Admin\SupportPagesController;
use App\Http\Controllers\Admin\SuperAdminPagesController;
use App\Http\Controllers\Admin\PackagesPagesController;
use App\Http\Controllers\Admin\OfflineRequestPagesController;
use App\Http\Controllers\Admin\PortfolioPagesController;
use App\Http\Controllers\Admin\HelpdeskMessagesController;
use App\Http\Controllers\Admin\KnowledgeBaseController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\PropertiesPageController;
use App\Http\Controllers\RealEstatePropertyBookingsController;
use App\Http\Controllers\HelpdeskChatController;
use App\Http\Controllers\SupportTicketsController;
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

Route::middleware(['auth'])->prefix('helpdesk')->group(function () {
    Route::get('chat', [HelpdeskChatController::class, 'index'])->name('helpdesk.chat');
    Route::get('chat/messages', [HelpdeskChatController::class, 'messages'])->name('helpdesk.chat.messages');
    Route::post('chat/messages', [HelpdeskChatController::class, 'store'])->name('helpdesk.chat.store');
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

Route::get('/api/front-settings/{section}', function (string $section) {
    $rows = \App\Models\FrontSetting::query()
        ->where('section', $section)
        ->get(['key', 'value']);

    $settings = [];
    foreach ($rows as $row) {
        $settings[$row->key] = $row->value;
    }

    return response()
        ->json([
        'section' => $section,
        'settings' => $settings,
    ])
        ->header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        ->header('Pragma', 'no-cache');
})->name('front-settings.public');

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

Route::get('/banned', function () {
    return Inertia::render('Banned');
})->middleware(['auth'])->name('banned');

Route::get('/properties', [PropertiesPageController::class, 'index'])->name('properties.index');
Route::post('/properties/book', [RealEstatePropertyBookingsController::class, 'store'])->name('properties.book');

Route::get('/portfolio', [PortfolioController::class, 'index'])->name('portfolio.page');

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

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::prefix('admin')->group(function () {
        Route::get('dashboard/metrics', [DashboardController::class, 'metrics'])->name('admin.dashboard.metrics');

        Route::get('analytics', [DashboardController::class, 'analytics'])->name('admin.analytics');
        Route::get('analytics/data', [DashboardController::class, 'analyticsData'])->name('admin.analytics.data');

        Route::get('system-health', [DashboardController::class, 'systemHealth'])->name('admin.system-health');
        Route::get('system-health/data', [DashboardController::class, 'systemHealthData'])->name('admin.system-health.data');

        Route::prefix('construction')->group(function () {
            Route::get('projects', [ConstructionPagesController::class, 'projects'])->name('admin.construction.projects');
            Route::get('projects/create', [ConstructionPagesController::class, 'createProject'])->name('admin.construction.projects.create');
            Route::get('project-categories', [ConstructionPagesController::class, 'projectCategories'])->name('admin.construction.project-categories');
            Route::get('locations', [ConstructionPagesController::class, 'locations'])->name('admin.construction.locations');
            Route::get('materials', [ConstructionPagesController::class, 'materials'])->name('admin.construction.materials');
            Route::get('workers', [ConstructionPagesController::class, 'workers'])->name('admin.construction.workers');

            Route::get('projects/data', [ConstructionProjectsController::class, 'data'])->name('admin.construction.projects.data');
            Route::post('projects', [ConstructionProjectsController::class, 'store'])->name('admin.construction.projects.store');
            Route::get('projects/export', [ConstructionProjectsController::class, 'export'])->name('admin.construction.projects.export');
            Route::delete('projects/{project}', [ConstructionProjectsController::class, 'destroy'])->name('admin.construction.projects.destroy');
            Route::delete('projects/bulk', [ConstructionProjectsController::class, 'bulkDestroy'])->name('admin.construction.projects.bulk-destroy');

            Route::get('project-categories/data', [ConstructionProjectsController::class, 'categories'])->name('admin.construction.project-categories.data');
            Route::post('project-categories', [ConstructionProjectsController::class, 'storeCategory'])->name('admin.construction.project-categories.store');
            Route::delete('project-categories/{category}', [ConstructionProjectsController::class, 'destroyCategory'])->name('admin.construction.project-categories.destroy');
            Route::put('project-categories/{category}', [ConstructionProjectsController::class, 'updateCategory'])->name('admin.construction.project-categories.update');
            Route::get('locations/data', [ConstructionProjectsController::class, 'locations'])->name('admin.construction.locations.data');
            Route::post('locations', [ConstructionProjectsController::class, 'storeLocation'])->name('admin.construction.locations.store');
            Route::post('locations/auto-create', [ConstructionProjectsController::class, 'autoCreateLocations'])->name('admin.construction.locations.auto-create');
            Route::put('locations/{location}', [ConstructionProjectsController::class, 'updateLocation'])->name('admin.construction.locations.update');
            Route::delete('locations/{location}', [ConstructionProjectsController::class, 'destroyLocation'])->name('admin.construction.locations.destroy');

            Route::get('materials/data', [ConstructionMaterialsController::class, 'data'])->name('admin.construction.materials.data');
            Route::post('materials', [ConstructionMaterialsController::class, 'store'])->name('admin.construction.materials.store');
            Route::put('materials/{material}', [ConstructionMaterialsController::class, 'update'])->name('admin.construction.materials.update');
            Route::delete('materials/{material}', [ConstructionMaterialsController::class, 'destroy'])->name('admin.construction.materials.destroy');

            Route::get('workers/groups', [ConstructionWorkersController::class, 'groups'])->name('admin.construction.workers.groups');
            Route::post('workers/groups', [ConstructionWorkersController::class, 'storeGroup'])->name('admin.construction.workers.groups.store');
            Route::put('workers/groups/{group}', [ConstructionWorkersController::class, 'updateGroup'])->name('admin.construction.workers.groups.update');
            Route::delete('workers/groups/{group}', [ConstructionWorkersController::class, 'destroyGroup'])->name('admin.construction.workers.groups.destroy');
            Route::get('workers/groups/{group}', [ConstructionWorkersController::class, 'groupDetails'])->name('admin.construction.workers.groups.show');

            Route::post('workers', [ConstructionWorkersController::class, 'storeWorker'])->name('admin.construction.workers.store');
            Route::put('workers/{worker}', [ConstructionWorkersController::class, 'updateWorker'])->name('admin.construction.workers.update');
            Route::delete('workers/{worker}', [ConstructionWorkersController::class, 'destroyWorker'])->name('admin.construction.workers.destroy');
            Route::put('worker-documents/{document}', [ConstructionWorkersController::class, 'updateDocument'])->name('admin.construction.workers.documents.update');

            Route::get('workers/projects', [ConstructionWorkersController::class, 'projects'])->name('admin.construction.workers.projects');
            Route::post('workers/groups/{group}/assign', [ConstructionWorkersController::class, 'assignGroupToProject'])->name('admin.construction.workers.groups.assign');
            Route::post('workers/groups/{group}/unassign', [ConstructionWorkersController::class, 'unassignGroupFromProject'])->name('admin.construction.workers.groups.unassign');
        });

        Route::prefix('real-estate')->group(function () {
            Route::get('properties', [RealEstatePagesController::class, 'properties'])->name('admin.real-estate.properties');
            Route::get('bookings', [RealEstatePagesController::class, 'bookings'])->name('admin.real-estate.bookings');
            Route::get('clients', [RealEstatePagesController::class, 'clients'])->name('admin.real-estate.clients');

            Route::get('clients/data', [RealEstateClientsController::class, 'data'])->name('admin.real-estate.clients.data');
            Route::get('clients/{client}', [RealEstateClientsController::class, 'show'])->name('admin.real-estate.clients.show');

            Route::get('bookings/data', [RealEstateBookingsController::class, 'data'])->name('admin.real-estate.bookings.data');
            Route::get('bookings/{booking}', [RealEstateBookingsController::class, 'show'])->name('admin.real-estate.bookings.show');
            Route::get('bookings/{booking}/invoice', [RealEstateBookingsController::class, 'invoice'])->name('admin.real-estate.bookings.invoice');
            Route::delete('bookings/{booking}', [RealEstateBookingsController::class, 'destroy'])->name('admin.real-estate.bookings.destroy');
            Route::put('bookings/{booking}/status', [RealEstateBookingsController::class, 'updateStatus'])->name('admin.real-estate.bookings.status');

            Route::get('properties/data', [RealEstatePropertiesController::class, 'data'])->name('admin.real-estate.properties.data');
            Route::post('properties', [RealEstatePropertiesController::class, 'store'])->name('admin.real-estate.properties.store');
            Route::delete('properties/{property}', [RealEstatePropertiesController::class, 'destroy'])->name('admin.real-estate.properties.destroy');

            Route::get('property-categories/data', [RealEstatePropertiesController::class, 'categories'])->name('admin.real-estate.property-categories.data');
            Route::post('property-categories', [RealEstatePropertiesController::class, 'storeCategory'])->name('admin.real-estate.property-categories.store');
            Route::delete('property-categories/{category}', [RealEstatePropertiesController::class, 'destroyCategory'])->name('admin.real-estate.property-categories.destroy');
        });

        Route::prefix('companies')->group(function () {
            Route::get('profile', [CompaniesPagesController::class, 'profile'])->name('admin.companies.profile');
            Route::get('partners', [CompaniesPagesController::class, 'partners'])->name('admin.companies.partners');
            Route::get('vendors', [CompaniesPagesController::class, 'vendors'])->name('admin.companies.vendors');

            Route::get('companies/data', [CompanyCompaniesController::class, 'data'])->name('admin.companies.companies.data');

            Route::get('partners/data', [CompanyPartnersController::class, 'data'])->name('admin.companies.partners.data');
            Route::post('partners', [CompanyPartnersController::class, 'store'])->name('admin.companies.partners.store');
            Route::delete('partners/{partner}', [CompanyPartnersController::class, 'destroy'])->name('admin.companies.partners.destroy');

            Route::get('vendors/data', [CompanyVendorsController::class, 'data'])->name('admin.companies.vendors.data');
            Route::post('vendors', [CompanyVendorsController::class, 'store'])->name('admin.companies.vendors.store');
            Route::delete('vendors/{vendor}', [CompanyVendorsController::class, 'destroy'])->name('admin.companies.vendors.destroy');
            Route::get('vendors/{vendor}/download', [CompanyVendorsController::class, 'download'])->name('admin.companies.vendors.download');
            Route::get('vendors/{vendor}/preview', [CompanyVendorsController::class, 'preview'])->name('admin.companies.vendors.preview');
            Route::put('vendors/{vendor}/status', [CompanyVendorsController::class, 'updateStatus'])->name('admin.companies.vendors.status');
        });

        Route::prefix('portfolio')->group(function () {
            Route::get('projects', [PortfolioProjectsController::class, 'index'])->name('admin.portfolio-projects');
            Route::get('projects/data', [PortfolioProjectsController::class, 'data'])->name('admin.portfolio-projects.data');
            Route::post('projects', [PortfolioProjectsController::class, 'store'])->name('admin.portfolio-projects.store');
            Route::get('projects/export', [PortfolioProjectsController::class, 'export'])->name('admin.portfolio-projects.export');
            Route::delete('projects/bulk', [PortfolioProjectsController::class, 'bulkDestroy'])->name('admin.portfolio-projects.bulk-destroy');
        });

        Route::prefix('user-management')->middleware('any_role:Super Admin,Admin,HR')->group(function () {
            Route::get('users', [UserManagementPagesController::class, 'users'])->name('admin.user-management.users');
            Route::get('employees', [UserManagementPagesController::class, 'employees'])->name('admin.user-management.employees');
            Route::get('roles', [UserManagementPagesController::class, 'roles'])->name('admin.user-management.roles');
            Route::get('permissions', [UserManagementPagesController::class, 'permissions'])->name('admin.user-management.permissions');
            Route::get('sessions-logs', [UserManagementPagesController::class, 'sessionsLogs'])->name('admin.user-management.sessions-logs');
        });

        Route::prefix('tasks')->group(function () {
            Route::get('employee', [TasksPagesController::class, 'employee'])->name('admin.tasks.employee');
            Route::get('assessment', [TasksPagesController::class, 'assessment'])->name('admin.tasks.assessment');
            Route::get('evaluation', [TasksPagesController::class, 'evaluation'])->name('admin.tasks.evaluation');
            Route::get('task', [TasksPagesController::class, 'task'])->name('admin.tasks.task');
            Route::get('{task}/sub-task', [TasksPagesController::class, 'subTask'])->name('admin.tasks.sub-task');
            Route::get('planning', [TasksPagesController::class, 'planning'])->name('admin.tasks.planning');

            // Data endpoints
            Route::get('data', [TasksDataController::class, 'list'])->name('admin.tasks.data');
            Route::get('planning/data', [TasksDataController::class, 'planning'])->name('admin.tasks.planning.data');
            Route::get('evaluation/data', [TasksDataController::class, 'evaluation'])->name('admin.tasks.evaluation.data');
            Route::get('{task}/evaluation/history', [TasksDataController::class, 'evaluationHistory'])->name('admin.tasks.evaluation.history');
            Route::post('{task}/evaluation', [TasksDataController::class, 'evaluationStore'])->name('admin.tasks.evaluation.store');
            Route::post('{task}/approve', [TasksDataController::class, 'approve'])->name('admin.tasks.approve');
            Route::post('{task}/rollback', [TasksDataController::class, 'rollback'])->name('admin.tasks.rollback');
            Route::post('{task}/submit', [TasksDataController::class, 'submit'])->name('admin.tasks.submit');
            Route::post('store', [TasksDataController::class, 'store'])->name('admin.tasks.store');
            Route::get('{task}', [TasksDataController::class, 'show'])->name('admin.tasks.show');
            Route::get('{task}/sub-tasks', [TasksDataController::class, 'subTasks'])->name('admin.tasks.sub-tasks');
            Route::post('{task}/sub-tasks', [TasksDataController::class, 'storeSubTask'])->name('admin.tasks.sub-tasks.store');
            Route::put('{task}', [TasksDataController::class, 'update'])->name('admin.tasks.update');
            Route::delete('{task}', [TasksDataController::class, 'destroy'])->name('admin.tasks.destroy');
        });

        Route::prefix('reports')->group(function () {
            Route::get('financial', [ReportsPagesController::class, 'financial'])->name('admin.reports.financial');
            Route::get('projects', [ReportsPagesController::class, 'projects'])->name('admin.reports.projects');
            Route::get('export', [ReportsPagesController::class, 'export'])->name('admin.reports.export');
        });

        Route::prefix('loans')->group(function () {
            Route::get('companies', [LoansPagesController::class, 'companies'])->name('admin.loans.companies');
            Route::get('applications', [LoansPagesController::class, 'applications'])->name('admin.loans.applications');
            Route::get('repayments', [LoansPagesController::class, 'repayments'])->name('admin.loans.repayments');
        });

        Route::prefix('appointments')->group(function () {
            Route::get('calendar', [AppointmentsPagesController::class, 'calendar'])->name('admin.appointments.calendar');
            Route::get('bookings', [AppointmentsPagesController::class, 'bookings'])->name('admin.appointments.bookings');
            Route::get('services', [AppointmentsPagesController::class, 'services'])->name('admin.appointments.services');
        });

        Route::prefix('billing')->group(function () {
            Route::get('invoices', [BillingPagesController::class, 'invoices'])->name('admin.billing.invoices');
            Route::get('transactions', [BillingPagesController::class, 'transactions'])->name('admin.billing.transactions');
            Route::get('gateways', [BillingPagesController::class, 'gateways'])->name('admin.billing.gateways');
        });

        Route::prefix('support')->group(function () {
            Route::get('tickets', [SupportPagesController::class, 'tickets'])->name('admin.support.tickets');
            Route::get('live-chat', [SupportPagesController::class, 'liveChat'])->name('admin.support.live-chat');
            Route::get('knowledge-base', [SupportPagesController::class, 'knowledgeBase'])->name('admin.support.knowledge-base');
            Route::get('knowledge-base/data', [KnowledgeBaseController::class, 'list'])->name('admin.knowledge-base.data');
            Route::get('knowledge-base/categories', [KnowledgeBaseController::class, 'listCategories'])->name('admin.knowledge-base.categories.data');
            Route::post('knowledge-base/categories', [KnowledgeBaseController::class, 'storeCategory'])->name('admin.knowledge-base.categories.store');
            Route::delete('knowledge-base/categories/{category}', [KnowledgeBaseController::class, 'destroyCategory'])->name('admin.knowledge-base.categories.destroy');
            Route::post('knowledge-base', [KnowledgeBaseController::class, 'store'])->name('admin.knowledge-base.store');
            Route::put('knowledge-base/{article}', [KnowledgeBaseController::class, 'update'])->name('admin.knowledge-base.update');
            Route::delete('knowledge-base/{article}', [KnowledgeBaseController::class, 'destroy'])->name('admin.knowledge-base.destroy');
            Route::get('helpdesk-messages', [SupportPagesController::class, 'helpdeskMessages'])->name('admin.support.helpdesk-messages');
        });

        Route::prefix('helpdesk')->middleware('any_role:Super Admin,Admin,HR')->group(function () {
            Route::get('conversations', [HelpdeskMessagesController::class, 'conversations'])->name('admin.helpdesk.conversations');
            Route::get('users/{user}/messages', [HelpdeskMessagesController::class, 'messages'])->name('admin.helpdesk.messages');
            Route::post('users/{user}/reply', [HelpdeskMessagesController::class, 'reply'])->name('admin.helpdesk.reply');
        });

        Route::prefix('super-admin')->group(function () {
            Route::get('system-audit', [SuperAdminPagesController::class, 'systemAudit'])->name('admin.super-admin.system-audit');
            Route::get('modules', [SuperAdminPagesController::class, 'modules'])->name('admin.super-admin.modules');
            Route::get('impersonate', [SuperAdminPagesController::class, 'impersonate'])->name('admin.super-admin.impersonate');
            Route::get('maintenance', [SuperAdminPagesController::class, 'maintenance'])->name('admin.super-admin.maintenance');
        });

        Route::prefix('packages')->group(function () {
            Route::get('subscriptions', [PackagesPagesController::class, 'subscriptions'])->name('admin.packages.subscriptions');
            Route::get('features', [PackagesPagesController::class, 'features'])->name('admin.packages.features');
            Route::get('pricing', [PackagesPagesController::class, 'pricing'])->name('admin.packages.pricing');
        });

        Route::prefix('offline-request')->group(function () {
            Route::get('pending', [OfflineRequestPagesController::class, 'pending'])->name('admin.offline-request.pending');
            Route::get('approved', [OfflineRequestPagesController::class, 'approved'])->name('admin.offline-request.approved');
            Route::get('rejected', [OfflineRequestPagesController::class, 'rejected'])->name('admin.offline-request.rejected');
        });

        Route::prefix('portfolio')->group(function () {
            Route::get('gallery', [PortfolioPagesController::class, 'gallery'])->name('admin.portfolio.gallery');
            Route::get('testimonials', [PortfolioPagesController::class, 'testimonials'])->name('admin.portfolio.testimonials');
            Route::get('awards', [PortfolioPagesController::class, 'awards'])->name('admin.portfolio.awards');
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
        Route::prefix('front-settings')->group(function () {
            Route::get('{section?}', [FrontSettingsController::class, 'index'])->name('admin.front-settings');
            Route::get('data/json', [FrontSettingsController::class, 'data'])->name('admin.front-settings.data');
            Route::post('data/json', [FrontSettingsController::class, 'update'])->name('admin.front-settings.update');
            Route::post('upload', [FrontSettingsController::class, 'upload'])->name('admin.front-settings.upload');
        });
        Route::get('faq', [AdminFaqController::class, 'index'])->name('admin.faq');

        Route::get('role-permission', [RolePermissionController::class, 'index'])->name('admin.role-permission');
        Route::get('role-permission/data', [RolePermissionController::class, 'data'])->name('admin.role-permission.data');
        Route::post('role-permission/roles', [RolePermissionController::class, 'storeRole'])->name('admin.role-permission.roles.store');
        Route::put('role-permission/roles/{role}', [RolePermissionController::class, 'updateRole'])->name('admin.role-permission.roles.update');
        Route::delete('role-permission/roles/{role}', [RolePermissionController::class, 'destroyRole'])->name('admin.role-permission.roles.destroy');
        Route::post('role-permission/permissions', [RolePermissionController::class, 'storePermission'])->name('admin.role-permission.permissions.store');
        Route::delete('role-permission/permissions/{permission}', [RolePermissionController::class, 'destroyPermission'])->name('admin.role-permission.permissions.destroy');
        Route::put('role-permission/roles/{role}/permissions', [RolePermissionController::class, 'syncRolePermissions'])->name('admin.role-permission.roles.permissions.sync');

        Route::prefix('security')->middleware('any_role:Super Admin,Admin,HR')->group(function () {
            Route::get('main', [SecurityController::class, 'main'])->name('admin.security.main');
            Route::post('main', [SecurityController::class, 'updateMain'])->name('admin.security.main.update');
            Route::get('users', [SecurityController::class, 'users'])->name('admin.security.users');
            Route::get('employees', [SecurityController::class, 'employees'])->name('admin.security.employees');
            Route::post('employees', [SecurityController::class, 'storeEmployee'])->name('admin.security.employees.store');
            Route::put('employees/{employee}', [SecurityController::class, 'updateEmployee'])->name('admin.security.employees.update');
            Route::post('users/{user}/ban', [SecurityController::class, 'banUser'])->name('admin.security.users.ban');
            Route::post('users/{user}/unban', [SecurityController::class, 'unbanUser'])->name('admin.security.users.unban');
            Route::post('users/{user}/password-reset-default', [SecurityController::class, 'resetUserPasswordDefault'])->name('admin.security.users.password-reset-default');
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

    Route::prefix('support')->group(function () {
        Route::get('tickets', [SupportTicketsController::class, 'index'])->name('support.tickets');
        Route::get('tickets/data', [SupportTicketsController::class, 'list'])->name('support.tickets.data');
        Route::get('tickets/assignees', [SupportTicketsController::class, 'assignees'])->name('support.tickets.assignees');
        Route::post('tickets', [SupportTicketsController::class, 'store'])->name('support.tickets.store');
        Route::get('tickets/{ticket}', [SupportTicketsController::class, 'show'])->name('support.tickets.show');
        Route::post('tickets/{ticket}/messages', [SupportTicketsController::class, 'message'])->name('support.tickets.messages.store');
        Route::put('tickets/{ticket}/assign', [SupportTicketsController::class, 'assign'])->name('support.tickets.assign');
        Route::put('tickets/{ticket}/status', [SupportTicketsController::class, 'status'])->name('support.tickets.status');
    });
});

require __DIR__.'/auth.php';
