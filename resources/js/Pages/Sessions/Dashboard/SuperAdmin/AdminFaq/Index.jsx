import AdminPanelLayout from '@/Layouts/AdminPanelLayout';
import { Head } from '@inertiajs/react';

export default function Index() {
    const items = [
        { key: 'manual', label: 'User Manual', href: route('admin.faq') },
        { key: 'tutorials', label: 'Tutorials', href: '#' },
        { key: 'support', label: 'Support', href: '#' },
    ];

    return (
        <>
            <Head title="Admin FAQ" />
            <AdminPanelLayout title="Admin FAQ" active="manual" items={items}>
                <div className="border-b border-slate-200 px-6 py-4">
                    <div className="text-sm font-semibold text-slate-900">
                        Admin FAQ
                    </div>
                    <div className="mt-1 text-[12px] text-slate-500">
                        Documentation and help for administrators.
                    </div>
                </div>

                <div className="p-6">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-[12px] text-slate-600">
                        This page is a placeholder. We will build the full admin FAQ here next.
                    </div>
                </div>
            </AdminPanelLayout>
        </>
    );
}
