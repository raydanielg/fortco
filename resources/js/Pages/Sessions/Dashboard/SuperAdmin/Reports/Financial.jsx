import AdminPanelLayout from '@/Layouts/AdminPanelLayout';
import { Head, usePage } from '@inertiajs/react';

export default function Financial() {
    const page = usePage();
    const url = page.url || '';

    const items = [
        { key: 'financial', label: 'Financial', href: route('admin.reports.financial') },
        { key: 'projects', label: 'Projects', href: route('admin.reports.projects') },
        { key: 'export', label: 'Export', href: route('admin.reports.export') },
    ];

    const active = items.find((i) => url.includes(`/admin/reports/${i.key}`))?.key || 'financial';
    const activeLabel = items.find((i) => i.key === active)?.label || 'Financial';

    return (
        <>
            <Head title={activeLabel} />
            <AdminPanelLayout title="Reports" active={active} items={items}>
                <div className="border-b border-slate-200 px-6 py-4">
                    <div className="text-sm font-semibold text-slate-900">{activeLabel}</div>
                    <div className="mt-1 text-[12px] text-slate-500">
                        This section is a placeholder. We will add content later.
                    </div>
                </div>

                <div className="p-6">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-[12px] text-slate-600">
                        This page is a placeholder.
                    </div>
                </div>
            </AdminPanelLayout>
        </>
    );
}
