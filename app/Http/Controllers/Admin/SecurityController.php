<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\User;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class SecurityController extends Controller
{
    public function main(Request $request)
    {
        return response()->json([
            'pyramid' => [
                'l1' => Setting::getValue('security_pyramid_l1_enabled', '1') === '1',
                'l2' => Setting::getValue('security_pyramid_l2_enabled', '1') === '1',
                'l3' => Setting::getValue('security_pyramid_l3_enabled', '1') === '1',
                'l4' => Setting::getValue('security_pyramid_l4_enabled', '1') === '1',
                'l5' => Setting::getValue('security_pyramid_l5_enabled', '1') === '1',
                'l6' => Setting::getValue('security_pyramid_l6_enabled', '1') === '1',
                'l7' => Setting::getValue('security_pyramid_l7_enabled', '1') === '1',
            ],
            'maintenance' => [
                'enabled' => Setting::getValue('security_maintenance_enabled', '0') === '1',
                'message' => Setting::getValue('security_maintenance_message', ''),
            ],
        ]);
    }

    public function updateMain(Request $request)
    {
        $validated = $request->validate([
            'pyramid' => ['required', 'array'],
            'pyramid.l1' => ['required', 'boolean'],
            'pyramid.l2' => ['required', 'boolean'],
            'pyramid.l3' => ['required', 'boolean'],
            'pyramid.l4' => ['required', 'boolean'],
            'pyramid.l5' => ['required', 'boolean'],
            'pyramid.l6' => ['required', 'boolean'],
            'pyramid.l7' => ['required', 'boolean'],
            'maintenance' => ['required', 'array'],
            'maintenance.enabled' => ['required', 'boolean'],
            'maintenance.message' => ['nullable', 'string', 'max:240'],
        ]);

        Setting::setValue('security_pyramid_l1_enabled', $validated['pyramid']['l1'] ? '1' : '0', 'security');
        Setting::setValue('security_pyramid_l2_enabled', $validated['pyramid']['l2'] ? '1' : '0', 'security');
        Setting::setValue('security_pyramid_l3_enabled', $validated['pyramid']['l3'] ? '1' : '0', 'security');
        Setting::setValue('security_pyramid_l4_enabled', $validated['pyramid']['l4'] ? '1' : '0', 'security');
        Setting::setValue('security_pyramid_l5_enabled', $validated['pyramid']['l5'] ? '1' : '0', 'security');
        Setting::setValue('security_pyramid_l6_enabled', $validated['pyramid']['l6'] ? '1' : '0', 'security');
        Setting::setValue('security_pyramid_l7_enabled', $validated['pyramid']['l7'] ? '1' : '0', 'security');

        Setting::setValue('security_maintenance_enabled', $validated['maintenance']['enabled'] ? '1' : '0', 'security');
        Setting::setValue('security_maintenance_message', $validated['maintenance']['message'] ?? '', 'security');

        return response()->json(['saved' => true]);
    }

    public function users(Request $request)
    {
        $users = User::query()
            ->select(['id', 'name', 'email', 'created_at', 'banned_at'])
            ->orderBy('name')
            ->limit(200)
            ->get();

        $sessionAgg = [];
        try {
            $rows = DB::table('sessions')
                ->selectRaw('user_id, count(*) as sessions_count, max(last_activity) as last_activity')
                ->whereNotNull('user_id')
                ->groupBy('user_id')
                ->get();

            foreach ($rows as $r) {
                $sessionAgg[(int) $r->user_id] = [
                    'sessions_count' => (int) $r->sessions_count,
                    'last_activity' => $r->last_activity ? (int) $r->last_activity : null,
                ];
            }
        } catch (\Throwable $e) {
            $sessionAgg = [];
        }

        $payload = $users->map(function (User $u) use ($sessionAgg) {
            $agg = $sessionAgg[$u->id] ?? ['sessions_count' => 0, 'last_activity' => null];

            $lastActivityTs = $agg['last_activity'] ? (int) $agg['last_activity'] : null;
            $lastActivityIso = $lastActivityTs ? Carbon::createFromTimestamp($lastActivityTs)->toISOString() : null;
            $active = $lastActivityTs ? (time() - $lastActivityTs) <= (15 * 60) : false;

            return [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'sessions_count' => $agg['sessions_count'],
                'last_activity' => $lastActivityIso,
                'active' => $active,
                'banned_at' => $u->banned_at?->toISOString(),
                'created_at' => $u->created_at?->toISOString(),
            ];
        })->values();

        return response()->json(['users' => $payload]);
    }

    public function employees(Request $request)
    {
        $employees = Employee::query()
            ->with(['user:id,name,email,created_at,banned_at'])
            ->orderBy('full_name')
            ->limit(300)
            ->get();

        $sessionAgg = [];
        try {
            $rows = DB::table('sessions')
                ->selectRaw('user_id, count(*) as sessions_count, max(last_activity) as last_activity')
                ->whereNotNull('user_id')
                ->groupBy('user_id')
                ->get();

            foreach ($rows as $r) {
                $sessionAgg[(int) $r->user_id] = [
                    'sessions_count' => (int) $r->sessions_count,
                    'last_activity' => $r->last_activity ? (int) $r->last_activity : null,
                ];
            }
        } catch (\Throwable $e) {
            $sessionAgg = [];
        }

        $payload = $employees->map(function (Employee $e) use ($sessionAgg) {
            $u = $e->user;
            $uid = $u?->id;
            $agg = $uid ? ($sessionAgg[(int) $uid] ?? ['sessions_count' => 0, 'last_activity' => null]) : ['sessions_count' => 0, 'last_activity' => null];

            $lastActivityTs = $agg['last_activity'] ? (int) $agg['last_activity'] : null;
            $lastActivityIso = $lastActivityTs ? Carbon::createFromTimestamp($lastActivityTs)->toISOString() : null;
            $active = $lastActivityTs ? (time() - $lastActivityTs) <= (15 * 60) : false;

            return [
                'id' => $e->id,
                'user_id' => $u?->id,
                'full_name' => $e->full_name,
                'designation' => $e->designation,
                'phone' => $e->phone,
                'country' => $e->country,
                'language' => $e->language,
                'user' => $u ? [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'banned_at' => $u->banned_at?->toISOString(),
                    'created_at' => $u->created_at?->toISOString(),
                ] : null,
                'sessions_count' => $agg['sessions_count'],
                'last_activity' => $lastActivityIso,
                'active' => $active,
            ];
        })->values();

        return response()->json(['employees' => $payload]);
    }

    public function banUser(Request $request, User $user)
    {
        if ($user->banned_at) {
            return response()->json(['banned' => true]);
        }

        $user->forceFill(['banned_at' => now()])->save();

        try {
            if (config('session.driver') === 'database') {
                DB::table('sessions')->where('user_id', $user->id)->delete();
            }
        } catch (\Throwable $e) {
        }

        return response()->json(['banned' => true]);
    }

    public function unbanUser(Request $request, User $user)
    {
        if (! $user->banned_at) {
            return response()->json(['banned' => false]);
        }

        $user->forceFill(['banned_at' => null])->save();

        return response()->json(['banned' => false]);
    }

    public function sendPasswordResetLink(Request $request, User $user)
    {
        $status = Password::sendResetLink(['email' => $user->email]);

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json(['sent' => true]);
        }

        return response()->json([
            'message' => trans($status),
        ], 422);
    }

    public function deleteUser(Request $request, User $user)
    {
        if ((int) $request->user()->id === (int) $user->id) {
            return response()->json([
                'message' => 'You cannot delete your own account.',
            ], 422);
        }

        try {
            if (config('session.driver') === 'database') {
                DB::table('sessions')->where('user_id', $user->id)->delete();
            }

            $user->delete();
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to delete user.',
            ], 500);
        }

        return response()->json(['deleted' => true]);
    }

    public function userSessions(Request $request, User $user)
    {
        $sessions = [];

        try {
            $rows = DB::table('sessions')
                ->where('user_id', $user->id)
                ->orderByDesc('last_activity')
                ->limit(50)
                ->get(['id', 'ip_address', 'user_agent', 'last_activity']);

            $sessions = collect($rows)->map(function ($r) {
                return [
                    'id' => $r->id,
                    'ip_address' => $r->ip_address,
                    'user_agent' => $r->user_agent,
                    'last_activity' => $r->last_activity ? Carbon::createFromTimestamp((int) $r->last_activity)->toISOString() : null,
                ];
            })->values();
        } catch (\Throwable $e) {
            $sessions = collect();
        }

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'sessions' => $sessions,
        ]);
    }

    public function userLogs(Request $request, User $user)
    {
        $path = storage_path('logs/laravel.log');
        $limit = (int) $request->query('limit', 120);
        $limit = max(20, min(300, $limit));

        if (!File::exists($path)) {
            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'logs' => [],
            ]);
        }

        $size = (int) File::size($path);
        $readFrom = max(0, $size - 768 * 1024);
        $chunk = '';

        try {
            $fh = fopen($path, 'rb');
            if ($fh === false) {
                throw new \RuntimeException('Cannot open log file');
            }
            fseek($fh, $readFrom);
            $chunk = (string) stream_get_contents($fh);
            fclose($fh);
        } catch (\Throwable $e) {
            $chunk = '';
        }

        $lines = preg_split("/\r\n|\n|\r/", (string) $chunk) ?: [];
        $lines = array_values(array_filter($lines, fn ($l) => trim((string) $l) !== ''));

        $logs = [];
        for ($i = count($lines) - 1; $i >= 0; $i--) {
            $line = (string) $lines[$i];
            if (strpos($line, 'HTTP_REQUEST') === false) {
                continue;
            }

            if (!preg_match('/^(\[[^\]]+\])\s+[^.]+\.[A-Z]+:\s+HTTP_REQUEST\s+(\{.*\})\s*$/', $line, $m)) {
                continue;
            }

            $tsRaw = trim($m[1], '[]');
            $jsonRaw = $m[2] ?? '';
            $ctx = json_decode($jsonRaw, true);
            if (!is_array($ctx)) {
                continue;
            }

            $uid = $ctx['user_id'] ?? null;
            if ((string) $uid !== (string) $user->id) {
                continue;
            }

            $headers = is_array($ctx['headers'] ?? null) ? $ctx['headers'] : [];
            $logs[] = [
                'at' => (function () use ($tsRaw) {
                    try {
                        return Carbon::parse($tsRaw)->toISOString();
                    } catch (\Throwable $e) {
                        return null;
                    }
                })(),
                'method' => $ctx['method'] ?? null,
                'path' => $ctx['path'] ?? null,
                'status' => $ctx['status'] ?? null,
                'duration_ms' => $ctx['duration_ms'] ?? null,
                'ip' => $ctx['ip'] ?? null,
                'referer' => $headers['referer'] ?? null,
                'accept' => $headers['accept'] ?? null,
            ];

            if (count($logs) >= $limit) {
                break;
            }
        }

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'logs' => array_reverse($logs),
        ]);
    }

    public function clearUserSessions(Request $request, User $user)
    {
        $driver = config('session.driver');

        if ($driver !== 'database') {
            return response()->json([
                'message' => 'Clear session is only available when SESSION_DRIVER=database.',
            ], 422);
        }

        try {
            DB::table('sessions')->where('user_id', $user->id)->delete();

            $user->setRememberToken(Str::random(60));
            $user->save();
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to clear sessions.',
            ], 500);
        }

        return response()->json(['cleared' => true]);
    }

    public function deleteUserSession(Request $request, User $user, string $sessionId)
    {
        $driver = config('session.driver');

        if ($driver !== 'database') {
            return response()->json([
                'message' => 'Session management is only available when SESSION_DRIVER=database.',
            ], 422);
        }

        try {
            $row = DB::table('sessions')
                ->where('id', $sessionId)
                ->where('user_id', $user->id)
                ->first();

            if (!$row) {
                return response()->json([
                    'message' => 'Session not found.',
                ], 404);
            }

            DB::table('sessions')
                ->where('id', $sessionId)
                ->where('user_id', $user->id)
                ->delete();
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Failed to delete session.',
            ], 500);
        }

        return response()->json(['deleted' => true]);
    }

    public function tailLogs(Request $request)
    {
        $path = storage_path('logs/laravel.log');
        $lines = (int) $request->query('lines', 200);
        $lines = max(20, min(1000, $lines));

        $cursor = $request->query('cursor');
        $cursor = is_numeric($cursor) ? (int) $cursor : 0;
        $cursor = max(0, $cursor);

        if (!File::exists($path)) {
            return response()->json([
                'cursor' => 0,
                'chunk' => '',
                'lines' => [],
            ]);
        }

        $size = (int) File::size($path);
        if ($cursor > $size) {
            $cursor = 0;
        }

        $chunk = '';
        try {
            $fh = fopen($path, 'rb');
            if ($fh === false) {
                throw new \RuntimeException('Cannot open log file');
            }

            if ($cursor > 0) {
                fseek($fh, $cursor);
                $chunk = (string) stream_get_contents($fh);
            } else {
                $readFrom = max(0, $size - 256 * 1024);
                fseek($fh, $readFrom);
                $chunk = (string) stream_get_contents($fh);
            }

            fclose($fh);
        } catch (\Throwable $e) {
            $chunk = '';
        }

        $newCursor = (int) File::size($path);

        $linesArr = preg_split("/\r\n|\n|\r/", (string) $chunk) ?: [];
        $linesArr = array_values(array_filter($linesArr, fn ($l) => trim((string) $l) !== ''));

        if (count($linesArr) > $lines) {
            $linesArr = array_slice($linesArr, -$lines);
        }

        return response()->json([
            'cursor' => $newCursor,
            'lines' => $linesArr,
        ]);
    }
}
