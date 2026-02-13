import AdminPanelLayout from '@/Layouts/AdminPanelLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowPathIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    KeyIcon,
    PlayIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useMemo, useState } from 'react';
import DatabaseBackupSettings from './Sections/DatabaseBackupSettings';
import FinanceSettings from './Sections/FinanceSettings';
import GoogleCalendarSettings from './Sections/GoogleCalendarSettings';
import ModuleSettings from './Sections/ModuleSettings';
import PaymentCredentials from './Sections/PaymentCredentials';
import RestApiSetting from './Sections/RestApiSetting';
import SecuritySettings from './Sections/SecuritySettings';
import SocialLoginSettings from './Sections/SocialLoginSettings';
import StorageSettings from './Sections/StorageSettings';
import SuperadminRolePermissions from './Sections/SuperadminRolePermissions';
import ThemeSettings from './Sections/ThemeSettings';
import UpdateApp from './Sections/UpdateApp';

export default function Settings() {
    const page = usePage();
    const appSettings = page.props.appSettings || {};
    const uploadSettings = page.props.uploadSettings || {};
    const mapsSettings = page.props.mapsSettings || {};
    const storageSettings = page.props.storageSettings || {};
    const storageStats = page.props.storageStats || {};
    const notificationSettings = page.props.notificationSettings || {};
    const languageSettings = page.props.languageSettings || {};
    const currencySettings = page.props.currencySettings || {};
    const paymentSettings = page.props.paymentSettings || {};
    const socialLoginSettings = page.props.socialLoginSettings || {};
    const googleCalendarSettings = page.props.googleCalendarSettings || {};
    const themeSettings = page.props.themeSettings || {};
    const moduleSettings = page.props.moduleSettings || {};
    const employeeProfile = page.props.employeeProfile || {};
    const [timezones, setTimezones] = useState([]);
    const [mimeDraft, setMimeDraft] = useState('');
    const [phoneDialCode, setPhoneDialCode] = useState('+255');
    const [phoneLocal, setPhoneLocal] = useState('');
    const [showAddLanguage, setShowAddLanguage] = useState(false);
    const [newLangCode, setNewLangCode] = useState('');
    const [showAutoTranslate, setShowAutoTranslate] = useState(false);
    const [autoStep, setAutoStep] = useState(1);
    const [autoBusy, setAutoBusy] = useState(false);
    const [autoError, setAutoError] = useState('');
    const [autoSourceLang, setAutoSourceLang] = useState('en');
    const [autoTargetLang, setAutoTargetLang] = useState('sw');
    const [autoApiKey, setAutoApiKey] = useState('');

    const url = page.url || '';

    const notificationSectionMatch = url.match(/[?&]nsection=([^&]+)/);
    const nsection = notificationSectionMatch ? decodeURIComponent(notificationSectionMatch[1]) : 'smtp';

    const tabMatch = url.match(/[?&]tab=([^&]+)/);
    const tab = tabMatch ? decodeURIComponent(tabMatch[1]) : 'app_settings';

    const sectionMatch = url.match(/[?&]section=([^&]+)/);
    const section = sectionMatch ? decodeURIComponent(sectionMatch[1]) : 'app';

    const items = [
        { key: 'app_settings', label: 'App Settings', href: route('admin.settings', { tab: 'app_settings' }) },
        { key: 'profile_settings', label: 'Profile Settings', href: route('admin.settings', { tab: 'profile_settings' }) },
        { key: 'notification_settings', label: 'Notification Settings', href: route('admin.settings', { tab: 'notification_settings' }) },
        { key: 'language_settings', label: 'Language Settings', href: route('admin.settings', { tab: 'language_settings' }) },
        { key: 'currency_settings', label: 'Currency Settings', href: route('admin.settings', { tab: 'currency_settings' }) },
        { key: 'payment_credentials', label: 'Payment Credentials', href: route('admin.settings', { tab: 'payment_credentials' }) },
        { key: 'finance_settings', label: 'Finance Settings', href: route('admin.settings', { tab: 'finance_settings' }) },
        { key: 'custom_fields', label: 'Custom Fields', href: route('admin.settings', { tab: 'custom_fields' }) },
        { key: 'superadmin_role_permissions', label: 'Superadmin Role & Permission', href: route('admin.settings', { tab: 'superadmin_role_permissions' }) },
        { key: 'storage_settings', label: 'Storage Settings', href: route('admin.settings', { tab: 'storage_settings' }) },
        { key: 'social_login_settings', label: 'Social Login Settings', href: route('admin.settings', { tab: 'social_login_settings' }) },
        { key: 'security_settings', label: 'Security Settings', href: route('admin.settings', { tab: 'security_settings' }) },
        { key: 'google_calendar_settings', label: 'Google Calendar Settings', href: route('admin.settings', { tab: 'google_calendar_settings' }) },
        { key: 'theme_settings', label: 'Theme Settings', href: route('admin.settings', { tab: 'theme_settings' }) },
        { key: 'module_settings', label: 'Module Settings', href: route('admin.settings', { tab: 'module_settings' }) },
        { key: 'rest_api_setting', label: 'Rest API Setting', href: route('admin.settings', { tab: 'rest_api_setting' }) },
        { key: 'database_backup_settings', label: 'Database Backup Settings', href: route('admin.settings', { tab: 'database_backup_settings' }) },
        { key: 'update_app', label: 'Update App', href: route('admin.settings', { tab: 'update_app' }) },
    ];

    const active = items.some((i) => i.key === tab) ? tab : 'app_settings';
    const activeLabel = items.find((i) => i.key === active)?.label || 'App Settings';

    const { data, setData, post, processing, errors } = useForm({
        website_name: appSettings.website_name || '',
        timezone: appSettings.timezone || 'UTC',
        date_format: appSettings.date_format || 'd-m-Y',
        time_format: appSettings.time_format || '12',
        currency: appSettings.currency || 'USD',
        language: appSettings.language || 'en',
        datatable_row_limit: appSettings.datatable_row_limit ?? 10,
        session_driver: appSettings.session_driver || 'file',
        enable_cache: !!appSettings.enable_cache,
        app_debug: !!appSettings.app_debug,
        app_update: !!appSettings.app_update,
        company_need_approval: !!appSettings.company_need_approval,
        email_verification: !!appSettings.email_verification,
        max_file_size_mb: uploadSettings.max_file_size_mb ?? 10,
        max_files: uploadSettings.max_files ?? 10,
        allowed_mime_types: Array.isArray(uploadSettings.allowed_mime_types) ? uploadSettings.allowed_mime_types : [],
        google_maps_api_key: mapsSettings.google_maps_api_key || '',
        full_name: employeeProfile.full_name || '',
        designation: employeeProfile.designation || '',
        phone: employeeProfile.phone || '',
        country: employeeProfile.country || '',
        language: employeeProfile.language || '',
        email: employeeProfile.email || '',
        password: '',
        payment_method: employeeProfile.payment?.payment_method || '',
        bank_name: employeeProfile.payment?.bank_name || '',
        bank_account_name: employeeProfile.payment?.bank_account_name || '',
        bank_account_number: employeeProfile.payment?.bank_account_number || '',
        mobile_money_provider: employeeProfile.payment?.mobile_money_provider || '',
        mobile_money_number: employeeProfile.payment?.mobile_money_number || '',
        tax_number: employeeProfile.payment?.tax_number || '',

        smtp_enabled: !!notificationSettings.smtp?.enabled,
        smtp_host: notificationSettings.smtp?.host || '',
        smtp_port: notificationSettings.smtp?.port || '',
        smtp_username: notificationSettings.smtp?.username || '',
        smtp_password: '',
        smtp_encryption: notificationSettings.smtp?.encryption || 'tls',
        smtp_from_address: notificationSettings.smtp?.from_address || '',
        smtp_from_name: notificationSettings.smtp?.from_name || '',

        sms_enabled: !!notificationSettings.sms?.enabled,
        sms_provider: notificationSettings.sms?.provider || 'africastalking',
        sms_sender_id: notificationSettings.sms?.sender_id || '',
        sms_api_key: '',
        sms_username: notificationSettings.sms?.username || '',

        default_language: languageSettings.default || 'en',
        available_languages: Array.isArray(languageSettings.available) ? languageSettings.available : ['en', 'sw'],

        currency_code: currencySettings.code || 'USD',
        currency_symbol: currencySettings.symbol || '$',
        currency_symbol_position: currencySettings.symbol_position || 'before',
        currency_decimals: currencySettings.decimals ?? 2,
        currency_decimal_separator: currencySettings.decimal_separator || '.',
        currency_thousand_separator: currencySettings.thousand_separator || ',',

        payment_provider: paymentSettings.provider || 'pesapal',
        payment_webhook_secret: paymentSettings.webhook_secret || '',

        pesapal_environment: paymentSettings.pesapal?.environment || 'sandbox',
        pesapal_consumer_key: paymentSettings.pesapal?.consumer_key || '',
        pesapal_consumer_secret: '',

        selcom_environment: paymentSettings.selcom?.environment || 'sandbox',
        selcom_vendor_id: paymentSettings.selcom?.vendor_id || '',
        selcom_api_key: paymentSettings.selcom?.api_key || '',
        selcom_api_secret: '',

        zenopay_environment: paymentSettings.zenopay?.environment || 'sandbox',
        zenopay_account_id: paymentSettings.zenopay?.account_id || '',
        zenopay_api_key: paymentSettings.zenopay?.api_key || '',
        zenopay_api_secret: '',

        storage_default_disk: storageSettings.default_disk || 'public',
        storage_quota_mb: storageSettings.quota_mb ?? 1024,
        storage_retention_days: storageSettings.retention_days ?? 0,

        social_provider: 'google',
        social_google_enabled: !!socialLoginSettings.google?.enabled,
        social_google_client_id: socialLoginSettings.google?.client_id || '',
        social_google_client_secret: '',
        social_apple_enabled: !!socialLoginSettings.apple?.enabled,
        social_apple_client_id: socialLoginSettings.apple?.client_id || '',
        social_apple_client_secret: '',
        social_facebook_enabled: !!socialLoginSettings.facebook?.enabled,
        social_facebook_client_id: socialLoginSettings.facebook?.client_id || '',
        social_facebook_client_secret: '',

        google_calendar_enabled: !!googleCalendarSettings.enabled,
        google_calendar_client_id: googleCalendarSettings.client_id || '',
        google_calendar_client_secret: '',
        google_calendar_sync_enabled: googleCalendarSettings.sync_enabled ?? true,
        google_calendar_sync_interval_min: googleCalendarSettings.sync_interval_min ?? 10,

        theme_direction: themeSettings.direction || 'ltr',
        theme_mode: themeSettings.mode || 'light',
        theme_bg: themeSettings.bg || '#f7f5f0',

        modules: Array.isArray(moduleSettings.modules)
            ? moduleSettings.modules.reduce((acc, m) => {
                  if (m?.name) acc[m.name] = !!m.enabled;
                  return acc;
              }, {})
            : {},
    });

    const avatarForm = useForm({
        avatar: null,
    });

    const documentForm = useForm({
        document: null,
        document_name: '',
    });

    useEffect(() => {
        const raw = String(employeeProfile.phone || '').trim();
        const dialCodes = ['+255', '+254', '+256', '+250', '+1'];
        const match = dialCodes.find((d) => raw.startsWith(d));
        if (match) {
            setPhoneDialCode(match);
            setPhoneLocal(raw.slice(match.length).trim());
        } else {
            setPhoneDialCode('+255');
            setPhoneLocal(raw);
        }
    }, [employeeProfile.phone]);

    useEffect(() => {
        setMimeDraft('');
    }, [section]);

    useEffect(() => {
        let cancelled = false;
        fetch(route('api.timezones'))
            .then((r) => r.json())
            .then((json) => {
                if (!cancelled) setTimezones(Array.isArray(json) ? json : []);
            })
            .catch(() => {
                if (!cancelled) setTimezones([]);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const dateFormats = useMemo(
        () => [
            { value: 'd-m-Y', label: 'd-m-Y (12-02-2026)' },
            { value: 'Y-m-d', label: 'Y-m-d (2026-02-12)' },
            { value: 'm/d/Y', label: 'm/d/Y (02/12/2026)' },
            { value: 'd M, Y', label: 'd M, Y (12 Feb, 2026)' },
        ],
        [],
    );

    const timeFormats = useMemo(
        () => [
            { value: '12', label: '12 Hour(s) (10:53 pm)' },
            { value: '24', label: '24 Hour(s) (22:53)' },
        ],
        [],
    );

    const sessionDrivers = useMemo(
        () => [
            { value: 'file', label: 'File' },
            { value: 'database', label: 'Database' },
            { value: 'cookie', label: 'Cookie' },
            { value: 'redis', label: 'Redis' },
        ],
        [],
    );

    const submitAppSettings = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'), {
            preserveScroll: true,
        });
    };

    const submitUploadSettings = (e) => {
        e.preventDefault();
        post(route('admin.settings.upload.update'), {
            preserveScroll: true,
        });
    };

    const submitMapsSettings = (e) => {
        e.preventDefault();
        post(route('admin.settings.maps.update'), {
            preserveScroll: true,
        });
    };

    const submitProfileSettings = (e) => {
        e.preventDefault();
        post(route('admin.settings.profile.update'), {
            preserveScroll: true,
        });
    };

    const submitAvatar = (e) => {
        e.preventDefault();
        avatarForm.post(route('admin.settings.profile.avatar'), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    const submitDocument = (e) => {
        e.preventDefault();
        documentForm.post(route('admin.settings.profile.documents.upload'), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    const submitSmtpSettings = (e) => {
        e.preventDefault();
        post(route('admin.settings.notification.smtp.update'), {
            preserveScroll: true,
        });
    };

    const submitSmsSettings = (e) => {
        e.preventDefault();
        post(route('admin.settings.notification.sms.update'), {
            preserveScroll: true,
        });
    };

    const submitLanguageSettings = (e) => {
        e.preventDefault();
        post(route('admin.settings.language.update'), {
            preserveScroll: true,
        });
    };

    const submitCurrencySettings = (e) => {
        e.preventDefault();
        post(route('admin.settings.currency.update'), {
            preserveScroll: true,
        });
    };

    const submitPaymentSettings = () => {
        post(route('admin.settings.payment.update'), {
            preserveScroll: true,
        });
    };

    const submitStorageSettings = () => {
        post(route('admin.settings.storage.update'), {
            preserveScroll: true,
        });
    };

    const submitSocialLoginSettings = () => {
        post(route('admin.settings.social_login.update'), {
            preserveScroll: true,
        });
    };

    const submitGoogleCalendarSettings = () => {
        post(route('admin.settings.google_calendar.update'), {
            preserveScroll: true,
        });
    };

    const submitThemeSettings = () => {
        post(route('admin.settings.theme.update'), {
            preserveScroll: true,
        });
    };

    const submitModuleSettings = () => {
        post(route('admin.settings.modules.update'), {
            preserveScroll: true,
        });
    };

    const NotificationTabs = ({ current }) => {
        const base = route('admin.settings', { tab: 'notification_settings' });
        const makeHref = (s) => `${base}${base.includes('?') ? '&' : '?'}nsection=${encodeURIComponent(s)}`;
        const tabClass = (isActive) =>
            'inline-flex items-center border-b-2 px-4 py-3 text-[12px] font-semibold transition ' +
            (isActive
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900');

        return (
            <div className="border-b border-slate-200">
                <div className="flex items-center gap-1 px-2">
                    <Link href={makeHref('smtp')} className={tabClass(current === 'smtp')}>
                        SMTP
                    </Link>
                    <Link href={makeHref('sms')} className={tabClass(current === 'sms')}>
                        SMS
                    </Link>
                </div>
            </div>
        );
    };

    const addMimeType = (raw) => {
        const value = String(raw || '').trim();
        if (!value) return;
        const next = Array.from(new Set([...(data.allowed_mime_types || []), value]));
        setData('allowed_mime_types', next);
    };

    const removeMimeType = (value) => {
        const next = (data.allowed_mime_types || []).filter((t) => t !== value);
        setData('allowed_mime_types', next);
    };

    const Tabs = ({ current }) => {
        const base = route('admin.settings', { tab: 'app_settings' });
        const makeHref = (s) => `${base}${base.includes('?') ? '&' : '?'}section=${encodeURIComponent(s)}`;
        const tabClass = (isActive) =>
            'inline-flex items-center border-b-2 px-4 py-3 text-[12px] font-semibold transition ' +
            (isActive
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900');

        return (
            <div className="border-b border-slate-200">
                <div className="flex items-center gap-1 px-2">
                    <Link href={makeHref('app')} className={tabClass(current === 'app')}>
                        App Settings
                    </Link>
                    <Link href={makeHref('upload')} className={tabClass(current === 'upload')}>
                        File Upload Settings
                    </Link>
                    <Link href={makeHref('maps')} className={tabClass(current === 'maps')}>
                        Google Map Settings
                    </Link>
                </div>
            </div>
        );
    };

    return (
        <>
            <Head title={activeLabel} />
            <AdminPanelLayout title="App Settings" active={active} items={items}>
                <div className="border-b border-slate-200 px-6 py-4">
                    <div className="text-sm font-semibold text-slate-900">
                        {activeLabel}
                    </div>
                    <div className="mt-1 text-[12px] text-slate-500">
                        Configure system defaults and preferences.
                    </div>
                </div>

                {active === 'app_settings' ? (
                    <div className="px-6 pb-6 pt-4">
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                            <Tabs current={section} />

                            {section === 'app' ? (
                                <form onSubmit={submitAppSettings} className="p-6">
                                    <div className="grid gap-5 md:grid-cols-4">
                                        <div className="md:col-span-2">
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                Website Name
                                            </div>
                                            <input
                                                value={data.website_name}
                                                onChange={(e) => setData('website_name', e.target.value)}
                                                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                                placeholder="Fortco"
                                            />
                                            {errors.website_name && (
                                                <div className="mt-1 text-[12px] text-red-600">
                                                    {errors.website_name}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                Date Format
                                            </div>
                                            <select
                                                value={data.date_format}
                                                onChange={(e) => setData('date_format', e.target.value)}
                                                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                            >
                                                {dateFormats.map((f) => (
                                                    <option key={f.value} value={f.value}>
                                                        {f.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                Time Format
                                            </div>
                                            <select
                                                value={data.time_format}
                                                onChange={(e) => setData('time_format', e.target.value)}
                                                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                            >
                                                {timeFormats.map((f) => (
                                                    <option key={f.value} value={f.value}>
                                                        {f.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="md:col-span-2">
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                Default Timezone
                                            </div>
                                            <select
                                                value={data.timezone}
                                                onChange={(e) => setData('timezone', e.target.value)}
                                                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                            >
                                                {(timezones.length ? timezones : [{ value: data.timezone, label: data.timezone }]).map((tz) => (
                                                    <option key={tz.value} value={tz.value}>
                                                        {tz.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.timezone && (
                                                <div className="mt-1 text-[12px] text-red-600">
                                                    {errors.timezone}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                Default Currency
                                            </div>
                                            <select
                                                value={data.currency}
                                                onChange={(e) => setData('currency', e.target.value)}
                                                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                            >
                                                <option value="USD">$ (USD)</option>
                                                <option value="TZS">TSh (TZS)</option>
                                                <option value="KES">KSh (KES)</option>
                                                <option value="EUR">€ (EUR)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                Language
                                            </div>
                                            <select
                                                value={data.language}
                                                onChange={(e) => setData('language', e.target.value)}
                                                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                            >
                                                <option value="en">English</option>
                                                <option value="sw">Swahili</option>
                                            </select>
                                        </div>

                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                Datatable Row Limit
                                            </div>
                                            <select
                                                value={data.datatable_row_limit}
                                                onChange={(e) => setData('datatable_row_limit', Number(e.target.value))}
                                                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                            >
                                                {[10, 25, 50, 100, 200].map((n) => (
                                                    <option key={n} value={n}>
                                                        {n}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                Session Driver
                                            </div>
                                            <select
                                                value={data.session_driver}
                                                onChange={(e) => setData('session_driver', e.target.value)}
                                                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                            >
                                                {sessionDrivers.map((d) => (
                                                    <option key={d.value} value={d.value}>
                                                        {d.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                                        <label className="flex items-center gap-2 text-[12px] text-slate-700">
                                            <input
                                                type="checkbox"
                                                checked={data.enable_cache}
                                                onChange={(e) => setData('enable_cache', e.target.checked)}
                                                className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                            />
                                            Enable Cache
                                        </label>
                                        <label className="flex items-center gap-2 text-[12px] text-slate-700">
                                            <input
                                                type="checkbox"
                                                checked={data.company_need_approval}
                                                onChange={(e) => setData('company_need_approval', e.target.checked)}
                                                className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                            />
                                            Company Need Approval
                                        </label>
                                        <label className="flex items-center gap-2 text-[12px] text-slate-700">
                                            <input
                                                type="checkbox"
                                                checked={data.app_debug}
                                                onChange={(e) => setData('app_debug', e.target.checked)}
                                                className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                            />
                                            App Debug
                                        </label>
                                        <label className="flex items-center gap-2 text-[12px] text-slate-700">
                                            <input
                                                type="checkbox"
                                                checked={data.app_update}
                                                onChange={(e) => setData('app_update', e.target.checked)}
                                                className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                            />
                                            App Update
                                        </label>
                                        <label className="flex items-center gap-2 text-[12px] text-slate-700">
                                            <input
                                                type="checkbox"
                                                checked={data.email_verification}
                                                onChange={(e) => setData('email_verification', e.target.checked)}
                                                className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                            />
                                            Turn On Email Verification
                                        </label>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="text-[12px] text-slate-500">
                                            Changes apply after refresh.
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-[12px] font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            ) : section === 'upload' ? (
                                <form onSubmit={submitUploadSettings} className="p-6">
                                    <div className="flex flex-wrap items-center gap-6 text-[12px] text-slate-600">
                                        <div>
                                            <span className="text-slate-500">Server upload_max_filesize</span>
                                            <span className="font-semibold text-slate-900"> = {uploadSettings.server_upload_max_filesize || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500">Server post_max_size</span>
                                            <span className="font-semibold text-slate-900"> = {uploadSettings.server_post_max_size || '-'}</span>
                                        </div>
                                    </div>

                                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                Max File size for upload <span className="text-red-600">*</span>
                                            </div>
                                            <div className="mt-2 flex overflow-hidden rounded-xl border border-slate-200 bg-slate-50 focus-within:border-primary-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary-500/20">
                                                <input
                                                    type="number"
                                                    min={1}
                                                    value={data.max_file_size_mb}
                                                    onChange={(e) => setData('max_file_size_mb', Number(e.target.value))}
                                                    className="w-full bg-transparent px-4 py-3 text-[12px] text-slate-900 focus:outline-none"
                                                />
                                                <div className="flex items-center border-l border-slate-200 px-4 text-[12px] text-slate-600">
                                                    MB
                                                </div>
                                            </div>
                                            {errors.max_file_size_mb && (
                                                <div className="mt-1 text-[12px] text-red-600">{errors.max_file_size_mb}</div>
                                            )}
                                        </div>

                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                Max number of files for upload <span className="text-red-600">*</span>
                                            </div>
                                            <input
                                                type="number"
                                                min={1}
                                                value={data.max_files}
                                                onChange={(e) => setData('max_files', Number(e.target.value))}
                                                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                            />
                                            {errors.max_files && (
                                                <div className="mt-1 text-[12px] text-red-600">{errors.max_files}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                            Allowed file types for upload <span className="text-red-600">*</span>
                                        </div>

                                        <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3 focus-within:border-primary-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary-500/20">
                                            <div className="flex flex-wrap gap-2">
                                                {(data.allowed_mime_types || []).map((t) => (
                                                    <span
                                                        key={t}
                                                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[12px] text-slate-700"
                                                    >
                                                        <span className="max-w-[240px] truncate">{t}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeMimeType(t)}
                                                            className="text-slate-500 hover:text-slate-900"
                                                            aria-label={`Remove ${t}`}
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>

                                            <input
                                                value={mimeDraft}
                                                onChange={(e) => setMimeDraft(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ',') {
                                                        e.preventDefault();
                                                        addMimeType(mimeDraft);
                                                        setMimeDraft('');
                                                    }
                                                    if (e.key === 'Backspace' && !mimeDraft && (data.allowed_mime_types || []).length) {
                                                        const last = (data.allowed_mime_types || [])[data.allowed_mime_types.length - 1];
                                                        removeMimeType(last);
                                                    }
                                                }}
                                                onBlur={() => {
                                                    if (mimeDraft.trim()) {
                                                        addMimeType(mimeDraft);
                                                        setMimeDraft('');
                                                    }
                                                }}
                                                placeholder="e.g. application/x-zip-compressed"
                                                className="mt-2 w-full bg-transparent px-1 py-2 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none"
                                            />
                                        </div>

                                        {errors.allowed_mime_types && (
                                            <div className="mt-1 text-[12px] text-red-600">{errors.allowed_mime_types}</div>
                                        )}
                                    </div>

                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="text-[12px] text-slate-500">Changes apply after refresh.</div>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-[12px] font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            ) : section === 'maps' ? (
                                <form onSubmit={submitMapsSettings} className="p-6">
                                    <div className="grid gap-5 md:grid-cols-2">
                                        <div className="md:col-span-2">
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                Google Maps API Key <span className="text-red-600">*</span>
                                            </div>
                                            <input
                                                value={data.google_maps_api_key}
                                                onChange={(e) => setData('google_maps_api_key', e.target.value)}
                                                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                                placeholder="AIzaSy..."
                                            />
                                            {errors.google_maps_api_key && (
                                                <div className="mt-1 text-[12px] text-red-600">{errors.google_maps_api_key}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white">
                                        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-[12px] font-semibold text-slate-700">
                                            Preview
                                        </div>
                                        <div className="aspect-[16/6] w-full bg-slate-100">
                                            <iframe
                                                title="google-map-preview"
                                                className="h-full w-full"
                                                loading="lazy"
                                                referrerPolicy="no-referrer-when-downgrade"
                                                src={
                                                    data.google_maps_api_key
                                                        ? `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(
                                                              data.google_maps_api_key,
                                                          )}&q=${encodeURIComponent('Dar es Salaam, Tanzania')}`
                                                        : `https://maps.google.com/maps?q=${encodeURIComponent('Dar es Salaam, Tanzania')}&output=embed`
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="text-[12px] text-slate-500">Changes apply after refresh.</div>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-[12px] font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="p-6">
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-[12px] text-slate-600">
                                        This section is a placeholder. We will build the full settings UI here next.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : active === 'profile_settings' ? (
                    <div className="px-6 pb-6 pt-4">
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                            <div className="p-6">
                                <div className="text-sm font-semibold text-slate-900">Profile Settings</div>
                                <div className="mt-1 text-[12px] text-slate-500">Manage your employee profile, payment details and documents.</div>

                                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50">
                                    <div className="p-5">
                                        <div className="text-[12px] font-semibold text-slate-700">Profile Picture</div>
                                        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-100 p-6">
                                            <div className="flex items-center justify-center">
                                                <div className="h-28 w-28 overflow-hidden rounded-full border border-slate-200 bg-white">
                                                    {employeeProfile.avatar_url ? (
                                                        <img src={employeeProfile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-[36px] text-slate-400">👤</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <form onSubmit={submitAvatar} className="mt-4 grid gap-3 md:grid-cols-3">
                                            <div className="md:col-span-2">
                                                <input
                                                    type="file"
                                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                                    onChange={(e) => avatarForm.setData('avatar', e.target.files?.[0] || null)}
                                                    className="block w-full text-[12px] text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2 file:text-[12px] file:font-semibold file:text-slate-700 hover:file:bg-slate-100"
                                                />
                                                {avatarForm.errors.avatar && (
                                                    <div className="mt-1 text-[12px] text-red-600">{avatarForm.errors.avatar}</div>
                                                )}
                                            </div>
                                            <div>
                                                <button
                                                    type="submit"
                                                    disabled={avatarForm.processing}
                                                    className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-[12px] font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
                                                >
                                                    Upload
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                    <form onSubmit={submitProfileSettings} className="border-t border-slate-200 p-5">
                                        <div className="grid gap-5 lg:grid-cols-3">
                                            <div>
                                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Your Name <span className="text-red-600">*</span></div>
                                                <input
                                                    value={data.full_name}
                                                    onChange={(e) => setData('full_name', e.target.value)}
                                                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                                />
                                                {errors.full_name && <div className="mt-1 text-[12px] text-red-600">{errors.full_name}</div>}
                                            </div>

                                            <div>
                                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Your Email <span className="text-red-600">*</span></div>
                                                <input
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                                />
                                                {errors.email && <div className="mt-1 text-[12px] text-red-600">{errors.email}</div>}
                                            </div>

                                            <div>
                                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Your Password</div>
                                                <input
                                                    type="password"
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    placeholder="Must have at least 8 characters"
                                                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                                />
                                                <div className="mt-1 text-[11px] text-slate-500">Leave blank to keep the current password.</div>
                                                {errors.password && <div className="mt-1 text-[12px] text-red-600">{errors.password}</div>}
                                            </div>

                                            <div>
                                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Position / Designation</div>
                                                <input
                                                    value={data.designation}
                                                    onChange={(e) => setData('designation', e.target.value)}
                                                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                                />
                                            </div>

                                            <div>
                                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Phone Number</div>
                                                <div className="mt-2 flex overflow-hidden rounded-lg border border-slate-200 bg-white focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20">
                                                    <select
                                                        value={phoneDialCode}
                                                        onChange={(e) => {
                                                            const nextDial = e.target.value;
                                                            setPhoneDialCode(nextDial);
                                                            const combined = `${nextDial}${phoneLocal}`.trim();
                                                            setData('phone', combined);
                                                        }}
                                                        className="border-r border-slate-200 bg-slate-50 px-3 py-3 text-[12px] text-slate-700 focus:outline-none"
                                                    >
                                                        <option value="+255">TZ +255</option>
                                                        <option value="+254">KE +254</option>
                                                        <option value="+256">UG +256</option>
                                                        <option value="+250">RW +250</option>
                                                        <option value="+1">US +1</option>
                                                    </select>
                                                    <input
                                                        value={phoneLocal}
                                                        onChange={(e) => {
                                                            const local = e.target.value;
                                                            setPhoneLocal(local);
                                                            setData('phone', `${phoneDialCode}${local}`.trim());
                                                        }}
                                                        className="w-full bg-transparent px-4 py-3 text-[12px] text-slate-900 focus:outline-none"
                                                        placeholder="7XXXXXXXX"
                                                    />
                                                </div>
                                                {errors.phone && <div className="mt-1 text-[12px] text-red-600">{errors.phone}</div>}
                                            </div>

                                            <div>
                                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Country</div>
                                                <select
                                                    value={data.country}
                                                    onChange={(e) => {
                                                        const next = e.target.value;
                                                        setData('country', next);
                                                        const dialByCountry = {
                                                            Tanzania: '+255',
                                                            Kenya: '+254',
                                                            Uganda: '+256',
                                                            Rwanda: '+250',
                                                            USA: '+1',
                                                        };
                                                        const nextDial = dialByCountry[next];
                                                        if (nextDial) {
                                                            setPhoneDialCode(nextDial);
                                                            setData('phone', `${nextDial}${phoneLocal}`.trim());
                                                        }
                                                    }}
                                                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                                >
                                                    <option value="">--</option>
                                                    <option value="Tanzania">Tanzania</option>
                                                    <option value="Kenya">Kenya</option>
                                                    <option value="Uganda">Uganda</option>
                                                    <option value="Rwanda">Rwanda</option>
                                                    <option value="USA">USA</option>
                                                </select>
                                            </div>

                                            <div>
                                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Language</div>
                                                <select
                                                    value={data.language}
                                                    onChange={(e) => setData('language', e.target.value)}
                                                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                                >
                                                    <option value="">--</option>
                                                    <option value="en">English</option>
                                                    <option value="sw">Swahili</option>
                                                </select>
                                            </div>
                                        </div>

                                            <div className="mt-5 border-t border-slate-200 pt-5">
                                                <div className="text-[12px] font-semibold text-slate-700">Payment Details</div>
                                                <div className="mt-4 grid gap-5 md:grid-cols-2">
                                                    <div>
                                                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Payment Method</div>
                                                        <input
                                                            value={data.payment_method}
                                                            onChange={(e) => setData('payment_method', e.target.value)}
                                                            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tax Number</div>
                                                        <input
                                                            value={data.tax_number}
                                                            onChange={(e) => setData('tax_number', e.target.value)}
                                                            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                                        />
                                                    </div>

                                                    <div>
                                                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Bank Name</div>
                                                        <input
                                                            value={data.bank_name}
                                                            onChange={(e) => setData('bank_name', e.target.value)}
                                                            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Bank Account Name</div>
                                                        <input
                                                            value={data.bank_account_name}
                                                            onChange={(e) => setData('bank_account_name', e.target.value)}
                                                            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Bank Account Number</div>
                                                        <input
                                                            value={data.bank_account_number}
                                                            onChange={(e) => setData('bank_account_number', e.target.value)}
                                                            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Mobile Money Provider</div>
                                                        <input
                                                            value={data.mobile_money_provider}
                                                            onChange={(e) => setData('mobile_money_provider', e.target.value)}
                                                            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Mobile Money Number</div>
                                                        <input
                                                            value={data.mobile_money_number}
                                                            onChange={(e) => setData('mobile_money_number', e.target.value)}
                                                            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-5 border-t border-slate-200 pt-5">
                                                <div className="text-[12px] font-semibold text-slate-700">Documents</div>

                                                <form onSubmit={submitDocument} className="mt-4 grid gap-3 md:grid-cols-3">
                                                    <div className="md:col-span-1">
                                                        <input
                                                            value={documentForm.data.document_name}
                                                            onChange={(e) => documentForm.setData('document_name', e.target.value)}
                                                            placeholder="Document name (optional)"
                                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-1">
                                                        <input
                                                            type="file"
                                                            onChange={(e) => documentForm.setData('document', e.target.files?.[0] || null)}
                                                            className="block w-full text-[12px] text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-50 file:px-3 file:py-2 file:text-[12px] file:font-semibold file:text-slate-700 hover:file:bg-slate-100"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-1">
                                                        <button
                                                            type="submit"
                                                            disabled={documentForm.processing}
                                                            className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-[12px] font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
                                                        >
                                                            Upload
                                                        </button>
                                                    </div>
                                                    {(documentForm.errors.document || documentForm.errors.document_name) && (
                                                        <div className="md:col-span-3 text-[12px] text-red-600">
                                                            {documentForm.errors.document || documentForm.errors.document_name}
                                                        </div>
                                                    )}
                                                </form>

                                                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                                                    <div className="grid grid-cols-12 bg-slate-50 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                        <div className="col-span-6">File</div>
                                                        <div className="col-span-3">Type</div>
                                                        <div className="col-span-3 text-right">Action</div>
                                                    </div>
                                                    <div className="divide-y divide-slate-200">
                                                        {(employeeProfile.documents || []).length ? (
                                                            (employeeProfile.documents || []).map((d) => (
                                                                <div key={d.id} className="grid grid-cols-12 items-center px-4 py-3 text-[12px] text-slate-700">
                                                                    <div className="col-span-6 truncate">
                                                                        <a href={d.url} target="_blank" rel="noreferrer" className="font-semibold text-slate-900 hover:underline">
                                                                            {d.name || d.file_name}
                                                                        </a>
                                                                    </div>
                                                                    <div className="col-span-3 truncate text-slate-500">{d.mime_type || '-'}</div>
                                                                    <div className="col-span-3 flex items-center justify-end gap-2">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                router.delete(route('admin.settings.profile.documents.delete', d.id), {
                                                                                    preserveScroll: true,
                                                                                })
                                                                            }
                                                                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                                                                        >
                                                                            Remove
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="px-4 py-3 text-[12px] text-slate-500">No documents uploaded yet.</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-6 flex items-center justify-between">
                                                <div className="text-[12px] text-slate-500">Changes apply after refresh.</div>
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-[12px] font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : active === 'notification_settings' ? (
                    <div className="px-6 pb-6 pt-4">
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                            <NotificationTabs current={nsection} />

                            {nsection === 'smtp' ? (
                                <form onSubmit={submitSmtpSettings} className="p-6">
                                    <div className="grid gap-5 md:grid-cols-2">
                                        <div className="md:col-span-2 flex items-center justify-between">
                                            <div className="text-[12px] text-slate-500">Configure outgoing email via SMTP.</div>
                                            <label className="flex items-center gap-2 text-[12px] text-slate-700">
                                                <input
                                                    type="checkbox"
                                                    checked={data.smtp_enabled}
                                                    onChange={(e) => setData('smtp_enabled', e.target.checked)}
                                                    className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                                />
                                                Enable
                                            </label>
                                        </div>

                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Host</div>
                                            <input
                                                value={data.smtp_host}
                                                onChange={(e) => setData('smtp_host', e.target.value)}
                                                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                            />
                                            {errors.smtp_host && <div className="mt-1 text-[12px] text-red-600">{errors.smtp_host}</div>}
                                        </div>

                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Port</div>
                                            <input
                                                type="number"
                                                value={data.smtp_port}
                                                onChange={(e) => setData('smtp_port', e.target.value)}
                                                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                            />
                                            {errors.smtp_port && <div className="mt-1 text-[12px] text-red-600">{errors.smtp_port}</div>}
                                        </div>

                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Username</div>
                                            <input
                                                value={data.smtp_username}
                                                onChange={(e) => setData('smtp_username', e.target.value)}
                                                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                            />
                                            {errors.smtp_username && <div className="mt-1 text-[12px] text-red-600">{errors.smtp_username}</div>}
                                        </div>

                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Password</div>
                                            <input
                                                type="password"
                                                value={data.smtp_password}
                                                onChange={(e) => setData('smtp_password', e.target.value)}
                                                placeholder="Leave blank to keep current"
                                                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                            />
                                            {errors.smtp_password && <div className="mt-1 text-[12px] text-red-600">{errors.smtp_password}</div>}
                                        </div>

                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Encryption</div>
                                            <select
                                                value={data.smtp_encryption}
                                                onChange={(e) => setData('smtp_encryption', e.target.value)}
                                                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                            >
                                                <option value="tls">TLS</option>
                                                <option value="ssl">SSL</option>
                                                <option value="">None</option>
                                            </select>
                                        </div>

                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">From Address</div>
                                            <input
                                                value={data.smtp_from_address}
                                                onChange={(e) => setData('smtp_from_address', e.target.value)}
                                                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                            />
                                            {errors.smtp_from_address && <div className="mt-1 text-[12px] text-red-600">{errors.smtp_from_address}</div>}
                                        </div>

                                        <div className="md:col-span-2">
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">From Name</div>
                                            <input
                                                value={data.smtp_from_name}
                                                onChange={(e) => setData('smtp_from_name', e.target.value)}
                                                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                            />
                                            {errors.smtp_from_name && <div className="mt-1 text-[12px] text-red-600">{errors.smtp_from_name}</div>}
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="text-[12px] text-slate-500">Changes apply after refresh.</div>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-[12px] font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={submitSmsSettings} className="p-6">
                                    <div className="grid gap-5 md:grid-cols-2">
                                        <div className="md:col-span-2 flex items-center justify-between">
                                            <div className="text-[12px] text-slate-500">Configure SMS provider credentials and sender options.</div>
                                            <label className="flex items-center gap-2 text-[12px] text-slate-700">
                                                <input
                                                    type="checkbox"
                                                    checked={data.sms_enabled}
                                                    onChange={(e) => setData('sms_enabled', e.target.checked)}
                                                    className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                                />
                                                Enable
                                            </label>
                                        </div>

                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Provider</div>
                                            <select
                                                value={data.sms_provider}
                                                onChange={(e) => setData('sms_provider', e.target.value)}
                                                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                            >
                                                <option value="africastalking">Africa's Talking</option>
                                                <option value="twilio">Twilio</option>
                                            </select>
                                        </div>

                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Sender ID</div>
                                            <input
                                                value={data.sms_sender_id}
                                                onChange={(e) => setData('sms_sender_id', e.target.value)}
                                                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                            />
                                            {errors.sms_sender_id && <div className="mt-1 text-[12px] text-red-600">{errors.sms_sender_id}</div>}
                                        </div>

                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">API Key</div>
                                            <input
                                                type="password"
                                                value={data.sms_api_key}
                                                onChange={(e) => setData('sms_api_key', e.target.value)}
                                                placeholder="Leave blank to keep current"
                                                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                            />
                                            {errors.sms_api_key && <div className="mt-1 text-[12px] text-red-600">{errors.sms_api_key}</div>}
                                        </div>

                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Username</div>
                                            <input
                                                value={data.sms_username}
                                                onChange={(e) => setData('sms_username', e.target.value)}
                                                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                            />
                                            {errors.sms_username && <div className="mt-1 text-[12px] text-red-600">{errors.sms_username}</div>}
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="text-[12px] text-slate-500">Changes apply after refresh.</div>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-[12px] font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                ) : active === 'language_settings' ? (
                    <div className="px-6 pb-6 pt-4">
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                            <form onSubmit={submitLanguageSettings} className="p-6">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <div className="text-sm font-semibold text-slate-900">Language Settings</div>
                                        <div className="mt-1 text-[12px] text-slate-500">Manage the default language and available languages.</div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddLanguage((v) => !v)}
                                            className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2.5 text-[12px] font-bold text-white transition hover:bg-red-700"
                                        >
                                            + Add New Language
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => window.alert('Translate UI will be added next.')}
                                            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-bold text-slate-700 hover:bg-slate-50"
                                        >
                                            Translate
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setAutoError('');
                                                setAutoStep(1);
                                                setAutoSourceLang('en');
                                                const first = (data.available_languages || []).find((x) => x !== 'en') || 'sw';
                                                setAutoTargetLang(first);
                                                setShowAutoTranslate(true);
                                            }}
                                            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-bold text-slate-700 hover:bg-slate-50"
                                        >
                                            Auto Translate Settings
                                        </button>
                                    </div>
                                </div>

                                {showAutoTranslate ? (
                                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                                        <div
                                            className="absolute inset-0 bg-black/40"
                                            onClick={() => {
                                                if (autoBusy) return;
                                                setShowAutoTranslate(false);
                                            }}
                                        />
                                        <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                                            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm font-semibold text-slate-900">Auto Translate Wizard</div>
                                                    <button
                                                        type="button"
                                                        disabled={autoBusy}
                                                        onClick={() => setShowAutoTranslate(false)}
                                                        className="inline-flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-white hover:text-slate-900 disabled:opacity-50"
                                                        aria-label="Close"
                                                    >
                                                        <XMarkIcon className="h-5 w-5" />
                                                    </button>
                                                </div>
                                                <div className="mt-1 text-[12px] text-slate-500">Translate the public site UI using DeepL API.</div>
                                            </div>

                                            <div className="px-6 py-5">
                                                {autoStep === 1 ? (
                                                    <div>
                                                        <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-900">
                                                            <ArrowPathIcon className="h-4 w-4" />
                                                            Step 1: Choose languages
                                                        </div>
                                                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                                                            <div>
                                                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Source Language</div>
                                                                <select
                                                                    value={autoSourceLang}
                                                                    onChange={(e) => setAutoSourceLang(e.target.value)}
                                                                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                                                >
                                                                    {(data.available_languages || ['en', 'sw']).map((c) => (
                                                                        <option key={c} value={c}>
                                                                            {c.toUpperCase()}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Target Language</div>
                                                                <select
                                                                    value={autoTargetLang}
                                                                    onChange={(e) => setAutoTargetLang(e.target.value)}
                                                                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                                                >
                                                                    {(data.available_languages || ['en', 'sw'])
                                                                        .filter((c) => c !== autoSourceLang)
                                                                        .map((c) => (
                                                                            <option key={c} value={c}>
                                                                                {c.toUpperCase()}
                                                                            </option>
                                                                        ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : autoStep === 2 ? (
                                                    <div>
                                                        <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-900">
                                                            <KeyIcon className="h-4 w-4" />
                                                            Step 2: DeepL API Key
                                                        </div>
                                                        <div className="mt-2 text-[12px] text-slate-500">
                                                            Enter your DeepL API key. It will be saved in the database settings.
                                                        </div>
                                                        <div className="mt-4">
                                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">DeepL API Key</div>
                                                            <input
                                                                type="password"
                                                                value={autoApiKey}
                                                                onChange={(e) => setAutoApiKey(e.target.value)}
                                                                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                                                                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                                            />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-900">
                                                            <PlayIcon className="h-4 w-4" />
                                                            Step 3: Start
                                                        </div>
                                                        <div className="mt-2 text-[12px] text-slate-500">
                                                            This will download and translate the site UI strings from <span className="font-semibold text-slate-900">{autoSourceLang.toUpperCase()}</span> to{' '}
                                                            <span className="font-semibold text-slate-900">{autoTargetLang.toUpperCase()}</span>.
                                                        </div>

                                                        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-[12px] text-slate-600">
                                                            Tip: After translation, use the language dropdown in the header to switch languages.
                                                        </div>
                                                    </div>
                                                )}

                                                {autoError ? (
                                                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-[12px] text-red-700">{autoError}</div>
                                                ) : null}
                                            </div>

                                            <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4">
                                                <button
                                                    type="button"
                                                    disabled={autoBusy}
                                                    onClick={() => {
                                                        if (autoStep === 1) {
                                                            setShowAutoTranslate(false);
                                                        } else {
                                                            setAutoStep((s) => Math.max(1, s - 1));
                                                        }
                                                    }}
                                                    className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[12px] font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                                                >
                                                    <span className="inline-flex items-center gap-2">
                                                        <ChevronLeftIcon className="h-4 w-4" />
                                                        {autoStep === 1 ? 'Close' : 'Back'}
                                                    </span>
                                                </button>

                                                {autoStep < 3 ? (
                                                    <button
                                                        type="button"
                                                        disabled={autoBusy}
                                                        onClick={() => {
                                                            setAutoError('');
                                                            if (autoStep === 1) {
                                                                if (!autoSourceLang || !autoTargetLang || autoSourceLang === autoTargetLang) {
                                                                    setAutoError('Please select different source and target languages.');
                                                                    return;
                                                                }
                                                            }
                                                            if (autoStep === 2) {
                                                                if (!autoApiKey.trim()) {
                                                                    setAutoError('DeepL API key is required.');
                                                                    return;
                                                                }
                                                            }
                                                            setAutoStep((s) => s + 1);
                                                        }}
                                                        className="rounded-lg bg-slate-900 px-4 py-2.5 text-[12px] font-bold text-white hover:bg-slate-800 disabled:opacity-50"
                                                    >
                                                        <span className="inline-flex items-center gap-2">
                                                            Next
                                                            <ChevronRightIcon className="h-4 w-4" />
                                                        </span>
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        disabled={autoBusy}
                                                        onClick={async () => {
                                                            setAutoError('');
                                                            setAutoBusy(true);
                                                            try {
                                                                router.post(
                                                                    route('admin.settings.language.auto_translate'),
                                                                    {
                                                                        source_language: autoSourceLang,
                                                                        target_language: autoTargetLang,
                                                                        deepl_api_key: autoApiKey,
                                                                    },
                                                                    {
                                                                        preserveScroll: true,
                                                                        onSuccess: () => {
                                                                            const next = Array.from(
                                                                                new Set([...(data.available_languages || []), autoTargetLang]),
                                                                            );
                                                                            setData('available_languages', next);
                                                                            setShowAutoTranslate(false);
                                                                        },
                                                                        onError: (errs) => {
                                                                            const msg =
                                                                                errs?.deepl_api_key ||
                                                                                errs?.source_language ||
                                                                                errs?.target_language ||
                                                                                'Auto translate failed.';
                                                                            setAutoError(String(msg));
                                                                        },
                                                                        onFinish: () => {
                                                                            setAutoBusy(false);
                                                                        },
                                                                    },
                                                                );
                                                            } finally {
                                                                // handled in onFinish
                                                            }
                                                        }}
                                                        className="rounded-lg bg-red-600 px-4 py-2.5 text-[12px] font-bold text-white hover:bg-red-700 disabled:opacity-50"
                                                    >
                                                        <span className="inline-flex items-center gap-2">
                                                            <PlayIcon className="h-4 w-4" />
                                                            {autoBusy ? 'Translating…' : 'Start Translation'}
                                                        </span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : null}

                                {showAddLanguage ? (
                                    <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                        <div className="grid gap-3 md:grid-cols-3">
                                            <div>
                                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Language Code</div>
                                                <input
                                                    value={newLangCode}
                                                    onChange={(e) => setNewLangCode(e.target.value)}
                                                    placeholder="e.g. fr"
                                                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                                />
                                            </div>
                                            <div className="md:col-span-2 flex items-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const code = String(newLangCode || '').trim().toLowerCase();
                                                        if (!code) return;
                                                        const next = Array.from(new Set([...(data.available_languages || []), code]));
                                                        setData('available_languages', next);
                                                        if (!data.default_language) {
                                                            setData('default_language', code);
                                                        }
                                                        setNewLangCode('');
                                                        setShowAddLanguage(false);
                                                    }}
                                                    className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-3 text-[12px] font-bold text-white transition hover:bg-slate-800"
                                                >
                                                    Add
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setNewLangCode('');
                                                        setShowAddLanguage(false);
                                                    }}
                                                    className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] font-bold text-slate-700 hover:bg-slate-50"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}

                                <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
                                    <div className="grid grid-cols-12 bg-slate-50 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                        <div className="col-span-6">Language</div>
                                        <div className="col-span-3">Default</div>
                                        <div className="col-span-3 text-right">Enabled</div>
                                    </div>
                                    <div className="divide-y divide-slate-200 bg-white">
                                        {(data.available_languages || []).map((code) => (
                                            <div key={code} className="grid grid-cols-12 items-center px-4 py-3 text-[12px] text-slate-700">
                                                <div className="col-span-6">
                                                    <div className="font-semibold text-slate-900">{code}</div>
                                                </div>
                                                <div className="col-span-3">
                                                    <label className="inline-flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name="default_language"
                                                            checked={data.default_language === code}
                                                            onChange={() => setData('default_language', code)}
                                                            className="h-4 w-4 border-slate-300 text-primary-600 focus:ring-primary-500"
                                                        />
                                                        <span className="text-slate-600">Set</span>
                                                    </label>
                                                </div>
                                                <div className="col-span-3 flex items-center justify-end gap-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={(data.available_languages || []).includes(code)}
                                                        onChange={(e) => {
                                                            const next = e.target.checked
                                                                ? Array.from(new Set([...(data.available_languages || []), code]))
                                                                : (data.available_languages || []).filter((c) => c !== code);
                                                            setData('available_languages', next);
                                                            if (data.default_language === code && !e.target.checked) {
                                                                setData('default_language', next[0] || 'en');
                                                            }
                                                        }}
                                                        className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const next = (data.available_languages || []).filter((c) => c !== code);
                                                            setData('available_languages', next);
                                                            if (data.default_language === code) {
                                                                setData('default_language', next[0] || 'en');
                                                            }
                                                        }}
                                                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-between">
                                    <div className="text-[12px] text-slate-500">Changes apply after refresh.</div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-[12px] font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                ) : active === 'currency_settings' ? (
                    <div className="px-6 pb-6 pt-4">
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                            <form onSubmit={submitCurrencySettings} className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="text-sm font-semibold text-slate-900">Currency Settings</div>
                                        <div className="mt-1 text-[12px] text-slate-500">
                                            Configure currency defaults and formatting used across the system.
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-[12px] font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                                    >
                                        Save
                                    </button>
                                </div>

                                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                    <div className="grid gap-5 md:grid-cols-3">
                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Currency Code</div>
                                            <select
                                                value={data.currency_code}
                                                onChange={(e) => setData('currency_code', e.target.value)}
                                                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                            >
                                                <option value="USD">USD ($)</option>
                                                <option value="TZS">TZS (TSh)</option>
                                                <option value="KES">KES (KSh)</option>
                                                <option value="EUR">EUR (€)</option>
                                            </select>
                                            {errors.currency_code && <div className="mt-1 text-[12px] text-red-600">{errors.currency_code}</div>}
                                        </div>

                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Currency Symbol</div>
                                            <input
                                                value={data.currency_symbol}
                                                onChange={(e) => setData('currency_symbol', e.target.value)}
                                                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                                placeholder="$"
                                            />
                                            {errors.currency_symbol && <div className="mt-1 text-[12px] text-red-600">{errors.currency_symbol}</div>}
                                        </div>

                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Symbol Position</div>
                                            <select
                                                value={data.currency_symbol_position}
                                                onChange={(e) => setData('currency_symbol_position', e.target.value)}
                                                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                            >
                                                <option value="before">Before amount ($ 10)</option>
                                                <option value="after">After amount (10 $)</option>
                                            </select>
                                            {errors.currency_symbol_position && (
                                                <div className="mt-1 text-[12px] text-red-600">{errors.currency_symbol_position}</div>
                                            )}
                                        </div>

                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Decimals</div>
                                            <input
                                                type="number"
                                                min={0}
                                                max={6}
                                                value={data.currency_decimals}
                                                onChange={(e) => setData('currency_decimals', Number(e.target.value))}
                                                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                            />
                                            {errors.currency_decimals && <div className="mt-1 text-[12px] text-red-600">{errors.currency_decimals}</div>}
                                        </div>

                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Decimal Separator</div>
                                            <input
                                                value={data.currency_decimal_separator}
                                                onChange={(e) => setData('currency_decimal_separator', e.target.value)}
                                                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                                placeholder="."
                                            />
                                            {errors.currency_decimal_separator && (
                                                <div className="mt-1 text-[12px] text-red-600">{errors.currency_decimal_separator}</div>
                                            )}
                                        </div>

                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Thousand Separator</div>
                                            <input
                                                value={data.currency_thousand_separator}
                                                onChange={(e) => setData('currency_thousand_separator', e.target.value)}
                                                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                                placeholder="," 
                                            />
                                            {errors.currency_thousand_separator && (
                                                <div className="mt-1 text-[12px] text-red-600">{errors.currency_thousand_separator}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 text-[12px] text-slate-600">
                                        Preview:{' '}
                                        <span className="font-semibold text-slate-900">
                                            {data.currency_symbol_position === 'before'
                                                ? `${data.currency_symbol} 1${data.currency_thousand_separator}234${data.currency_decimal_separator}${String(
                                                      0,
                                                  ).padEnd(Number(data.currency_decimals) || 0, '0')}`
                                                : `1${data.currency_thousand_separator}234${data.currency_decimal_separator}${String(
                                                      0,
                                                  ).padEnd(Number(data.currency_decimals) || 0, '0')} ${data.currency_symbol}`}
                                        </span>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                ) : active === 'payment_credentials' ? (
                    <PaymentCredentials
                        data={data}
                        setData={setData}
                        submit={submitPaymentSettings}
                        processing={processing}
                        errors={errors}
                    />
                ) : active === 'finance_settings' ? (
                    <FinanceSettings />
                ) : active === 'superadmin_role_permissions' ? (
                    <SuperadminRolePermissions />
                ) : active === 'storage_settings' ? (
                    <StorageSettings
                        stats={storageStats}
                        data={data}
                        setData={setData}
                        submit={submitStorageSettings}
                        processing={processing}
                        errors={errors}
                    />
                ) : active === 'social_login_settings' ? (
                    <SocialLoginSettings
                        data={data}
                        setData={setData}
                        submit={submitSocialLoginSettings}
                        processing={processing}
                        errors={errors}
                    />
                ) : active === 'security_settings' ? (
                    <SecuritySettings />
                ) : active === 'google_calendar_settings' ? (
                    <GoogleCalendarSettings
                        data={data}
                        setData={setData}
                        submit={submitGoogleCalendarSettings}
                        processing={processing}
                        errors={errors}
                        googleCalendarSettings={googleCalendarSettings}
                    />
                ) : active === 'theme_settings' ? (
                    <ThemeSettings
                        data={data}
                        setData={setData}
                        submit={submitThemeSettings}
                        processing={processing}
                        errors={errors}
                    />
                ) : active === 'module_settings' ? (
                    <ModuleSettings
                        data={data}
                        setData={setData}
                        submit={submitModuleSettings}
                        processing={processing}
                        errors={errors}
                        moduleSettings={moduleSettings}
                    />
                ) : active === 'rest_api_setting' ? (
                    <RestApiSetting />
                ) : active === 'database_backup_settings' ? (
                    <DatabaseBackupSettings />
                ) : active === 'update_app' ? (
                    <UpdateApp />
                ) : (
                    <div className="p-6">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-[12px] text-slate-600">
                            This section is a placeholder. We will build the full settings UI for{' '}
                            <span className="font-semibold text-slate-900">
                                {activeLabel}
                            </span>{' '}
                            next.
                        </div>
                    </div>
                )}
            </AdminPanelLayout>
        </>
    );
}
