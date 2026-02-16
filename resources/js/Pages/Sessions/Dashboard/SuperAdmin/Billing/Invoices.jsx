import AdminPanelLayout from '@/Layouts/AdminPanelLayout';
import { Head } from '@inertiajs/react';

export default function Invoices() {
    const items = [
        { key: 'invoices', label: 'Invoices', href: route('admin.billing.invoices') },
        { key: 'transactions', label: 'Transactions', href: route('admin.billing.transactions') },
        { key: 'gateways', label: 'Gateways', href: route('admin.billing.gateways') },
    ];

    return (
        <>
            <Head title="Billing - Invoices" />
            <AdminPanelLayout title="Billing" active="invoices" items={items}>
                <div className="border-b border-slate-200 px-6 py-4">
                    <div className="text-sm font-semibold text-slate-900">Invoices</div>
                    <div className="mt-1 text-[12px] text-slate-500">This section is a placeholder. We will add content later.</div>
                </div>
                <div className="p-6">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-[12px] text-slate-600">This page is a placeholder.</div>
                </div>
            </AdminPanelLayout>
        </>
    );
}
