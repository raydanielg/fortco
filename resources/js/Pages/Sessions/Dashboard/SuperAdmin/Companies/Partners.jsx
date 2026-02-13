import CompaniesPanelLayout from '@/Layouts/CompaniesPanelLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

export default function Partners() {
    const [tab, setTab] = useState('all');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');

    const [form, setForm] = useState({ name: '', logo: null });
    const [logoPreviewUrl, setLogoPreviewUrl] = useState('');

    const csrf = () => document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    const readJson = async (r) => {
        const text = await r.text();
        try {
            return text ? JSON.parse(text) : {};
        } catch (e) {
            return {};
        }
    };

    const items = useMemo(
        () => [
            { key: 'profile', label: 'Profile', href: route('admin.companies.profile') },
            { key: 'partners', label: 'Partners', href: route('admin.companies.partners') },
            { key: 'vendors', label: 'Vendors', href: route('admin.companies.vendors') },
        ],
        []
    );

    const fetchPartners = () => {
        setLoading(true);
        setError('');
        const url = route('admin.companies.partners.data') + (query.trim() ? `?q=${encodeURIComponent(query.trim())}` : '');
        fetch(url, {
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to load partners');
                setPartners(Array.isArray(json?.partners) ? json.partners : []);
            })
            .catch((e) => setError(e?.message || 'Failed to load partners'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchPartners();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!form.logo) {
            if (logoPreviewUrl) URL.revokeObjectURL(logoPreviewUrl);
            setLogoPreviewUrl('');
            return;
        }

        const url = URL.createObjectURL(form.logo);
        setLogoPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.logo]);

    const submit = () => {
        if (!form.name.trim()) {
            setError('Partner name is required');
            return;
        }
        if (!form.logo) {
            setError('Logo is required');
            return;
        }

        setBusy(true);
        setError('');

        const fd = new FormData();
        fd.append('name', form.name.trim());
        fd.append('logo', form.logo);

        fetch(route('admin.companies.partners.store'), {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf(),
                Accept: 'application/json',
            },
            body: fd,
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to register partner');
                setForm({ name: '', logo: null });
                setTab('all');
                fetchPartners();
            })
            .catch((e) => setError(e?.message || 'Failed to register partner'))
            .finally(() => setBusy(false));
    };

    const destroy = (p) => {
        if (!p?.id) return;
        if (!window.confirm(`Delete partner "${p.name}"?`)) return;
        setBusy(true);
        setError('');
        fetch(route('admin.companies.partners.destroy', { partner: p.id }), {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf(),
                Accept: 'application/json',
            },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Delete failed');
                fetchPartners();
            })
            .catch((e) => setError(e?.message || 'Delete failed'))
            .finally(() => setBusy(false));
    };

    const SkeletonRow = ({ i }) => (
        <tr key={i} className="animate-pulse">
            <td className="px-4 py-3"><div className="h-10 w-10 rounded-xl bg-slate-100" /></td>
            <td className="px-4 py-3"><div className="h-4 w-56 rounded bg-slate-100" /></td>
            <td className="px-4 py-3 text-right"><div className="ml-auto h-9 w-24 rounded-xl bg-slate-100" /></td>
        </tr>
    );

    return (
        <CompaniesPanelLayout
            title="Companies"
            active="partners"
            items={items}
        >
            <Head title="Companies - Partners" />

            <div className="border-b border-slate-200 px-6 py-4">
                <div className="text-sm font-semibold text-slate-900">Partners</div>
                <div className="mt-1 text-[12px] text-slate-500">Upload partner logos and manage the partner list.</div>

                <div className="mt-4 flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setTab('all')}
                        className={
                            'rounded-xl px-4 py-2 text-[12px] font-semibold transition ' +
                            (tab === 'all' ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50')
                        }
                    >
                        All partners
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab('register')}
                        className={
                            'rounded-xl px-4 py-2 text-[12px] font-semibold transition ' +
                            (tab === 'register'
                                ? 'bg-slate-900 text-white'
                                : 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50')
                        }
                    >
                        Register
                    </button>
                </div>
            </div>

            <div className="p-6">
                {error ? (
                    <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[12px] text-rose-700">{error}</div>
                ) : null}

                {tab === 'register' ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="text-sm font-semibold text-slate-900">Register partner</div>
                                <div className="mt-1 text-[12px] text-slate-600">Add partner name and upload a logo.</div>
                            </div>

                            <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] font-semibold text-slate-700 sm:flex">
                                <svg viewBox="0 0 24 24" className="h-5 w-5 animate-pulse" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
                                </svg>
                                Partner Logo
                            </div>
                        </div>

                        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr,320px]">
                            <div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <label className="text-[11px] font-semibold text-slate-700">
                                            Partner name <span className="text-rose-600">*</span>
                                        </label>
                                        <input
                                            value={form.name}
                                            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                            placeholder="e.g. Fortco Partners Ltd"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="text-[11px] font-semibold text-slate-700">
                                            Logo <span className="text-rose-600">*</span>
                                        </label>
                                        <div className="mt-1 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
                                                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-700" fill="none" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4-4 4 4 8-8" />
                                                    </svg>
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="truncate text-[12px] font-semibold text-slate-900">
                                                        {form.logo ? form.logo.name : 'Choose image file'}
                                                    </div>
                                                    <div className="mt-0.5 text-[11px] font-semibold text-slate-500">Max 4MB</div>
                                                </div>
                                            </div>

                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setForm((p) => ({ ...p, logo: e.target.files?.[0] || null }))}
                                                className="block w-full text-[12px] sm:w-[260px]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setTab('all')}
                                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-900 hover:bg-slate-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={submit}
                                        disabled={busy}
                                        className="rounded-xl bg-slate-900 px-5 py-2.5 text-[12px] font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
                                    >
                                        Save partner
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                                <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                                    <div className="text-[12px] font-semibold text-slate-900">Preview</div>
                                    <div className="mt-1 text-[11px] font-semibold text-slate-500">Preview your logo before saving.</div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6">
                                        {logoPreviewUrl ? (
                                            <img
                                                src={logoPreviewUrl}
                                                alt="Logo preview"
                                                className="max-h-44 w-auto rounded-xl bg-white p-3 shadow-sm"
                                            />
                                        ) : (
                                            <div className="text-center text-[12px] text-slate-500">No logo selected.</div>
                                        )}
                                    </div>
                                    <div className="mt-3 text-center text-[12px] font-semibold text-slate-700">{form.name || 'Partner name'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
                            <div className="text-[12px] font-semibold text-slate-900">All partners</div>
                            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                                <div className="relative w-full sm:w-72">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.3-4.3m1.8-4.7a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 pl-9 text-[12px]"
                                        placeholder="Search partner"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={fetchPartners}
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
                                        <th className="w-16 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Logo</th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Name</th>
                                        <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-600">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {loading ? (
                                        <>
                                            {Array.from({ length: 6 }).map((_, i) => (
                                                <SkeletonRow key={i} i={i} />
                                            ))}
                                        </>
                                    ) : !partners.length ? (
                                        <tr>
                                            <td colSpan={3} className="px-4 py-10 text-center text-[12px] text-slate-500">
                                                No partners found.
                                            </td>
                                        </tr>
                                    ) : (
                                        partners.map((p) => (
                                            <tr key={p.id} className="hover:bg-slate-50">
                                                <td className="px-4 py-3">
                                                    {p.logo_url ? (
                                                        <img src={p.logo_url} alt={p.name} className="h-10 w-10 rounded-xl border border-slate-200 bg-white object-contain p-1" />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-xl border border-slate-200 bg-slate-50" />
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-[12px] font-semibold text-slate-900">{p.name}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => destroy(p)}
                                                        disabled={busy}
                                                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </CompaniesPanelLayout>
    );
}
