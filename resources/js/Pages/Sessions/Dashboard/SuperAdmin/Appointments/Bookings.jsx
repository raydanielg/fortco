import AdminPanelLayout from '@/Layouts/AdminPanelLayout';
import { Head } from '@inertiajs/react';

export default function Bookings() {
    const items = [
        { key: 'calendar', label: 'Calendar', href: route('admin.appointments.calendar') },
        { key: 'bookings', label: 'Bookings', href: route('admin.appointments.bookings') },
        { key: 'services', label: 'Services', href: route('admin.appointments.services') },
    ];

    return (
        <>
            <Head title="Appointments - Bookings" />
            <AdminPanelLayout title="Appointments" active="bookings" items={items}>
                <div className="border-b border-slate-200 px-6 py-4">
                    <div className="text-sm font-semibold text-slate-900">Bookings</div>
                    <div className="mt-1 text-[12px] text-slate-500">This section is a placeholder. We will add content later.</div>
                </div>
                <div className="p-6">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-[12px] text-slate-600">This page is a placeholder.</div>
                </div>
            </AdminPanelLayout>
        </>
    );
}
