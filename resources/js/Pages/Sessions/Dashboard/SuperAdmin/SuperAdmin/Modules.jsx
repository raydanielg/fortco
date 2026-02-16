import AdminPanelLayout from '@/Layouts/AdminPanelLayout';
import { Head } from '@inertiajs/react';

export default function Modules() {
    const items = [
        { key: 'system-audit', label: 'System Audit', href: route('admin.super-admin.system-audit') },
        { key: 'modules', label: 'Modules', href: route('admin.super-admin.modules') },
        { key: 'impersonate', label: 'Impersonate', href: route('admin.super-admin.impersonate') },
        { key: 'maintenance', label: 'Maintenance', href: route('admin.super-admin.maintenance') },
    ];

    return (
        <>
            <Head title="Super Admin - Modules" />
            <AdminPanelLayout title="Super Admin" active="modules" items={items}>
                <div className="border-b border-slate-200 px-6 py-4">
                    <div className="text-sm font-semibold text-slate-900">Modules</div>
                    <div className="mt-1 text-[12px] text-slate-500">This section is a placeholder. We will add content later.</div>
                </div>
                <div className="p-6">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-[12px] text-slate-600">This page is a placeholder.</div>
                </div>
            </AdminPanelLayout>
        </>
    );
}
