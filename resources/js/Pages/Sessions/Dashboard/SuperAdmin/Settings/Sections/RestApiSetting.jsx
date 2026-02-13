import SettingsSectionShell from './SettingsSectionShell';
import { CircleStackIcon, MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useEffect, useMemo, useState } from 'react';

export default function RestApiSetting() {
    const [query, setQuery] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [routes, setRoutes] = useState([]);

    const fetchInventory = () => {
        setBusy(true);
        setError('');
        fetch(route('admin.rest-api.inventory'), {
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                Accept: 'application/json',
            },
        })
            .then(async (r) => {
                const text = await r.text();
                let json = {};
                try {
                    json = text ? JSON.parse(text) : {};
                } catch (e) {
                    json = {};
                }
                if (!r.ok) throw new Error(json?.message || 'Failed to load inventory');
                setRoutes(Array.isArray(json?.routes) ? json.routes : []);
            })
            .catch((e) => setError(e?.message || 'Failed to load inventory'))
            .finally(() => setBusy(false));
    };

    useEffect(() => {
        fetchInventory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filtered = useMemo(() => {
        const q = String(query || '').trim().toLowerCase();
        if (!q) return routes;
        return routes.filter((r) => {
            const methods = Array.isArray(r.methods) ? r.methods.join(',') : '';
            return (
                String(r.uri || '').toLowerCase().includes(q) ||
                String(r.name || '').toLowerCase().includes(q) ||
                String(r.module || '').toLowerCase().includes(q) ||
                String(r.description || '').toLowerCase().includes(q) ||
                methods.toLowerCase().includes(q)
            );
        });
    }, [routes, query]);

    const grouped = useMemo(() => {
        const g = {};
        for (const r of filtered) {
            const key = r.module || 'Core';
            if (!g[key]) g[key] = [];
            g[key].push(r);
        }
        return Object.keys(g)
            .sort((a, b) => a.localeCompare(b))
            .map((k) => ({ module: k, routes: g[k] }));
    }, [filtered]);

    const MethodBadge = ({ m }) => {
        const mm = String(m || '').toUpperCase();
        const cls =
            mm === 'GET'
                ? 'bg-emerald-50 text-emerald-700'
                : mm === 'POST'
                  ? 'bg-blue-50 text-blue-700'
                  : mm === 'PUT' || mm === 'PATCH'
                    ? 'bg-amber-50 text-amber-700'
                    : mm === 'DELETE'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-slate-100 text-slate-700';

        return <span className={`rounded-md px-2 py-1 text-[10px] font-semibold ${cls}`}>{mm}</span>;
    };

    return (
        <SettingsSectionShell title="" description="">
            <div className="-m-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 bg-white">
                    <div className="flex flex-wrap items-center justify-between gap-3 px-6">
                        <div className="my-3 inline-flex items-center gap-2 text-[12px] font-semibold text-slate-900">
                            <CircleStackIcon className="h-5 w-5" />
                            REST API Inventory
                        </div>

                        <button
                            type="button"
                            onClick={fetchInventory}
                            className="my-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            <ArrowPathIcon className={`h-4 w-4 ${busy ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>
                </div>

                {error ? <div className="border-b border-slate-200 bg-red-50 px-6 py-3 text-[12px] text-red-700">{error}</div> : null}

                <div className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="relative w-full max-w-md">
                            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-[12px] text-slate-900 focus:border-slate-300 focus:outline-none"
                                placeholder="Search: module, uri, name, method…"
                            />
                        </div>
                        <div className="text-[12px] text-slate-500">{busy ? 'Loading…' : `${filtered.length} endpoints`}</div>
                    </div>

                    <div className="mt-4 grid gap-4">
                        {grouped.length ? (
                            grouped.map((g) => (
                                <div key={g.module} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                                    <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                                        <div className="text-[12px] font-semibold text-slate-900">{g.module}</div>
                                        <div className="mt-1 text-[12px] text-slate-500">{g.routes.length} endpoints</div>
                                    </div>

                                    <div className="divide-y divide-slate-200">
                                        {g.routes.map((r, idx) => (
                                            <div key={`${r.uri}-${idx}`} className="px-4 py-3">
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        {(r.methods || []).map((m) => (
                                                            <MethodBadge key={m} m={m} />
                                                        ))}
                                                        <div className="font-mono text-[11px] font-semibold text-slate-900 break-all">{r.uri}</div>
                                                    </div>
                                                    <div className="text-[11px] text-slate-500">{r.name || ''}</div>
                                                </div>

                                                <div className="mt-2 text-[12px] text-slate-600">{r.description || ''}</div>
                                                <div className="mt-2 text-[11px] text-slate-500 break-all">{r.action || ''}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-[12px] text-slate-600">
                                No API endpoints found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </SettingsSectionShell>
    );
}
