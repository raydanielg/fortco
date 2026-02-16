import AdminPanelLayout from '@/Layouts/AdminPanelLayout';
import { Head } from '@inertiajs/react';

export default function Approved() {
    const items = [
        { key: 'pending', label: 'Pending', href: route('admin.offline-request.pending') },
        { key: 'approved', label: 'Approved', href: route('admin.offline-request.approved') },
        { key: 'rejected', label: 'Rejected', href: route('admin.offline-request.rejected') },
    ];

    return (
        <>
            <Head title="Offline Request - Approved" />
            <AdminPanelLayout title="Offline Request" active="approved" items={items}>
                <div className="border-b border-slate-200 px-6 py-4">
                    <div className="text-sm font-semibold text-slate-900">Approved</div>
                    <div className="mt-1 text-[12px] text-slate-500">This section is a placeholder. We will add content later.</div>
                </div>
                <div className="p-6">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-[12px] text-slate-600">This page is a placeholder.</div>
                </div>
            </AdminPanelLayout>
        </>
    );
}
