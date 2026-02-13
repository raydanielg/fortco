import RealEstatePanelLayout from '@/Layouts/RealEstatePanelLayout';
import { Head, Link } from '@inertiajs/react';
import { useMemo } from 'react';

export default function BookingView({ booking }) {
    const items = useMemo(
        () => [
            { key: 'properties', label: 'Properties', href: route('admin.real-estate.properties') },
            { key: 'bookings', label: 'Bookings', href: route('admin.real-estate.bookings') },
            { key: 'clients', label: 'Clients', href: route('admin.real-estate.clients') },
        ],
        []
    );

    const b = booking || {};
    const p = b.property || null;

    const parseAmount = (value) => {
        const s = String(value || '');
        const match = s.match(/([0-9][0-9,\.]*)/);
        if (!match) return 0;
        const n = Number(String(match[1]).replace(/,/g, ''));
        return Number.isFinite(n) ? n : 0;
    };

    const amount = parseAmount(p?.price || '');
    const money = (n) => `TZS ${Number(n || 0).toLocaleString()}`;

    return (
        <RealEstatePanelLayout title="Real Estate" active="bookings" items={items}>
            <Head title="Real Estate - Booking" />

            <div className="border-b border-slate-200 px-6 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <div className="text-sm font-semibold text-slate-900">Booking details</div>
                        <div className="mt-1 text-[12px] text-slate-500">Request #{b.id}</div>
                    </div>

                    <Link
                        href={route('admin.real-estate.bookings')}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-900 hover:bg-slate-50"
                    >
                        Back to bookings
                    </Link>
                </div>
            </div>

            <div className="p-6">
                <div className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="text-[12px] font-semibold text-slate-900">Request details</div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <div>
                                <div className="text-[11px] font-semibold text-slate-500">Customer</div>
                                <div className="mt-1 text-[12px] font-semibold text-slate-900">{b.full_name || '-'}</div>
                            </div>
                            <div>
                                <div className="text-[11px] font-semibold text-slate-500">Phone</div>
                                <div className="mt-1 text-[12px] font-semibold text-slate-900">{b.phone_number || '-'}</div>
                            </div>
                            <div>
                                <div className="text-[11px] font-semibold text-slate-500">Email</div>
                                <div className="mt-1 text-[12px] font-semibold text-slate-900">{b.email || '-'}</div>
                            </div>
                            <div>
                                <div className="text-[11px] font-semibold text-slate-500">Status</div>
                                <div className="mt-1 inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[12px] font-semibold text-slate-700">
                                    {String(b.status || 'ongoing')}
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <div className="text-[11px] font-semibold text-slate-500">Received</div>
                                <div className="mt-1 text-[12px] font-semibold text-slate-900">
                                    {b.created_at ? new Date(b.created_at).toLocaleString() : '-'}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 border-t border-slate-200 pt-6">
                            <div className="text-[12px] font-semibold text-slate-900">Property</div>

                            {p ? (
                                <div className="mt-3 flex flex-col gap-4 sm:flex-row">
                                    <div className="h-36 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 sm:h-28 sm:w-44">
                                        {p.image ? <img src={p.image} alt="" className="h-full w-full object-cover" /> : null}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-sm font-semibold text-slate-900">{p.title}</div>
                                        <div className="mt-1 text-[12px] text-slate-600">{p.location || '-'}</div>
                                        <div className="mt-2 text-[12px] font-semibold text-slate-900">{p.price || '-'}</div>
                                        <div className="mt-2 text-[12px] text-slate-500">{p.type ? `${p.type} · ` : ''}{p.status || ''}</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-[12px] text-slate-600">
                                    Property details not available.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="text-[12px] font-semibold text-slate-900">Invoice</div>
                        <div className="mt-1 text-[12px] text-slate-500">Summary for this request.</div>

                        <div className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="text-[11px] font-semibold text-slate-500">Invoice No.</div>
                                    <div className="mt-1 text-[12px] font-semibold text-slate-900">INV-{String(b.id || '').padStart(6, '0')}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[11px] font-semibold text-slate-500">Date</div>
                                    <div className="mt-1 text-[12px] font-semibold text-slate-900">
                                        {b.created_at ? new Date(b.created_at).toLocaleDateString() : '-'}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 border-t border-slate-200 pt-4">
                                <div className="flex items-center justify-between text-[12px]">
                                    <span className="font-semibold text-slate-600">Service</span>
                                    <span className="font-semibold text-slate-900">Property viewing request</span>
                                </div>
                                <div className="mt-2 flex items-center justify-between text-[12px]">
                                    <span className="font-semibold text-slate-600">Amount</span>
                                    <span className="font-semibold text-slate-900">{money(amount)}</span>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between rounded-xl bg-white px-3 py-2">
                                <span className="text-[12px] font-semibold text-slate-600">Total</span>
                                <span className="text-[12px] font-semibold text-slate-900">{money(amount)}</span>
                            </div>
                        </div>

                        <Link
                            href={route('admin.real-estate.bookings.invoice', b.id)}
                            className="mt-4 block w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-center text-[12px] font-semibold text-slate-900 hover:bg-slate-50"
                        >
                            Open invoice
                        </Link>
                    </div>
                </div>
            </div>
        </RealEstatePanelLayout>
    );
}
