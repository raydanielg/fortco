<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\EmployeePaymentDetail;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class SettingsController extends Controller
{
    private function readModuleStatuses(): array
    {
        try {
            $path = base_path('modules_statuses.json');
            if (!File::exists($path)) {
                return [];
            }
            $json = json_decode((string) File::get($path), true);
            return is_array($json) ? $json : [];
        } catch (\Throwable $e) {
            return [];
        }
    }

    private function writeModuleStatuses(array $statuses): void
    {
        $path = base_path('modules_statuses.json');
        File::put($path, json_encode($statuses, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    }

    private function listModules(): array
    {
        $dirs = [];
        try {
            $base = base_path('Modules');
            if (!File::exists($base)) {
                return [];
            }
            $items = File::directories($base);
            foreach ($items as $dir) {
                $name = basename($dir);
                if ($name !== '' && $name[0] !== '.') {
                    $dirs[] = $name;
                }
            }
        } catch (\Throwable $e) {
            $dirs = [];
        }

        sort($dirs);
        return $dirs;
    }

    private function summarizeDisk(string $disk): array
    {
        try {
            $files = Storage::disk($disk)->allFiles();
            $count = count($files);
            $bytes = 0;
            foreach ($files as $path) {
                try {
                    $bytes += (int) Storage::disk($disk)->size($path);
                } catch (\Throwable $e) {
                    // ignore
                }
            }

            return [
                'files' => $count,
                'bytes' => $bytes,
            ];
        } catch (\Throwable $e) {
            return [
                'files' => 0,
                'bytes' => 0,
            ];
        }
    }

    public function index(Request $request): Response
    {
        $employee = $request->user()?->employee;
        $employeePayment = $employee?->paymentDetails;
        $avatarUrl = $employee?->getFirstMediaUrl('avatar') ?: '';
        $documents = [];
        if ($employee) {
            foreach ($employee->getMedia('documents') as $m) {
                $documents[] = [
                    'id' => $m->id,
                    'name' => $m->name,
                    'file_name' => $m->file_name,
                    'size' => $m->size,
                    'mime_type' => $m->mime_type,
                    'url' => $m->getUrl(),
                ];
            }
        }

        $moduleStatuses = $this->readModuleStatuses();
        $moduleNames = $this->listModules();
        $moduleRows = [];
        foreach ($moduleNames as $n) {
            $moduleRows[] = [
                'name' => $n,
                'enabled' => array_key_exists($n, $moduleStatuses) ? (bool) $moduleStatuses[$n] : true,
            ];
        }

        return Inertia::render('Sessions/Dashboard/SuperAdmin/Settings/Settings', [
            'appSettings' => [
                'website_name' => Setting::getValue('website_name', config('app.name')),
                'timezone' => Setting::getValue('timezone', config('app.timezone')),
                'date_format' => Setting::getValue('date_format', 'd-m-Y'),
                'time_format' => Setting::getValue('time_format', '12'),
                'currency' => Setting::getValue('currency', 'USD'),
                'language' => Setting::getValue('language', 'en'),
                'datatable_row_limit' => (int) Setting::getValue('datatable_row_limit', '10'),
                'session_driver' => Setting::getValue('session_driver', config('session.driver')),
                'enable_cache' => Setting::getValue('enable_cache', '1') === '1',
                'app_debug' => Setting::getValue('app_debug', config('app.debug') ? '1' : '0') === '1',
                'app_update' => Setting::getValue('app_update', '0') === '1',
                'company_need_approval' => Setting::getValue('company_need_approval', '0') === '1',
                'email_verification' => Setting::getValue('email_verification', '0') === '1',
            ],
            'uploadSettings' => [
                'max_file_size_mb' => (int) Setting::getValue('upload_max_file_size_mb', '10'),
                'max_files' => (int) Setting::getValue('upload_max_files', '10'),
                'allowed_mime_types' => json_decode(Setting::getValue('upload_allowed_mime_types', '[]'), true) ?: [],
                'server_upload_max_filesize' => ini_get('upload_max_filesize') ?: '',
                'server_post_max_size' => ini_get('post_max_size') ?: '',
            ],
            'storageSettings' => [
                'default_disk' => Setting::getValue('storage_default_disk', 'public'),
                'quota_mb' => (int) Setting::getValue('storage_quota_mb', '1024'),
                'retention_days' => (int) Setting::getValue('storage_retention_days', '0'),
            ],
            'storageStats' => (function () {
                $public = $this->summarizeDisk('public');
                $private = $this->summarizeDisk('local');

                $mediaCount = 0;
                $mediaBytes = 0;
                try {
                    $mediaCount = (int) DB::table('media')->count();
                    $mediaBytes = (int) DB::table('media')->sum('size');
                } catch (\Throwable $e) {
                    $mediaCount = 0;
                    $mediaBytes = 0;
                }

                $quotaMb = (int) Setting::getValue('storage_quota_mb', '1024');
                $quotaBytes = max(0, $quotaMb) * 1024 * 1024;
                $totalBytes = (int) $public['bytes'] + (int) $private['bytes'];
                $usedPercent = $quotaBytes > 0 ? min(100, round(($totalBytes / $quotaBytes) * 100, 2)) : 0;

                return [
                    'public' => $public,
                    'private' => $private,
                    'media' => [
                        'count' => $mediaCount,
                        'bytes' => $mediaBytes,
                    ],
                    'total_bytes' => $totalBytes,
                    'quota_bytes' => $quotaBytes,
                    'used_percent' => $usedPercent,
                ];
            })(),
            'mapsSettings' => [
                'google_maps_api_key' => Setting::getValue('google_maps_api_key', ''),
            ],
            'notificationSettings' => [
                'smtp' => [
                    'enabled' => Setting::getValue('smtp_enabled', '0') === '1',
                    'host' => Setting::getValue('smtp_host', ''),
                    'port' => Setting::getValue('smtp_port', ''),
                    'username' => Setting::getValue('smtp_username', ''),
                    'password' => Setting::getValue('smtp_password', ''),
                    'encryption' => Setting::getValue('smtp_encryption', 'tls'),
                    'from_address' => Setting::getValue('smtp_from_address', ''),
                    'from_name' => Setting::getValue('smtp_from_name', ''),
                ],
                'sms' => [
                    'enabled' => Setting::getValue('sms_enabled', '0') === '1',
                    'provider' => Setting::getValue('sms_provider', 'africastalking'),
                    'sender_id' => Setting::getValue('sms_sender_id', ''),
                    'api_key' => Setting::getValue('sms_api_key', ''),
                    'username' => Setting::getValue('sms_username', ''),
                ],
            ],
            'languageSettings' => [
                'default' => Setting::getValue('default_language', Setting::getValue('language', 'en')),
                'available' => json_decode(Setting::getValue('available_languages', '["en","sw"]'), true) ?: ['en', 'sw'],
            ],
            'currencySettings' => [
                'code' => Setting::getValue('currency_code', Setting::getValue('currency', 'USD')),
                'symbol' => Setting::getValue('currency_symbol', '$'),
                'symbol_position' => Setting::getValue('currency_symbol_position', 'before'),
                'decimals' => (int) Setting::getValue('currency_decimals', '2'),
                'decimal_separator' => Setting::getValue('currency_decimal_separator', '.'),
                'thousand_separator' => Setting::getValue('currency_thousand_separator', ','),
            ],
            'paymentSettings' => [
                'provider' => Setting::getValue('payment_provider', 'pesapal'),
                'webhook_secret' => Setting::getValue('payment_webhook_secret', ''),
                'pesapal' => [
                    'environment' => Setting::getValue('pesapal_environment', 'sandbox'),
                    'consumer_key' => Setting::getValue('pesapal_consumer_key', ''),
                    'consumer_secret' => Setting::getValue('pesapal_consumer_secret', ''),
                ],
                'selcom' => [
                    'environment' => Setting::getValue('selcom_environment', 'sandbox'),
                    'vendor_id' => Setting::getValue('selcom_vendor_id', ''),
                    'api_key' => Setting::getValue('selcom_api_key', ''),
                    'api_secret' => Setting::getValue('selcom_api_secret', ''),
                ],
                'zenopay' => [
                    'environment' => Setting::getValue('zenopay_environment', 'sandbox'),
                    'account_id' => Setting::getValue('zenopay_account_id', ''),
                    'api_key' => Setting::getValue('zenopay_api_key', ''),
                    'api_secret' => Setting::getValue('zenopay_api_secret', ''),
                ],
            ],
            'socialLoginSettings' => [
                'google' => [
                    'enabled' => Setting::getValue('social_google_enabled', '0') === '1',
                    'client_id' => Setting::getValue('social_google_client_id', ''),
                    'client_secret' => Setting::getValue('social_google_client_secret', ''),
                ],
                'apple' => [
                    'enabled' => Setting::getValue('social_apple_enabled', '0') === '1',
                    'client_id' => Setting::getValue('social_apple_client_id', ''),
                    'client_secret' => Setting::getValue('social_apple_client_secret', ''),
                ],
                'facebook' => [
                    'enabled' => Setting::getValue('social_facebook_enabled', '0') === '1',
                    'client_id' => Setting::getValue('social_facebook_client_id', ''),
                    'client_secret' => Setting::getValue('social_facebook_client_secret', ''),
                ],
            ],
            'googleCalendarSettings' => [
                'enabled' => Setting::getValue('google_calendar_enabled', '0') === '1',
                'client_id' => Setting::getValue('google_calendar_client_id', ''),
                'client_secret_set' => Setting::getValue('google_calendar_client_secret', '') !== '',
                'sync_enabled' => Setting::getValue('google_calendar_sync_enabled', '1') === '1',
                'sync_interval_min' => (int) Setting::getValue('google_calendar_sync_interval_min', '10'),
            ],
            'themeSettings' => [
                'direction' => Setting::getValue('theme_direction', 'ltr'),
                'mode' => Setting::getValue('theme_mode', 'light'),
                'bg' => Setting::getValue('theme_bg', '#f7f5f0'),
            ],
            'moduleSettings' => [
                'modules' => $moduleRows,
            ],
            'rolePermissionSettings' => [
                'roles' => Role::query()
                    ->where('guard_name', 'web')
                    ->orderBy('name')
                    ->get()
                    ->map(fn (Role $r) => [
                        'id' => $r->id,
                        'name' => $r->name,
                        'permission_names' => $r->permissions->pluck('name')->values(),
                    ])
                    ->values(),
                'permissions' => Permission::query()
                    ->where('guard_name', 'web')
                    ->orderBy('name')
                    ->get()
                    ->map(fn (Permission $p) => [
                        'id' => $p->id,
                        'name' => $p->name,
                    ])
                    ->values(),
            ],
            'employeeProfile' => [
                'exists' => (bool) $employee,
                'full_name' => $employee?->full_name ?: $request->user()?->name,
                'designation' => $employee?->designation,
                'phone' => $employee?->phone,
                'country' => $employee?->country,
                'language' => $employee?->language,
                'email' => $request->user()?->email,
                'avatar_url' => $avatarUrl,
                'payment' => [
                    'payment_method' => $employeePayment?->payment_method,
                    'bank_name' => $employeePayment?->bank_name,
                    'bank_account_name' => $employeePayment?->bank_account_name,
                    'bank_account_number' => $employeePayment?->bank_account_number,
                    'mobile_money_provider' => $employeePayment?->mobile_money_provider,
                    'mobile_money_number' => $employeePayment?->mobile_money_number,
                    'tax_number' => $employeePayment?->tax_number,
                ],
                'documents' => $documents,
            ],
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'website_name' => ['required', 'string', 'max:120'],
            'timezone' => ['required', 'string', Rule::in(timezone_identifiers_list())],
            'date_format' => ['nullable', 'string', 'max:40'],
            'time_format' => ['nullable', 'string', Rule::in(['12', '24'])],
            'currency' => ['nullable', 'string', 'max:10'],
            'language' => ['nullable', 'string', 'max:10'],
            'datatable_row_limit' => ['nullable', 'integer', 'min:1', 'max:500'],
            'session_driver' => ['nullable', 'string', 'max:40'],
            'enable_cache' => ['nullable', 'boolean'],
            'app_debug' => ['nullable', 'boolean'],
            'app_update' => ['nullable', 'boolean'],
            'company_need_approval' => ['nullable', 'boolean'],
            'email_verification' => ['nullable', 'boolean'],
        ]);

        Setting::setValue('website_name', $validated['website_name'], 'app');
        Setting::setValue('timezone', $validated['timezone'], 'app');
        Setting::setValue('date_format', $validated['date_format'] ?? 'd-m-Y', 'app');
        Setting::setValue('time_format', $validated['time_format'] ?? '12', 'app');
        Setting::setValue('currency', $validated['currency'] ?? 'USD', 'app');
        Setting::setValue('language', $validated['language'] ?? 'en', 'app');
        Setting::setValue('datatable_row_limit', (string) ($validated['datatable_row_limit'] ?? 10), 'app');
        Setting::setValue('session_driver', $validated['session_driver'] ?? config('session.driver'), 'app');

        Setting::setValue('enable_cache', ($validated['enable_cache'] ?? false) ? '1' : '0', 'app');
        Setting::setValue('app_debug', ($validated['app_debug'] ?? false) ? '1' : '0', 'app');
        Setting::setValue('app_update', ($validated['app_update'] ?? false) ? '1' : '0', 'app');
        Setting::setValue('company_need_approval', ($validated['company_need_approval'] ?? false) ? '1' : '0', 'app');
        Setting::setValue('email_verification', ($validated['email_verification'] ?? false) ? '1' : '0', 'app');

        return back()->with('status', 'Settings saved');
    }

    public function updateUploadSettings(Request $request)
    {
        $validated = $request->validate([
            'max_file_size_mb' => ['required', 'integer', 'min:1', 'max:10240'],
            'max_files' => ['required', 'integer', 'min:1', 'max:1000'],
            'allowed_mime_types' => ['nullable', 'array'],
            'allowed_mime_types.*' => ['string', 'max:200'],
        ]);

        $allowed = array_values(array_filter(array_map('trim', $validated['allowed_mime_types'] ?? []), fn ($v) => $v !== ''));

        Setting::setValue('upload_max_file_size_mb', (string) $validated['max_file_size_mb'], 'upload');
        Setting::setValue('upload_max_files', (string) $validated['max_files'], 'upload');
        Setting::setValue('upload_allowed_mime_types', json_encode($allowed), 'upload');

        return back()->with('status', 'Upload settings saved');
    }

    public function updateMapsSettings(Request $request)
    {
        $validated = $request->validate([
            'google_maps_api_key' => ['required', 'string', 'max:255'],
        ]);

        Setting::setValue('google_maps_api_key', $validated['google_maps_api_key'], 'maps');

        return back()->with('status', 'Maps settings saved');
    }

    public function updateSmtpSettings(Request $request)
    {
        $validated = $request->validate([
            'smtp_enabled' => ['nullable', 'boolean'],
            'smtp_host' => ['nullable', 'string', 'max:255'],
            'smtp_port' => ['nullable', 'integer', 'min:1', 'max:65535'],
            'smtp_username' => ['nullable', 'string', 'max:255'],
            'smtp_password' => ['nullable', 'string', 'max:255'],
            'smtp_encryption' => ['nullable', 'string', 'max:20'],
            'smtp_from_address' => ['nullable', 'string', 'max:255'],
            'smtp_from_name' => ['nullable', 'string', 'max:255'],
        ]);

        Setting::setValue('smtp_enabled', ($validated['smtp_enabled'] ?? false) ? '1' : '0', 'smtp');
        Setting::setValue('smtp_host', $validated['smtp_host'] ?? '', 'smtp');
        Setting::setValue('smtp_port', (string) ($validated['smtp_port'] ?? ''), 'smtp');
        Setting::setValue('smtp_username', $validated['smtp_username'] ?? '', 'smtp');
        Setting::setValue('smtp_password', $validated['smtp_password'] ?? '', 'smtp');
        Setting::setValue('smtp_encryption', $validated['smtp_encryption'] ?? 'tls', 'smtp');
        Setting::setValue('smtp_from_address', $validated['smtp_from_address'] ?? '', 'smtp');
        Setting::setValue('smtp_from_name', $validated['smtp_from_name'] ?? '', 'smtp');

        return back()->with('status', 'SMTP settings saved');
    }

    public function updateSmsSettings(Request $request)
    {
        $validated = $request->validate([
            'sms_enabled' => ['nullable', 'boolean'],
            'sms_provider' => ['nullable', 'string', 'max:60'],
            'sms_sender_id' => ['nullable', 'string', 'max:60'],
            'sms_api_key' => ['nullable', 'string', 'max:255'],
            'sms_username' => ['nullable', 'string', 'max:255'],
        ]);

        Setting::setValue('sms_enabled', ($validated['sms_enabled'] ?? false) ? '1' : '0', 'sms');
        Setting::setValue('sms_provider', $validated['sms_provider'] ?? 'africastalking', 'sms');
        Setting::setValue('sms_sender_id', $validated['sms_sender_id'] ?? '', 'sms');
        Setting::setValue('sms_api_key', $validated['sms_api_key'] ?? '', 'sms');
        Setting::setValue('sms_username', $validated['sms_username'] ?? '', 'sms');

        return back()->with('status', 'SMS settings saved');
    }

    public function updateLanguageSettings(Request $request)
    {
        $validated = $request->validate([
            'default_language' => ['required', 'string', 'max:10'],
            'available_languages' => ['nullable', 'array'],
            'available_languages.*' => ['string', 'max:10'],
        ]);

        $available = array_values(array_filter(array_unique($validated['available_languages'] ?? []), fn ($v) => is_string($v) && $v !== ''));
        if (!in_array($validated['default_language'], $available, true)) {
            $available[] = $validated['default_language'];
        }

        Setting::setValue('default_language', $validated['default_language'], 'language');
        Setting::setValue('available_languages', json_encode($available), 'language');
        Setting::setValue('language', $validated['default_language'], 'app');

        return back()->with('status', 'Language settings saved');
    }

    public function autoTranslateLanguages(Request $request)
    {
        $validated = $request->validate([
            'source_language' => ['required', 'string', 'max:10'],
            'target_language' => ['required', 'string', 'max:10', 'different:source_language'],
            'deepl_api_key' => ['required', 'string', 'max:255'],
        ]);

        Setting::setValue('deepl_api_key', $validated['deepl_api_key'], 'translation');
        Setting::setValue('translation_source_language', $validated['source_language'], 'translation');

        $source = $validated['source_language'];
        $target = $validated['target_language'];

        $sourcePath = resource_path('lang'.DIRECTORY_SEPARATOR.$source.'.json');
        if (!File::exists($sourcePath)) {
            return back()->withErrors(['source_language' => "Missing source file: {$source}.json"]);
        }

        $sourceJson = json_decode((string) File::get($sourcePath), true);
        if (!is_array($sourceJson)) {
            return back()->withErrors(['source_language' => 'Invalid source translation JSON file.']);
        }

        $keys = array_keys($sourceJson);
        $texts = array_values($sourceJson);

        $translated = [];
        $endpoint = 'https://api-free.deepl.com/v2/translate';

        $batchSize = 50;
        for ($i = 0; $i < count($texts); $i += $batchSize) {
            $sliceKeys = array_slice($keys, $i, $batchSize);
            $sliceTexts = array_slice($texts, $i, $batchSize);

            $resp = Http::asForm()
                ->withHeaders(['Authorization' => 'DeepL-Auth-Key '.$validated['deepl_api_key']])
                ->post($endpoint, [
                    'text' => $sliceTexts,
                    'source_lang' => strtoupper($source),
                    'target_lang' => strtoupper($target),
                ]);

            if (!$resp->successful()) {
                return back()->withErrors(['deepl_api_key' => 'DeepL request failed: '.$resp->status()]);
            }

            $json = $resp->json();
            $items = $json['translations'] ?? null;
            if (!is_array($items) || count($items) !== count($sliceTexts)) {
                return back()->withErrors(['deepl_api_key' => 'DeepL response invalid.']);
            }

            foreach ($items as $idx => $item) {
                $t = is_array($item) ? ($item['text'] ?? '') : '';
                $translated[$sliceKeys[$idx]] = $t;
            }
        }

        $targetPath = resource_path('lang'.DIRECTORY_SEPARATOR.$target.'.json');
        File::ensureDirectoryExists(dirname($targetPath));
        File::put($targetPath, json_encode($translated, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        $available = json_decode(Setting::getValue('available_languages', '["en","sw"]'), true) ?: ['en', 'sw'];
        if (!in_array($target, $available, true)) {
            $available[] = $target;
            Setting::setValue('available_languages', json_encode($available), 'language');
        }

        return back()->with('status', 'Auto translate completed');
    }

    public function updateCurrencySettings(Request $request)
    {
        $validated = $request->validate([
            'currency_code' => ['required', 'string', 'max:10'],
            'currency_symbol' => ['required', 'string', 'max:10'],
            'currency_symbol_position' => ['required', 'string', Rule::in(['before', 'after'])],
            'currency_decimals' => ['required', 'integer', 'min:0', 'max:6'],
            'currency_decimal_separator' => ['required', 'string', 'max:2'],
            'currency_thousand_separator' => ['required', 'string', 'max:2'],
        ]);

        Setting::setValue('currency_code', $validated['currency_code'], 'currency');
        Setting::setValue('currency_symbol', $validated['currency_symbol'], 'currency');
        Setting::setValue('currency_symbol_position', $validated['currency_symbol_position'], 'currency');
        Setting::setValue('currency_decimals', (string) $validated['currency_decimals'], 'currency');
        Setting::setValue('currency_decimal_separator', $validated['currency_decimal_separator'], 'currency');
        Setting::setValue('currency_thousand_separator', $validated['currency_thousand_separator'], 'currency');
        Setting::setValue('currency', $validated['currency_code'], 'app');

        return back()->with('status', 'Currency settings saved');
    }

    public function updateStorageSettings(Request $request)
    {
        $validated = $request->validate([
            'storage_default_disk' => ['required', 'string', Rule::in(['public', 'local'])],
            'storage_quota_mb' => ['required', 'integer', 'min:0', 'max:1048576'],
            'storage_retention_days' => ['required', 'integer', 'min:0', 'max:36500'],
        ]);

        Setting::setValue('storage_default_disk', $validated['storage_default_disk'], 'storage');
        Setting::setValue('storage_quota_mb', (string) $validated['storage_quota_mb'], 'storage');
        Setting::setValue('storage_retention_days', (string) $validated['storage_retention_days'], 'storage');

        return back()->with('status', 'Storage settings saved');
    }

    public function updateSocialLoginSettings(Request $request)
    {
        $validated = $request->validate([
            'social_google_enabled' => ['nullable', 'boolean'],
            'social_google_client_id' => ['nullable', 'string', 'max:255'],
            'social_google_client_secret' => ['nullable', 'string', 'max:255'],

            'social_apple_enabled' => ['nullable', 'boolean'],
            'social_apple_client_id' => ['nullable', 'string', 'max:255'],
            'social_apple_client_secret' => ['nullable', 'string', 'max:255'],

            'social_facebook_enabled' => ['nullable', 'boolean'],
            'social_facebook_client_id' => ['nullable', 'string', 'max:255'],
            'social_facebook_client_secret' => ['nullable', 'string', 'max:255'],
        ]);

        Setting::setValue('social_google_enabled', !empty($validated['social_google_enabled']) ? '1' : '0', 'social_login_google');
        Setting::setValue('social_google_client_id', $validated['social_google_client_id'] ?? '', 'social_login_google');
        Setting::setValue('social_google_client_secret', $validated['social_google_client_secret'] ?? '', 'social_login_google');

        Setting::setValue('social_apple_enabled', !empty($validated['social_apple_enabled']) ? '1' : '0', 'social_login_apple');
        Setting::setValue('social_apple_client_id', $validated['social_apple_client_id'] ?? '', 'social_login_apple');
        Setting::setValue('social_apple_client_secret', $validated['social_apple_client_secret'] ?? '', 'social_login_apple');

        Setting::setValue('social_facebook_enabled', !empty($validated['social_facebook_enabled']) ? '1' : '0', 'social_login_facebook');
        Setting::setValue('social_facebook_client_id', $validated['social_facebook_client_id'] ?? '', 'social_login_facebook');
        Setting::setValue('social_facebook_client_secret', $validated['social_facebook_client_secret'] ?? '', 'social_login_facebook');

        return back()->with('status', 'Social login settings saved');
    }

    public function updateGoogleCalendarSettings(Request $request)
    {
        $validated = $request->validate([
            'google_calendar_enabled' => ['nullable', 'boolean'],
            'google_calendar_client_id' => ['nullable', 'string', 'max:255'],
            'google_calendar_client_secret' => ['nullable', 'string', 'max:255'],
            'google_calendar_sync_enabled' => ['nullable', 'boolean'],
            'google_calendar_sync_interval_min' => ['nullable', 'integer', 'min:1', 'max:1440'],
        ]);

        Setting::setValue('google_calendar_enabled', !empty($validated['google_calendar_enabled']) ? '1' : '0', 'google_calendar');
        Setting::setValue('google_calendar_client_id', $validated['google_calendar_client_id'] ?? '', 'google_calendar');
        if (($validated['google_calendar_client_secret'] ?? '') !== '') {
            Setting::setValue('google_calendar_client_secret', $validated['google_calendar_client_secret'], 'google_calendar');
        }
        Setting::setValue('google_calendar_sync_enabled', !empty($validated['google_calendar_sync_enabled']) ? '1' : '0', 'google_calendar');
        Setting::setValue('google_calendar_sync_interval_min', (string) ((int) ($validated['google_calendar_sync_interval_min'] ?? 10)), 'google_calendar');

        return back()->with('status', 'Google Calendar settings saved');
    }

    public function updateThemeSettings(Request $request)
    {
        $validated = $request->validate([
            'theme_direction' => ['required', 'string', Rule::in(['ltr', 'rtl'])],
            'theme_mode' => ['required', 'string', Rule::in(['light', 'dark', 'system'])],
            'theme_bg' => ['nullable', 'string', 'max:32'],
        ]);

        $bg = (string) ($validated['theme_bg'] ?? '');
        if ($bg === '') {
            $bg = '#f7f5f0';
        }

        Setting::setValue('theme_direction', $validated['theme_direction'], 'theme');
        Setting::setValue('theme_mode', $validated['theme_mode'], 'theme');
        Setting::setValue('theme_bg', $bg, 'theme');

        return back()->with('status', 'Theme settings saved');
    }

    public function updateModuleSettings(Request $request)
    {
        $validated = $request->validate([
            'modules' => ['required', 'array'],
        ]);

        $modules = $validated['modules'] ?? [];
        if (!is_array($modules)) {
            $modules = [];
        }

        $known = $this->listModules();
        $knownMap = array_fill_keys($known, true);

        $next = [];
        foreach ($modules as $name => $enabled) {
            $name = (string) $name;
            if ($name === '' || !isset($knownMap[$name])) {
                continue;
            }
            $next[$name] = (bool) $enabled;
        }

        foreach ($known as $name) {
            if (!array_key_exists($name, $next)) {
                $next[$name] = true;
            }
        }

        ksort($next);
        $this->writeModuleStatuses($next);

        return back()->with('status', 'Module settings saved');
    }

    public function updatePaymentSettings(Request $request)
    {
        $validated = $request->validate([
            'payment_provider' => ['required', 'string', Rule::in(['pesapal', 'selcom', 'zenopay'])],
            'payment_webhook_secret' => ['nullable', 'string', 'max:255'],

            'pesapal_environment' => ['nullable', 'string', Rule::in(['sandbox', 'live'])],
            'pesapal_consumer_key' => ['nullable', 'string', 'max:255'],
            'pesapal_consumer_secret' => ['nullable', 'string', 'max:255'],

            'selcom_environment' => ['nullable', 'string', Rule::in(['sandbox', 'live'])],
            'selcom_vendor_id' => ['nullable', 'string', 'max:255'],
            'selcom_api_key' => ['nullable', 'string', 'max:255'],
            'selcom_api_secret' => ['nullable', 'string', 'max:255'],

            'zenopay_environment' => ['nullable', 'string', Rule::in(['sandbox', 'live'])],
            'zenopay_account_id' => ['nullable', 'string', 'max:255'],
            'zenopay_api_key' => ['nullable', 'string', 'max:255'],
            'zenopay_api_secret' => ['nullable', 'string', 'max:255'],
        ]);

        Setting::setValue('payment_provider', $validated['payment_provider'], 'payment');
        Setting::setValue('payment_webhook_secret', $validated['payment_webhook_secret'] ?? '', 'payment_webhook');

        Setting::setValue('pesapal_environment', $validated['pesapal_environment'] ?? 'sandbox', 'payment_pesapal');
        Setting::setValue('pesapal_consumer_key', $validated['pesapal_consumer_key'] ?? '', 'payment_pesapal');
        Setting::setValue('pesapal_consumer_secret', $validated['pesapal_consumer_secret'] ?? '', 'payment_pesapal');

        Setting::setValue('selcom_environment', $validated['selcom_environment'] ?? 'sandbox', 'payment_selcom');
        Setting::setValue('selcom_vendor_id', $validated['selcom_vendor_id'] ?? '', 'payment_selcom');
        Setting::setValue('selcom_api_key', $validated['selcom_api_key'] ?? '', 'payment_selcom');
        Setting::setValue('selcom_api_secret', $validated['selcom_api_secret'] ?? '', 'payment_selcom');

        Setting::setValue('zenopay_environment', $validated['zenopay_environment'] ?? 'sandbox', 'payment_zenopay');
        Setting::setValue('zenopay_account_id', $validated['zenopay_account_id'] ?? '', 'payment_zenopay');
        Setting::setValue('zenopay_api_key', $validated['zenopay_api_key'] ?? '', 'payment_zenopay');
        Setting::setValue('zenopay_api_secret', $validated['zenopay_api_secret'] ?? '', 'payment_zenopay');

        return back()->with('status', 'Payment settings saved');
    }

    public function updateProfileSettings(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'designation' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'country' => ['nullable', 'string', 'max:120'],
            'language' => ['nullable', 'string', 'max:20'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user?->id)],
            'password' => ['nullable', 'string', 'min:8', 'max:255'],
            'payment_method' => ['nullable', 'string', 'max:50'],
            'bank_name' => ['nullable', 'string', 'max:120'],
            'bank_account_name' => ['nullable', 'string', 'max:120'],
            'bank_account_number' => ['nullable', 'string', 'max:60'],
            'mobile_money_provider' => ['nullable', 'string', 'max:60'],
            'mobile_money_number' => ['nullable', 'string', 'max:60'],
            'tax_number' => ['nullable', 'string', 'max:60'],
        ]);

        $employee = Employee::query()->firstOrCreate(
            ['user_id' => $user->id],
            ['full_name' => $user->name]
        );

        $employee->fill([
            'full_name' => $validated['full_name'],
            'designation' => $validated['designation'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'country' => $validated['country'] ?? null,
            'language' => $validated['language'] ?? null,
        ]);
        $employee->save();

        if ($user->email !== $validated['email']) {
            $user->email = $validated['email'];
        }
        $user->name = $validated['full_name'];
        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }
        $user->save();

        EmployeePaymentDetail::query()->updateOrCreate(
            ['employee_id' => $employee->id],
            [
                'payment_method' => $validated['payment_method'] ?? null,
                'bank_name' => $validated['bank_name'] ?? null,
                'bank_account_name' => $validated['bank_account_name'] ?? null,
                'bank_account_number' => $validated['bank_account_number'] ?? null,
                'mobile_money_provider' => $validated['mobile_money_provider'] ?? null,
                'mobile_money_number' => $validated['mobile_money_number'] ?? null,
                'tax_number' => $validated['tax_number'] ?? null,
            ]
        );

        return back()->with('status', 'Profile settings saved');
    }

    public function updateProfileAvatar(Request $request)
    {
        $validated = $request->validate([
            'avatar' => ['required', 'file', 'max:5120', 'mimes:jpg,jpeg,png,webp'],
        ]);

        $user = $request->user();
        $employee = Employee::query()->firstOrCreate(
            ['user_id' => $user->id],
            ['full_name' => $user->name]
        );

        $employee->addMedia($validated['avatar'])->toMediaCollection('avatar');

        return back()->with('status', 'Profile picture updated');
    }

    public function uploadProfileDocument(Request $request)
    {
        $validated = $request->validate([
            'document' => ['required', 'file', 'max:20480'],
            'document_name' => ['nullable', 'string', 'max:255'],
        ]);

        $user = $request->user();
        $employee = Employee::query()->firstOrCreate(
            ['user_id' => $user->id],
            ['full_name' => $user->name]
        );

        $mediaAdder = $employee->addMedia($validated['document']);
        if (!empty($validated['document_name'])) {
            $mediaAdder->usingName($validated['document_name']);
        }
        $mediaAdder->toMediaCollection('documents');

        return back()->with('status', 'Document uploaded');
    }

    public function deleteProfileDocument(Request $request, int $mediaId)
    {
        $employee = $request->user()?->employee;
        if (!$employee) {
            return back();
        }

        $media = $employee->media()->where('id', $mediaId)->first();
        if ($media) {
            $media->delete();
        }

        return back()->with('status', 'Document removed');
    }
}
