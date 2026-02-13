import RealEstatePanelLayout from '@/Layouts/RealEstatePanelLayout';
import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function ClientView({ client, bookings: serverBookings = [] }) {
    const items = useMemo(
        () => [
            { key: 'properties', label: 'Properties', href: route('admin.real-estate.properties') },
            { key: 'bookings', label: 'Bookings', href: route('admin.real-estate.bookings') },
            { key: 'clients', label: 'Clients', href: route('admin.real-estate.clients') },
        ],
        []
    );

    const [q, setQ] = useState('');

    const bookings = useMemo(() => {
        const list = Array.isArray(serverBookings) ? serverBookings : [];
        const qq = q.trim().toLowerCase();
        if (!qq) return list;
        return list.filter((b) => {
            const title = b?.property?.title || b?.property_title || '';
            const location = b?.property?.location || '';
            const phone = b?.phone_number || '';
            const email = b?.email || '';
            const status = b?.status || '';
            return `${title} ${location} ${phone} ${email} ${status}`.toLowerCase().includes(qq);
        });
    }, [serverBookings, q]);

    return (
        <RealEstatePanelLayout title="Real Estate" active="clients" items={items}>
            <Head title="Real Estate - Client" />

            <div className="border-b border-slate-200 px-6 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <div className="text-sm font-semibold text-slate-900">Client details</div>
                        <div className="mt-1 text-[12px] text-slate-500">Booking history and requested properties.</div>
                    </div>

                    <Link
                        href={route('admin.real-estate.clients')}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-900 hover:bg-slate-50"
                    >
                        Back to clients
                    </Link>
                </div>
            </div>

            <div className="p-6">
                <div className="grid gap-4 lg:grid-cols-[1fr,360px]">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                            <div className="text-[12px] font-semibold text-slate-900">All bookings</div>
                        </div>

                        <div className="px-4 py-3">
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M21 21l-4.3-4.3m1.8-4.7a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 pl-9 text-[12px]"
                                    placeholder="Search bookings"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-[12px]">
                                <thead className="bg-white">
                                    <tr className="border-b border-slate-200">
                                        <th className="px-4 py-3 font-semibold text-slate-700">Property</th>
                                        <th className="px-4 py-3 font-semibold text-slate-700">Status</th>
                                        <th className="px-4 py-3 font-semibold text-slate-700">Date & time</th>
                                        <th className="w-28 px-4 py-3 font-semibold text-slate-700" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.length ? (
                                        bookings.map((b) => (
                                            <tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-14 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                                                            {b.property?.image ? (
                                                                <img src={b.property.image} alt="" className="h-full w-full object-cover" />
                                                            ) : null}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="font-semibold text-slate-900 line-clamp-1">
                                                                {b.property?.title || b.property_title || '-'}
                                                            </div>
                                                            <div className="text-[11px] font-semibold text-slate-500 line-clamp-1">
                                                                {(b.property?.location || '') + (b.property?.price ? ` · ${b.property.price}` : '')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 font-semibold text-slate-700">
                                                        {String(b.status || 'ongoing')}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-slate-700">
                                                    {b.created_at ? new Date(b.created_at).toLocaleString() : '-'}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <Link
                                                        href={route('admin.real-estate.bookings.show', b.id)}
                                                        className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-900 hover:bg-slate-50"
                                                    >
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td className="px-4 py-8 text-center text-slate-500" colSpan={4}>
                                                No bookings found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="text-[12px] font-semibold text-slate-900">Client</div>
                        <div className="mt-4 grid gap-3">
                            <div>
                                <div className="text-[11px] font-semibold text-slate-500">Full name</div>
                                <div className="mt-1 text-[12px] font-semibold text-slate-900">{client?.full_name || '-'}</div>
                            </div>
                            <div>
                                <div className="text-[11px] font-semibold text-slate-500">Phone</div>
                                <div className="mt-1 text-[12px] font-semibold text-slate-900">{client?.phone_number || '-'}</div>
                            </div>
                            <div>
                                <div className="text-[11px] font-semibold text-slate-500">Email</div>
                                <div className="mt-1 text-[12px] font-semibold text-slate-900">{client?.email || '-'}</div>
                            </div>
                            <div>
                                <div className="text-[11px] font-semibold text-slate-500">Total requests</div>
                                <div className="mt-1 text-[12px] font-semibold text-slate-900">{client?.bookings_count ?? 0}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </RealEstatePanelLayout>
    );
}
