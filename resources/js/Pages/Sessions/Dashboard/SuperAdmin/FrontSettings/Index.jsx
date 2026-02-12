import AdminPanelLayout from '@/Layouts/AdminPanelLayout';
import { Head } from '@inertiajs/react';

export default function Index() {
    const items = [
        { key: 'header_footer', label: 'Header/Footer', href: route('admin.front-settings') },
        { key: 'theme', label: 'Theme', href: '#' },
        { key: 'seo', label: 'SEO', href: '#' },
        { key: 'social', label: 'Social Media', href: '#' },
    ];

    return (
        <>
            <Head title="Front Settings" />
            <AdminPanelLayout
                title="Front Settings"
                active="header_footer"
                items={items}
            >
                <div className="border-b border-slate-200 px-6 py-4">
                    <div className="text-sm font-semibold text-slate-900">
                        Front Settings
                    </div>
                    <div className="mt-1 text-[12px] text-slate-500">
                        Manage website header, footer, theme and SEO.
                    </div>
                </div>

                <div className="p-6">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-[12px] text-slate-600">
                        This page is a placeholder. We will build the full front settings UI here next.
                    </div>
                </div>
            </AdminPanelLayout>
        </>
    );
}
