import CompaniesPanelLayout from '@/Layouts/CompaniesPanelLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

export default function Profile() {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [vendors, setVendors] = useState([]);
    const [menuVendorId, setMenuVendorId] = useState('');

    const items = useMemo(
        () => [
            { key: 'profile', label: 'Profile', href: route('admin.companies.profile') },
            { key: 'partners', label: 'Partners', href: route('admin.companies.partners') },
            { key: 'vendors', label: 'Vendors', href: route('admin.companies.vendors') },
        ],
        []
    );

    const readJson = async (r) => {
        const text = await r.text();
        try {
            return text ? JSON.parse(text) : {};
        } catch (e) {
            return {};
        }
    };

    const fetchCompanies = () => {
        setLoading(true);
        setError('');
        const qs = new URLSearchParams();
        qs.set('status', 'verified');
        if (query.trim()) qs.set('q', query.trim());
        const url = route('admin.companies.vendors.data') + `?${qs.toString()}`;
        fetch(url, {
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to load vendors');
                setVendors(Array.isArray(json?.vendors) ? json.vendors : []);
            })
            .catch((e) => setError(e?.message || 'Failed to load vendors'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchCompanies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const onDoc = () => setMenuVendorId('');
        document.addEventListener('click', onDoc);
        return () => document.removeEventListener('click', onDoc);
    }, []);

    const SkeletonRow = ({ i }) => (
        <tr key={i} className="animate-pulse">
            <td className="px-4 py-3"><div className="h-4 w-64 rounded bg-slate-100" /></td>
            <td className="px-4 py-3"><div className="h-4 w-40 rounded bg-slate-100" /></td>
            <td className="px-4 py-3"><div className="h-7 w-24 rounded-full bg-slate-100" /></td>
            <td className="px-4 py-3 text-right"><div className="ml-auto h-8 w-8 rounded-lg bg-slate-100" /></td>
        </tr>
    );

    return (
        <CompaniesPanelLayout
            title="Companies"
            active="profile"
            items={items}
        >
            <Head title="Companies - Profile" />

            <div className="border-b border-slate-200 px-6 py-4">
                <div className="text-sm font-semibold text-slate-900">Verified Vendors</div>
                <div className="mt-1 text-[12px] text-slate-500">List of vendors that are verified.</div>
            </div>

            <div className="p-6">
                {error ? (
                    <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[12px] text-rose-700">{error}</div>
                ) : null}

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
                        <div className="text-[12px] font-semibold text-slate-900">All verified vendors</div>
                        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                            <div className="relative w-full sm:w-80">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.3-4.3m1.8-4.7a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 pl-9 text-[12px]"
                                    placeholder="Search vendor or TIN"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={fetchCompanies}
                                disabled={loading}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
                            >
                                Search
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-white">
                                <tr>
                                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Vendor</th>
                                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">TIN</th>
                                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Status</th>
                                    <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-600">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {loading ? (
                                    <>
                                        {Array.from({ length: 7 }).map((_, i) => (
                                            <SkeletonRow key={i} i={i} />
                                        ))}
                                    </>
                                ) : !vendors.length ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-10 text-center text-[12px] text-slate-500">
                                            No verified vendors found.
                                        </td>
                                    </tr>
                                ) : (
                                    vendors.map((v) => (
                                        <tr key={v.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 text-[12px] font-semibold text-slate-900">{v.company_name}</td>
                                            <td className="px-4 py-3 text-[12px] text-slate-700">{v.tin_number}</td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">
                                                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                                    verified
                                                </span>
                                            </td>
                                            <td className="relative px-4 py-3 text-right">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setMenuVendorId((x) => (String(x) === String(v.id) ? '' : String(v.id)));
                                                    }}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
                                                    aria-label="Actions"
                                                >
                                                    <span className="text-lg leading-none">⋯</span>
                                                </button>

                                                {String(menuVendorId) === String(v.id) ? (
                                                    <div
                                                        className="absolute right-4 top-12 z-20 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setMenuVendorId('');
                                                                setBusy(true);
                                                                window.setTimeout(() => setBusy(false), 350);
                                                            }}
                                                            className="block w-full px-4 py-2 text-left text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                                                        >
                                                            Logs
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setMenuVendorId('');
                                                                alert('Coming soon');
                                                            }}
                                                            className="block w-full px-4 py-2 text-left text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                                                        >
                                                            Coming soon
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setMenuVendorId('');
                                                                alert('More');
                                                            }}
                                                            className="block w-full px-4 py-2 text-left text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                                                        >
                                                            More
                                                        </button>
                                                    </div>
                                                ) : null}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-4 py-3 text-[11px] text-slate-500">{busy ? 'Updating...' : `Showing ${vendors.length} vendor(s)`}</div>
                </div>
            </div>
        </CompaniesPanelLayout>
    );
}
