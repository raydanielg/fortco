<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureAnyRole
{
    /**
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = Auth::user();

        if (!$user) {
            abort(401);
        }

        $roles = array_values(array_filter(array_map(fn ($r) => trim((string) $r), $roles), fn ($r) => $r !== ''));

        if (empty($roles)) {
            return $next($request);
        }

        try {
            if ($user->hasAnyRole($roles)) {
                return $next($request);
            }
        } catch (\Throwable $e) {
        }

        abort(403);
    }
}
