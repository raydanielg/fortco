import AdminPanelLayout from '@/Layouts/AdminPanelLayout';
import { Head } from '@inertiajs/react';

export default function Subscriptions() {
    const items = [
        { key: 'subscriptions', label: 'Subscriptions', href: route('admin.packages.subscriptions') },
        { key: 'features', label: 'Features', href: route('admin.packages.features') },
        { key: 'pricing', label: 'Pricing', href: route('admin.packages.pricing') },
    ];

    return (
        <>
            <Head title="Packages - Subscriptions" />
            <AdminPanelLayout title="Packages" active="subscriptions" items={items}>
                <div className="border-b border-slate-200 px-6 py-4">
                    <div className="text-sm font-semibold text-slate-900">Subscriptions</div>
                    <div className="mt-1 text-[12px] text-slate-500">This section is a placeholder. We will add content later.</div>
                </div>
                <div className="p-6">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-[12px] text-slate-600">This page is a placeholder.</div>
                </div>
            </AdminPanelLayout>
        </>
    );
}
