import AdminPanelLayout from '@/Layouts/AdminPanelLayout';
import { Head } from '@inertiajs/react';

export default function Companies() {
    const items = [
        { key: 'companies', label: 'Companies', href: route('admin.loans.companies') },
        { key: 'applications', label: 'Applications', href: route('admin.loans.applications') },
        { key: 'repayments', label: 'Repayments', href: route('admin.loans.repayments') },
    ];

    return (
        <>
            <Head title="Loans - Companies" />
            <AdminPanelLayout title="Loans" active="companies" items={items}>
                <div className="border-b border-slate-200 px-6 py-4">
                    <div className="text-sm font-semibold text-slate-900">Companies</div>
                    <div className="mt-1 text-[12px] text-slate-500">This section is a placeholder. We will add content later.</div>
                </div>
                <div className="p-6">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-[12px] text-slate-600">This page is a placeholder.</div>
                </div>
            </AdminPanelLayout>
        </>
    );
}
