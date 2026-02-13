<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class CheckSecurityMaintenance
{
    public function handle(Request $request, Closure $next): Response
    {
        $enabled = false;
        $message = '';

        try {
            $enabled = Setting::getValue('security_maintenance_enabled', '0') === '1';
            $message = (string) Setting::getValue('security_maintenance_message', '');
        } catch (\Throwable $e) {
            $enabled = false;
            $message = '';
        }

        if (!$enabled) {
            return $next($request);
        }

        if (
            $request->is('admin*') ||
            $request->is('auth/*') ||
            $request->is('login') ||
            $request->is('register') ||
            $request->is('forgot-password') ||
            $request->is('reset-password*') ||
            $request->is('confirm-password') ||
            $request->is('email*') ||
            $request->is('logout') ||
            $request->is('api/*') ||
            $request->is('webhooks/*') ||
            $request->is('locale')
        ) {
            return $next($request);
        }

        if ($request->routeIs('login') || $request->routeIs('logout') || $request->routeIs('password.*') || $request->routeIs('verification.*')) {
            return $next($request);
        }

        if ($request->expectsJson()) {
            return response()->json([
                'message' => $message !== '' ? $message : 'Maintenance mode',
            ], 503);
        }

        return Inertia::render('Maintenance', [
            'message' => $message,
        ])->toResponse($request)->setStatusCode(503);
    }
}
