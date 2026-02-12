import AdminPanelLayout from '@/Layouts/AdminPanelLayout';
import { Head, usePage } from '@inertiajs/react';

export default function Index() {
    const page = usePage();
    const url = page.url || '';
    const tabMatch = url.match(/[?&]tab=([^&]+)/);
    const tab = tabMatch ? decodeURIComponent(tabMatch[1]) : 'app_settings';

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

    return (
        <>
            <Head title={activeLabel} />
            <AdminPanelLayout
                title="App Settings"
                active={active}
                items={items}
            >
                <div className="border-b border-slate-200 px-6 py-4">
                    <div className="text-sm font-semibold text-slate-900">
                        {activeLabel}
                    </div>
                    <div className="mt-1 text-[12px] text-slate-500">
                        Configure system defaults and preferences.
                    </div>
                </div>

                <div className="p-6">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-[12px] text-slate-600">
                        This section is a placeholder. We will build the full settings UI for <span className="font-semibold text-slate-900">{activeLabel}</span> next.
                    </div>
                </div>
            </AdminPanelLayout>
        </>
    );
}
