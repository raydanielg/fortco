<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureNotBanned
{
    /**
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if (!$user || empty($user->banned_at)) {
            return $next($request);
        }

        $path = ltrim($request->path(), '/');

        $allowed = [
            'banned',
            'helpdesk/chat',
            'helpdesk/chat/messages',
            'logout',
        ];

        foreach ($allowed as $p) {
            if ($path === $p || str_starts_with($path, $p.'/')) {
                return $next($request);
            }
        }

        return redirect()->route('banned');
    }
}
