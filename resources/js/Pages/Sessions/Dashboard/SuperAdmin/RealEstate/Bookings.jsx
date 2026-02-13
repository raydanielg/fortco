import RealEstatePanelLayout from '@/Layouts/RealEstatePanelLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

export default function Bookings() {
    const [tab, setTab] = useState('requests');
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [query, setQuery] = useState('');
    const [bookings, setBookings] = useState([]);
    const [openMenu, setOpenMenu] = useState(null);

    const csrf = () => document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    const readJson = async (r) => {
        const text = await r.text();
        try {
            return text ? JSON.parse(text) : {};
        } catch (e) {
            return {};
        }
    };

    const openRowMenu = (e, booking) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = 176;
        const height = 140;
        const padding = 8;
        const left = Math.min(Math.max(padding, rect.right - width), window.innerWidth - width - padding);
        const preferDown = rect.bottom + padding + height <= window.innerHeight;
        const top = preferDown ? rect.bottom + padding : Math.max(padding, rect.top - height - padding);

        const next = { id: booking.id, top, left };
        setOpenMenu((curr) => (curr?.id === next.id ? null : next));
    };

    const updateStatus = (id, status) => {
        setBusy(true);
        setError('');
        fetch(route('admin.real-estate.bookings.status', id), {
            method: 'PUT',
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf(),
            },
            body: JSON.stringify({ status }),
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to update status');
                fetchBookings();
            })
            .catch((e) => setError(e?.message || 'Failed to update status'))
            .finally(() => setBusy(false));
    };

    const navItems = useMemo(
        () => [
            { key: 'properties', label: 'Properties', href: route('admin.real-estate.properties') },
            { key: 'bookings', label: 'Bookings', href: route('admin.real-estate.bookings') },
            { key: 'clients', label: 'Clients', href: route('admin.real-estate.clients') },
        ],
        []
    );

    const statusPill = (status) => {
        const s = String(status || 'ongoing');
        if (s === 'completed') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
        if (s === 'ongoing') return 'border-amber-200 bg-amber-50 text-amber-700';
        return 'border-slate-200 bg-slate-50 text-slate-700';
    };

    const statusDot = (status) => {
        const s = String(status || 'ongoing');
        if (s === 'completed') return 'bg-emerald-500';
        if (s === 'ongoing') return 'bg-amber-500 animate-pulse';
        return 'bg-slate-500';
    };

    const statusLabel = (status) => {
        const s = String(status || 'ongoing');
        return s.replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
    };

    const fetchBookings = () => {
        setLoading(true);
        setError('');
        const url = new URL(route('admin.real-estate.bookings.data'));
        if (query.trim()) url.searchParams.set('q', query.trim());
        url.searchParams.set('status', tab === 'completed' ? 'completed' : 'ongoing');

        fetch(url.toString(), {
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to load bookings');
                setBookings(Array.isArray(json?.bookings) ? json.bookings : []);
            })
            .catch((e) => setError(e?.message || 'Failed to load bookings'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchBookings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchBookings();
        setOpenMenu(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab]);

    useEffect(() => {
        const onScroll = () => setOpenMenu(null);
        const onResize = () => setOpenMenu(null);
        const onKeyDown = (e) => {
            if (e.key === 'Escape') setOpenMenu(null);
        };
        window.addEventListener('scroll', onScroll, true);
        window.addEventListener('resize', onResize);
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('scroll', onScroll, true);
            window.removeEventListener('resize', onResize);
            window.removeEventListener('keydown', onKeyDown);
        };
    }, []);

    const remove = (id) => {
        if (!confirm('Delete this booking?')) return;
        setBusy(true);
        setError('');
        fetch(route('admin.real-estate.bookings.destroy', id), {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json', 'X-CSRF-TOKEN': csrf() },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to delete booking');
                fetchBookings();
            })
            .catch((e) => setError(e?.message || 'Failed to delete booking'))
            .finally(() => setBusy(false));
    };

    return (
        <RealEstatePanelLayout
            title="Real Estate"
            active="bookings"
            items={navItems}
        >
            <Head title="Real Estate - Bookings" />

            <div className="border-b border-slate-200 px-6 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <div className="text-sm font-semibold text-slate-900">Bookings</div>
                        <div className="mt-1 text-[12px] text-slate-500">Track requests and mark them as completed.</div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setTab('requests')}
                            className={
                                'rounded-xl px-4 py-2 text-[12px] font-semibold ' +
                                (tab === 'requests'
                                    ? 'bg-slate-900 text-white'
                                    : 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50')
                            }
                        >
                            All Requests
                        </button>
                        <button
                            type="button"
                            onClick={() => setTab('completed')}
                            className={
                                'rounded-xl px-4 py-2 text-[12px] font-semibold ' +
                                (tab === 'completed'
                                    ? 'bg-slate-900 text-white'
                                    : 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50')
                            }
                        >
                            Completed Results
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {error ? (
                    <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[12px] text-rose-700">{error}</div>
                ) : null}

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
                        <div className="text-[12px] font-semibold text-slate-900">{tab === 'completed' ? 'Completed results' : 'All requests'}</div>
                        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                            <div className="relative w-full sm:w-96">
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
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 pl-9 text-[12px]"
                                    placeholder="Search property, customer, phone, status"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={fetchBookings}
                                disabled={loading}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
                            >
                                Search
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto bg-white">
                        <table className="min-w-full text-left text-[12px]">
                            <thead className="bg-white">
                                <tr className="border-b border-slate-200">
                                    <th className="px-4 py-3 font-semibold text-slate-700">Customer</th>
                                    <th className="px-4 py-3 font-semibold text-slate-700">Phone</th>
                                    <th className="px-4 py-3 font-semibold text-slate-700">Email</th>
                                    <th className="px-4 py-3 font-semibold text-slate-700">Property</th>
                                    <th className="px-4 py-3 font-semibold text-slate-700">Status</th>
                                    <th className="px-4 py-3 font-semibold text-slate-700">Received</th>
                                    <th className="w-16 px-4 py-3 font-semibold text-slate-700" />
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    Array.from({ length: 7 }).map((_, i) => (
                                        <tr key={i} className="border-b border-slate-100">
                                            <td className="px-4 py-3" colSpan={7}>
                                                <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                                            </td>
                                        </tr>
                                    ))
                                ) : bookings.length ? (
                                    bookings.map((b) => (
                                        <tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="px-4 py-3 font-semibold text-slate-900">{b.full_name}</td>
                                            <td className="px-4 py-3 text-slate-700">{b.phone_number}</td>
                                            <td className="px-4 py-3 text-slate-700">{b.email || '-'}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-11 w-16 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
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
                                                <span className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 font-semibold ${statusPill(b.status)}`}>
                                                    <span className={`h-2 w-2 rounded-full ${statusDot(b.status)}`} />
                                                    {statusLabel(b.status)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-700">
                                                {b.created_at ? new Date(b.created_at).toLocaleString() : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    type="button"
                                                    onClick={(e) => openRowMenu(e, b)}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
                                                >
                                                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M12 6.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM12 13.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM12 20.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
                                                        />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className="px-4 py-8 text-center text-slate-500" colSpan={7}>
                                            No bookings found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {openMenu ? (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setOpenMenu(null)} />
                        <div
                            className="fixed z-50 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
                            style={{ top: openMenu.top, left: openMenu.left }}
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    setOpenMenu(null);
                                    window.location.href = route('admin.real-estate.bookings.show', openMenu.id);
                                }}
                                className="block w-full px-4 py-2 text-left text-[12px] hover:bg-slate-50"
                            >
                                View
                            </button>
                            {tab === 'completed' ? (
                                <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() => {
                                        const id = openMenu.id;
                                        setOpenMenu(null);
                                        updateStatus(id, 'ongoing');
                                    }}
                                    className="block w-full px-4 py-2 text-left text-[12px] hover:bg-slate-50 disabled:opacity-60"
                                >
                                    Mark as Ongoing
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() => {
                                        const id = openMenu.id;
                                        setOpenMenu(null);
                                        updateStatus(id, 'completed');
                                    }}
                                    className="block w-full px-4 py-2 text-left text-[12px] hover:bg-slate-50 disabled:opacity-60"
                                >
                                    Mark as Completed
                                </button>
                            )}
                            <button
                                type="button"
                                disabled={busy}
                                onClick={() => {
                                    const id = openMenu.id;
                                    setOpenMenu(null);
                                    remove(id);
                                }}
                                className="block w-full px-4 py-2 text-left text-[12px] text-rose-700 hover:bg-rose-50 disabled:opacity-60"
                            >
                                Delete
                            </button>
                        </div>
                    </>
                ) : null}
            </div>
        </RealEstatePanelLayout>
    );
}
