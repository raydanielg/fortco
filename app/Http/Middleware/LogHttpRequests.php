<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LogHttpRequests
{
    public function handle(Request $request, Closure $next): Response
    {
        $start = microtime(true);

        /** @var \Symfony\Component\HttpFoundation\Response $response */
        $response = $next($request);

        try {
            $path = '/'.ltrim($request->path(), '/');

            if (
                $request->is('admin/security/logs/tail') ||
                $request->is('up') ||
                $request->is('_debugbar/*') ||
                $request->is('storage/*') ||
                $request->is('build/*') ||
                $request->is('favicon*')
            ) {
                return $response;
            }

            $durationMs = (int) round((microtime(true) - $start) * 1000);
            $user = $request->user();

            $allowHeaders = [
                'host',
                'connection',
                'cache-control',
                'user-agent',
                'accept',
                'accept-language',
                'accept-encoding',
                'content-type',
                'content-length',
                'referer',
                'origin',
                'upgrade-insecure-requests',
                'sec-fetch-site',
                'sec-fetch-mode',
                'sec-fetch-dest',
                'sec-fetch-user',
                'sec-ch-ua',
                'sec-ch-ua-mobile',
                'sec-ch-ua-platform',
            ];

            $headers = [];
            foreach ($allowHeaders as $h) {
                $v = $request->headers->get($h);
                if ($v !== null && $v !== '') {
                    $headers[$h] = $v;
                }
            }

            Log::info('HTTP_REQUEST', [
                'method' => $request->method(),
                'path' => $path,
                'query' => $request->query(),
                'headers' => $headers,
                'status' => $response->getStatusCode(),
                'duration_ms' => $durationMs,
                'ip' => $request->ip(),
                'user_id' => $user?->id,
                'user_email' => $user?->email,
                'user_agent' => $request->userAgent(),
            ]);
        } catch (\Throwable $e) {
            // ignore
        }

        return $response;
    }
}
