<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\EmployeePaymentDetail;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
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
