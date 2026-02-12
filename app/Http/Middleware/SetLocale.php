<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        $default = 'en';
        try {
            $default = (string) Setting::getValue('default_language', Setting::getValue('language', 'en'));
        } catch (\Throwable $e) {
            $default = config('app.locale', 'en');
        }

        $locale = (string) ($request->session()->get('locale') ?: $request->cookie('locale') ?: $default);
        $available = [];

        try {
            $available = json_decode((string) Setting::getValue('available_languages', '["en","sw"]'), true) ?: ['en', 'sw'];
        } catch (\Throwable $e) {
            $available = ['en', 'sw'];
        }

        if (!in_array($locale, $available, true)) {
            $locale = $default;
        }

        app()->setLocale($locale);
        config(['app.locale' => $locale]);

        $response = $next($request);
        $request->session()->put('locale', $locale);

        return $response;
    }
}
