<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Illuminate\Support\Facades\File;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        $locale = app()->getLocale();
        $available = ['en', 'sw'];
        try {
            $available = json_decode((string) Setting::getValue('available_languages', '["en","sw"]'), true) ?: ['en', 'sw'];
        } catch (\Throwable $e) {
            $available = ['en', 'sw'];
        }

        $translations = [];
        try {
            $path = resource_path('lang'.DIRECTORY_SEPARATOR.$locale.'.json');
            if (File::exists($path)) {
                $translations = json_decode((string) File::get($path), true) ?: [];
            }
        } catch (\Throwable $e) {
            $translations = [];
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'roles' => $user ? $user->getRoleNames() : [],
                'permissions' => $user ? $user->getAllPermissions()->pluck('name') : [],
            ],
            'theme' => (function () {
                try {
                    return [
                        'direction' => Setting::getValue('theme_direction', 'ltr'),
                        'mode' => Setting::getValue('theme_mode', 'light'),
                        'bg' => Setting::getValue('theme_bg', '#f7f5f0'),
                    ];
                } catch (\Throwable $e) {
                    return [
                        'direction' => 'ltr',
                        'mode' => 'light',
                        'bg' => '#f7f5f0',
                    ];
                }
            })(),
            'i18n' => [
                'locale' => $locale,
                'available_languages' => $available,
                'translations' => $translations,
            ],
        ];
    }
}
