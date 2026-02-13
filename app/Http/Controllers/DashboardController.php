<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\LoginActivity;
use App\Models\Message;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DashboardController extends Controller
{
    /**
     * Display the dashboard based on user role.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        if ($user->hasRole('Super Admin')) {
            $days = 7;
            $from = now()->subDays($days - 1)->startOfDay();

            $dateKeys = collect(range(0, $days - 1))
                ->map(fn ($i) => $from->copy()->addDays($i)->format('Y-m-d'))
                ->values();

            $usersByDay = User::query()
                ->where('created_at', '>=', $from)
                ->selectRaw('DATE(created_at) as d, COUNT(*) as c')
                ->groupBy('d')
                ->pluck('c', 'd');

            $employeesByDay = Employee::query()
                ->where('created_at', '>=', $from)
                ->selectRaw('DATE(created_at) as d, COUNT(*) as c')
                ->groupBy('d')
                ->pluck('c', 'd');

            $activeSessions = 0;
            try {
                $activeSessions = (int) DB::table('sessions')
                    ->whereNotNull('user_id')
                    ->where('last_activity', '>=', now()->subMinutes(15)->timestamp)
                    ->count();
            } catch (\Throwable $e) {
                $activeSessions = 0;
            }

            return Inertia::render('Sessions/Dashboard/SuperAdmin/Index', [
                'auth' => [
                    'user' => $user,
                    'roles' => $user->getRoleNames(),
                    'permissions' => $user->getAllPermissions()->pluck('name'),
                ],
                'stats' => [
                    'totals' => [
                        'users' => (int) User::query()->count(),
                        'employees' => (int) Employee::query()->count(),
                        'roles' => (int) Role::query()->where('guard_name', 'web')->count(),
                        'permissions' => (int) Permission::query()->where('guard_name', 'web')->count(),
                        'active_sessions' => $activeSessions,
                        'banned_users' => (int) User::query()->whereNotNull('banned_at')->count(),
                    ],
                    'trends' => [
                        'labels' => $dateKeys,
                        'users_created' => $dateKeys->map(fn ($d) => (int) ($usersByDay[$d] ?? 0))->values(),
                        'employees_created' => $dateKeys->map(fn ($d) => (int) ($employeesByDay[$d] ?? 0))->values(),
                    ],
                ],
                'calendarEvents' => [],
            ]);
        }

        // Default fallback for other roles
        return Inertia::render('Dashboard');
    }

    public function metrics(Request $request)
    {
        $user = $request->user();
        if (!$user || !$user->hasRole('Super Admin')) {
            abort(403);
        }

        $days = 7;
        $from = now()->subDays($days - 1)->startOfDay();

        $dateKeys = collect(range(0, $days - 1))
            ->map(fn ($i) => $from->copy()->addDays($i)->format('Y-m-d'))
            ->values();

        $usersByDay = User::query()
            ->where('created_at', '>=', $from)
            ->selectRaw('DATE(created_at) as d, COUNT(*) as c')
            ->groupBy('d')
            ->pluck('c', 'd');

        $employeesByDay = Employee::query()
            ->where('created_at', '>=', $from)
            ->selectRaw('DATE(created_at) as d, COUNT(*) as c')
            ->groupBy('d')
            ->pluck('c', 'd');

        $loginsByDay = LoginActivity::query()
            ->where('logged_in_at', '>=', $from)
            ->selectRaw('DATE(logged_in_at) as d, COUNT(*) as c')
            ->groupBy('d')
            ->pluck('c', 'd');

        $activeSessions = 0;
        try {
            $activeSessions = (int) DB::table('sessions')
                ->whereNotNull('user_id')
                ->where('last_activity', '>=', now()->subMinutes(15)->timestamp)
                ->count();
        } catch (\Throwable $e) {
            $activeSessions = 0;
        }

        $taskTotal = (int) Task::query()->count();
        $taskOpen = (int) Task::query()->where('status', 'open')->count();
        $taskDone = (int) Task::query()->where('status', 'done')->count();
        $taskOverdue = (int) Task::query()
            ->whereIn('status', ['open', 'in_progress'])
            ->whereNotNull('due_at')
            ->where('due_at', '<', now())
            ->count();

        $unreadMessages = (int) Message::query()->whereNull('read_at')->count();
        $totalMessages = (int) Message::query()->count();

        $recentLogins = LoginActivity::query()
            ->with(['user:id,name,email,last_login_at,last_login_ip'])
            ->orderByDesc('logged_in_at')
            ->limit(10)
            ->get()
            ->map(fn (LoginActivity $a) => [
                'id' => $a->id,
                'user' => $a->user ? [
                    'id' => $a->user->id,
                    'name' => $a->user->name,
                    'email' => $a->user->email,
                ] : null,
                'ip' => $a->ip,
                'user_agent' => $a->user_agent,
                'logged_in_at' => optional($a->logged_in_at)->toISOString(),
            ])
            ->values();

        $lastUsersLogin = User::query()
            ->whereNotNull('last_login_at')
            ->orderByDesc('last_login_at')
            ->limit(8)
            ->get(['id', 'name', 'email', 'last_login_at', 'last_login_ip'])
            ->map(fn (User $u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'last_login_at' => optional($u->last_login_at)->toISOString(),
                'last_login_ip' => $u->last_login_ip,
            ])
            ->values();

        $taskStatusBreakdown = Task::query()
            ->selectRaw('status, COUNT(*) as c')
            ->groupBy('status')
            ->pluck('c', 'status');

        $calendarEvents = Task::query()
            ->whereNotNull('due_at')
            ->where('due_at', '>=', now()->subDays(30)->startOfDay())
            ->where('due_at', '<=', now()->addDays(60)->endOfDay())
            ->orderBy('due_at')
            ->limit(300)
            ->get(['id', 'title', 'status', 'due_at'])
            ->map(fn (Task $t) => [
                'id' => 'task-'.$t->id,
                'title' => $t->title,
                'start' => optional($t->due_at)->toISOString(),
                'allDay' => false,
                'extendedProps' => [
                    'kind' => 'task',
                    'task_id' => $t->id,
                    'status' => $t->status,
                ],
            ])
            ->values();

        return response()->json([
            'totals' => [
                'users' => (int) User::query()->count(),
                'employees' => (int) Employee::query()->count(),
                'roles' => (int) Role::query()->where('guard_name', 'web')->count(),
                'permissions' => (int) Permission::query()->where('guard_name', 'web')->count(),
                'active_sessions' => $activeSessions,
                'banned_users' => (int) User::query()->whereNotNull('banned_at')->count(),
                'tasks_total' => $taskTotal,
                'tasks_open' => $taskOpen,
                'tasks_done' => $taskDone,
                'tasks_overdue' => $taskOverdue,
                'messages_total' => $totalMessages,
                'messages_unread' => $unreadMessages,
            ],
            'trends' => [
                'labels' => $dateKeys,
                'users_created' => $dateKeys->map(fn ($d) => (int) ($usersByDay[$d] ?? 0))->values(),
                'employees_created' => $dateKeys->map(fn ($d) => (int) ($employeesByDay[$d] ?? 0))->values(),
                'logins' => $dateKeys->map(fn ($d) => (int) ($loginsByDay[$d] ?? 0))->values(),
            ],
            'pie' => [
                'task_status' => [
                    'labels' => array_values(array_map('strval', $taskStatusBreakdown->keys()->all())),
                    'values' => array_values(array_map('intval', $taskStatusBreakdown->values()->all())),
                ],
                'messages' => [
                    'labels' => ['Unread', 'Read'],
                    'values' => [$unreadMessages, max(0, $totalMessages - $unreadMessages)],
                ],
            ],
            'recent' => [
                'login_activities' => $recentLogins,
                'last_user_logins' => $lastUsersLogin,
            ],
            'calendarEvents' => $calendarEvents,
            'generated_at' => now()->toISOString(),
        ]);
    }

    public function analytics(Request $request): Response
    {
        $user = $request->user();
        if (!$user || !$user->hasRole('Super Admin')) {
            abort(403);
        }

        return Inertia::render('Sessions/Dashboard/SuperAdmin/Analytics/Index', [
            'auth' => [
                'user' => $user,
                'roles' => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name'),
            ],
        ]);
    }

    public function analyticsData(Request $request)
    {
        $user = $request->user();
        if (!$user || !$user->hasRole('Super Admin')) {
            abort(403);
        }

        $days = 14;
        $from = now()->subDays($days - 1)->startOfDay();
        $dateKeys = collect(range(0, $days - 1))
            ->map(fn ($i) => $from->copy()->addDays($i)->format('Y-m-d'))
            ->values();

        $usersByDay = User::query()
            ->where('created_at', '>=', $from)
            ->selectRaw('DATE(created_at) as d, COUNT(*) as c')
            ->groupBy('d')
            ->pluck('c', 'd');

        $employeesByDay = Employee::query()
            ->where('created_at', '>=', $from)
            ->selectRaw('DATE(created_at) as d, COUNT(*) as c')
            ->groupBy('d')
            ->pluck('c', 'd');

        $loginsByDay = LoginActivity::query()
            ->where('logged_in_at', '>=', $from)
            ->selectRaw('DATE(logged_in_at) as d, COUNT(*) as c')
            ->groupBy('d')
            ->pluck('c', 'd');

        $taskStatus = Task::query()
            ->selectRaw('status, COUNT(*) as c')
            ->groupBy('status')
            ->pluck('c', 'status');

        $messageUnread = (int) Message::query()->whereNull('read_at')->count();
        $messageTotal = (int) Message::query()->count();

        $activeSessions = 0;
        try {
            $activeSessions = (int) DB::table('sessions')
                ->whereNotNull('user_id')
                ->where('last_activity', '>=', now()->subMinutes(15)->timestamp)
                ->count();
        } catch (\Throwable $e) {
            $activeSessions = 0;
        }

        $kpis = [
            'users' => (int) User::query()->count(),
            'employees' => (int) Employee::query()->count(),
            'tasks' => (int) Task::query()->count(),
            'messages' => $messageTotal,
            'active_sessions' => $activeSessions,
        ];

        return response()->json([
            'kpis' => $kpis,
            'series' => [
                'labels' => $dateKeys,
                'users_created' => $dateKeys->map(fn ($d) => (int) ($usersByDay[$d] ?? 0))->values(),
                'employees_created' => $dateKeys->map(fn ($d) => (int) ($employeesByDay[$d] ?? 0))->values(),
                'logins' => $dateKeys->map(fn ($d) => (int) ($loginsByDay[$d] ?? 0))->values(),
            ],
            'pies' => [
                'tasks' => [
                    'labels' => array_values(array_map('strval', $taskStatus->keys()->all())),
                    'values' => array_values(array_map('intval', $taskStatus->values()->all())),
                ],
                'messages' => [
                    'labels' => ['Unread', 'Read'],
                    'values' => [$messageUnread, max(0, $messageTotal - $messageUnread)],
                ],
            ],
            'generated_at' => now()->toISOString(),
        ]);
    }

    public function systemHealth(Request $request): Response
    {
        $user = $request->user();
        if (!$user || !$user->hasRole('Super Admin')) {
            abort(403);
        }

        return Inertia::render('Sessions/Dashboard/SuperAdmin/SystemHealth/Index', [
            'auth' => [
                'user' => $user,
                'roles' => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name'),
            ],
        ]);
    }

    public function systemHealthData(Request $request)
    {
        $user = $request->user();
        if (!$user || !$user->hasRole('Super Admin')) {
            abort(403);
        }

        $checks = [
            'db' => ['ok' => false, 'ms' => null, 'message' => ''],
            'cache' => ['ok' => false, 'ms' => null, 'message' => ''],
            'queue' => ['ok' => true, 'message' => ''],
            'sessions' => ['ok' => true, 'message' => ''],
        ];

        $t0 = microtime(true);
        try {
            DB::select('select 1');
            $checks['db']['ok'] = true;
            $checks['db']['message'] = 'Connected';
        } catch (\Throwable $e) {
            $checks['db']['ok'] = false;
            $checks['db']['message'] = $e->getMessage();
        } finally {
            $checks['db']['ms'] = (int) round((microtime(true) - $t0) * 1000);
        }

        $t1 = microtime(true);
        try {
            $key = 'healthcheck:'.now()->timestamp;
            Cache::put($key, 'ok', 10);
            $val = Cache::get($key);
            $checks['cache']['ok'] = $val === 'ok';
            $checks['cache']['message'] = $checks['cache']['ok'] ? 'OK' : 'Cache write/read failed';
        } catch (\Throwable $e) {
            $checks['cache']['ok'] = false;
            $checks['cache']['message'] = $e->getMessage();
        } finally {
            $checks['cache']['ms'] = (int) round((microtime(true) - $t1) * 1000);
        }

        $queue = [
            'driver' => (string) config('queue.default'),
            'jobs' => null,
            'failed_jobs' => null,
        ];
        try {
            $queue['jobs'] = (int) DB::table('jobs')->count();
            $queue['failed_jobs'] = (int) DB::table('failed_jobs')->count();
            $checks['queue']['ok'] = true;
            $checks['queue']['message'] = 'OK';
        } catch (\Throwable $e) {
            $checks['queue']['ok'] = false;
            $checks['queue']['message'] = $e->getMessage();
        }

        $sessions = [
            'driver' => (string) config('session.driver'),
            'total' => null,
            'active_15m' => null,
        ];
        try {
            $sessions['total'] = (int) DB::table('sessions')->count();
            $sessions['active_15m'] = (int) DB::table('sessions')
                ->whereNotNull('user_id')
                ->where('last_activity', '>=', now()->subMinutes(15)->timestamp)
                ->count();
            $checks['sessions']['ok'] = true;
            $checks['sessions']['message'] = 'OK';
        } catch (\Throwable $e) {
            $checks['sessions']['ok'] = false;
            $checks['sessions']['message'] = $e->getMessage();
        }

        $runtime = [
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
            'app_env' => (string) config('app.env'),
            'app_debug' => (bool) config('app.debug'),
            'timezone' => (string) config('app.timezone'),
            'memory_usage_mb' => round(memory_get_usage(true) / 1024 / 1024, 2),
            'memory_peak_mb' => round(memory_get_peak_usage(true) / 1024 / 1024, 2),
        ];

        return response()->json([
            'checks' => $checks,
            'queue' => $queue,
            'sessions' => $sessions,
            'runtime' => $runtime,
            'generated_at' => now()->toISOString(),
        ]);
    }
}
