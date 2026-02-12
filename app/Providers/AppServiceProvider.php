<?php

namespace App\Providers;

use App\Models\Setting;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        try {
            $name = Setting::getValue('website_name');
            $timezone = Setting::getValue('timezone');
            $defaultLanguage = Setting::getValue('default_language', Setting::getValue('language', 'en'));

            $smtpEnabled = Setting::getValue('smtp_enabled', '0') === '1';
            $smtpHost = Setting::getValue('smtp_host', '');
            $smtpPort = Setting::getValue('smtp_port', '');
            $smtpUsername = Setting::getValue('smtp_username', '');
            $smtpPassword = Setting::getValue('smtp_password', '');
            $smtpEncryption = Setting::getValue('smtp_encryption', 'tls');
            $smtpFromAddress = Setting::getValue('smtp_from_address', '');
            $smtpFromName = Setting::getValue('smtp_from_name', '');

            $smsEnabled = Setting::getValue('sms_enabled', '0') === '1';
            $smsProvider = Setting::getValue('sms_provider', 'africastalking');
            $smsSenderId = Setting::getValue('sms_sender_id', '');
            $smsApiKey = Setting::getValue('sms_api_key', '');
            $smsUsername = Setting::getValue('sms_username', '');

            if ($name) {
                config(['app.name' => $name]);
            }

            if ($timezone) {
                config(['app.timezone' => $timezone]);
                date_default_timezone_set($timezone);
            }

            if ($defaultLanguage) {
                config(['app.locale' => $defaultLanguage]);
                app()->setLocale($defaultLanguage);
            }

            if ($smtpEnabled) {
                config([
                    'mail.default' => 'smtp',
                    'mail.mailers.smtp.host' => $smtpHost ?: config('mail.mailers.smtp.host'),
                    'mail.mailers.smtp.port' => $smtpPort !== '' ? (int) $smtpPort : config('mail.mailers.smtp.port'),
                    'mail.mailers.smtp.username' => $smtpUsername !== '' ? $smtpUsername : config('mail.mailers.smtp.username'),
                    'mail.mailers.smtp.password' => $smtpPassword !== '' ? $smtpPassword : config('mail.mailers.smtp.password'),
                    'mail.mailers.smtp.scheme' => in_array($smtpEncryption, ['tls', 'ssl'], true) ? $smtpEncryption : null,
                ]);

                if ($smtpFromAddress) {
                    config([
                        'mail.from.address' => $smtpFromAddress,
                        'mail.from.name' => $smtpFromName ?: (string) config('app.name'),
                    ]);
                }
            }

            config([
                'services.sms' => [
                    'enabled' => $smsEnabled,
                    'provider' => $smsProvider,
                    'sender_id' => $smsSenderId,
                    'api_key' => $smsApiKey,
                    'username' => $smsUsername,
                ],
            ]);
        } catch (\Throwable $e) {
            // ignore if settings table is not migrated yet
        }
    }
}
