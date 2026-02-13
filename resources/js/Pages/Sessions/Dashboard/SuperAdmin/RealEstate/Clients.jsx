import RealEstatePanelLayout from '@/Layouts/RealEstatePanelLayout';
import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

export default function Clients() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [query, setQuery] = useState('');
    const [clients, setClients] = useState([]);

    const readJson = async (r) => {
        const text = await r.text();
        try {
            return text ? JSON.parse(text) : {};
        } catch (e) {
            return {};
        }
    };

    const navItems = useMemo(
        () => [
            { key: 'properties', label: 'Properties', href: route('admin.real-estate.properties') },
            { key: 'bookings', label: 'Bookings', href: route('admin.real-estate.bookings') },
            { key: 'clients', label: 'Clients', href: route('admin.real-estate.clients') },
        ],
        []
    );

    const fetchClients = () => {
        setLoading(true);
        setError('');
        const url = new URL(route('admin.real-estate.clients.data'));
        if (query.trim()) url.searchParams.set('q', query.trim());

        fetch(url.toString(), {
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to load clients');
                setClients(Array.isArray(json?.clients) ? json.clients : []);
            })
            .catch((e) => setError(e?.message || 'Failed to load clients'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchClients();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <RealEstatePanelLayout
            title="Real Estate"
            active="clients"
            items={navItems}
        >
            <Head title="Real Estate - Clients" />

            <div className="border-b border-slate-200 px-6 py-4">
                <div className="text-sm font-semibold text-slate-900">Clients</div>
                <div className="mt-1 text-[12px] text-slate-500">People who have made booking requests.</div>
            </div>

            <div className="p-6">
                {error ? (
                    <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[12px] text-rose-700">{error}</div>
                ) : null}

                <div className="mb-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-[12px] font-semibold text-slate-900">All clients</div>

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
                                    placeholder="Search name, phone, email"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={fetchClients}
                                disabled={loading}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {loading
                        ? Array.from({ length: 6 }).map((_, i) => (
                              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
                                  <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-slate-100" />
                                  <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-100" />
                                  <div className="mt-6 h-9 w-24 animate-pulse rounded-xl bg-slate-100" />
                              </div>
                          ))
                        : clients.length
                          ? clients.map((c) => (
                                <div key={c.client_key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <div className="text-[12px] font-semibold text-slate-900 line-clamp-1">{c.full_name || 'Client'}</div>
                                    <div className="mt-2 text-[12px] text-slate-600">
                                        <div className="line-clamp-1">{c.phone_number || '-'}</div>
                                        <div className="line-clamp-1">{c.email || '-'}</div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                                        <div className="text-[11px] font-semibold text-slate-600">Total requests</div>
                                        <div className="text-[12px] font-semibold text-slate-900">{c.bookings_count ?? 0}</div>
                                    </div>

                                    <div className="mt-3 text-[11px] font-semibold text-slate-500">
                                        Last booking: {c.last_booking_at ? new Date(c.last_booking_at).toLocaleString() : '-'}
                                    </div>

                                    <div className="mt-5 flex items-center justify-end">
                                        <Link
                                            href={route('admin.real-estate.clients.show', c.client_key)}
                                            className="rounded-xl bg-slate-900 px-4 py-2 text-[12px] font-semibold text-white hover:bg-slate-800"
                                        >
                                            View
                                        </Link>
                                    </div>
                                </div>
                            ))
                          : (
                                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-[12px] text-slate-600 shadow-sm sm:col-span-2 xl:col-span-3">
                                    No clients found
                                </div>
                            )}
                </div>
            </div>
        </RealEstatePanelLayout>
    );
}
