import CompaniesPanelLayout from '@/Layouts/CompaniesPanelLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

export default function Vendors() {
    const [tab, setTab] = useState('all');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const [registering, setRegistering] = useState(false);
    const [registerProgress, setRegisterProgress] = useState(0);
    const [registerStep, setRegisterStep] = useState('');
    const [registerComplete, setRegisterComplete] = useState(false);

    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');

    const [form, setForm] = useState({ company_name: '', tin_number: '', file: null });

    const [reviewOpen, setReviewOpen] = useState(false);
    const [reviewVendor, setReviewVendor] = useState(null);

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

    const statusPill = (status) => {
        const s = String(status || 'pending');
        if (s === 'verified') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
        if (s === 'rejected') return 'border-rose-200 bg-rose-50 text-rose-700';
        return 'border-slate-200 bg-slate-50 text-slate-700';
    };

    const statusDot = (status) => {
        const s = String(status || 'pending');
        if (s === 'verified') return 'bg-emerald-500';
        if (s === 'rejected') return 'bg-rose-500';
        return 'bg-amber-500 animate-pulse';
    };

    const fetchVendors = () => {
        setLoading(true);
        setError('');
        const url = route('admin.companies.vendors.data') + (query.trim() ? `?q=${encodeURIComponent(query.trim())}` : '');
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
        fetchVendors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submit = () => {
        if (!form.company_name.trim()) {
            setError('Company name is required');
            return;
        }
        if (!form.tin_number.trim()) {
            setError('TIN number is required');
            return;
        }
        if (!form.file) {
            setError('Verification document (PDF) is required');
            return;
        }
        if (String(form.file?.type || '') !== 'application/pdf') {
            setError('Upload must be PDF only');
            return;
        }

        setBusy(true);
        setRegistering(true);
        setRegisterComplete(false);
        setRegisterProgress(0);
        setRegisterStep('Preparing');
        setError('');

        const fd = new FormData();
        fd.append('company_name', form.company_name.trim());
        fd.append('tin_number', form.tin_number.trim());
        fd.append('verification_document', form.file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', route('admin.companies.vendors.store'), true);
        xhr.withCredentials = true;
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('X-CSRF-TOKEN', csrf());
        xhr.setRequestHeader('Accept', 'application/json');

        xhr.upload.onprogress = (evt) => {
            if (!evt.lengthComputable) return;
            const pct = Math.max(0, Math.min(100, Math.round((evt.loaded / evt.total) * 100)));
            setRegisterStep('Uploading PDF');
            setRegisterProgress(pct);
        };

        xhr.onload = () => {
            const ok = xhr.status >= 200 && xhr.status < 300;
            let json = {};
            try {
                json = xhr.responseText ? JSON.parse(xhr.responseText) : {};
            } catch (e) {
                json = {};
            }

            if (!ok) {
                setError(json?.message || 'Failed to register vendor');
                setBusy(false);
                setRegistering(false);
                return;
            }

            setRegisterStep('Finalizing');
            setRegisterProgress(100);
            setRegisterComplete(true);

            window.setTimeout(() => {
                setForm({ company_name: '', tin_number: '', file: null });
                setTab('all');
                fetchVendors();
                setBusy(false);
                setRegistering(false);
            }, 700);
        };

        xhr.onerror = () => {
            setError('Network error. Please try again.');
            setBusy(false);
            setRegistering(false);
        };

        xhr.send(fd);
    };

    const destroy = (vendor) => {
        if (!vendor?.id) return;
        if (!window.confirm(`Delete vendor "${vendor.company_name}"?`)) return;
        setBusy(true);
        setError('');
        fetch(route('admin.companies.vendors.destroy', { vendor: vendor.id }), {
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
                fetchVendors();
            })
            .catch((e) => setError(e?.message || 'Delete failed'))
            .finally(() => setBusy(false));
    };

    const openReview = (vendor) => {
        setError('');
        setReviewVendor(vendor);
        setReviewOpen(true);

        if (vendor?.has_document) {
            window.open(route('admin.companies.vendors.preview', { vendor: vendor.id }), '_blank', 'noopener,noreferrer');
        }
    };

    const closeReview = () => {
        setReviewOpen(false);
        setReviewVendor(null);
    };

    const updateStatus = (vendor, status) => {
        if (!vendor?.id) return;
        setBusy(true);
        setError('');
        fetch(route('admin.companies.vendors.status', { vendor: vendor.id }), {
            method: 'PUT',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf(),
                Accept: 'application/json',
            },
            body: JSON.stringify({ verification_status: status }),
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Update failed');
                fetchVendors();
            })
            .catch((e) => setError(e?.message || 'Update failed'))
            .finally(() => setBusy(false));
    };

    const SkeletonRow = ({ i }) => (
        <tr key={i} className="animate-pulse">
            <td className="px-4 py-3"><div className="h-4 w-56 rounded bg-slate-100" /></td>
            <td className="px-4 py-3"><div className="h-4 w-36 rounded bg-slate-100" /></td>
            <td className="px-4 py-3"><div className="h-7 w-28 rounded-full bg-slate-100" /></td>
            <td className="px-4 py-3"><div className="h-4 w-24 rounded bg-slate-100" /></td>
            <td className="px-4 py-3 text-right"><div className="ml-auto h-9 w-28 rounded-xl bg-slate-100" /></td>
        </tr>
    );

    return (
        <CompaniesPanelLayout
            title="Companies"
            active="vendors"
            items={items}
        >
            <Head title="Companies - Vendors" />

            <div className="border-b border-slate-200 px-6 py-4">
                <div className="text-sm font-semibold text-slate-900">Vendors</div>
                <div className="mt-1 text-[12px] text-slate-500">Register vendor companies with TIN + verification PDF.</div>

                <div className="mt-4 flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setTab('all')}
                        className={
                            'rounded-xl px-4 py-2 text-[12px] font-semibold transition ' +
                            (tab === 'all' ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50')
                        }
                    >
                        All vendors
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
                                <div className="text-sm font-semibold text-slate-900">Register vendor</div>
                                <div className="mt-1 text-[12px] text-slate-500">
                                    Upload a verification document. <span className="font-semibold text-slate-700">PDF only</span>.
                                </div>
                            </div>

                            <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] font-semibold text-slate-700 sm:flex">
                                <svg viewBox="0 0 24 24" className="h-5 w-5 animate-pulse" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
                                </svg>
                                Verification
                            </div>
                        </div>

                        {registering ? (
                            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                                <div className="flex items-center justify-between gap-3 px-4 py-3">
                                    <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-900">
                                        <span className={"h-2.5 w-2.5 rounded-full " + (registerComplete ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse')} />
                                        {registerComplete ? 'Complete' : 'Registering...'}
                                    </div>
                                    <div className="text-[12px] font-semibold text-slate-600">{registerProgress}%</div>
                                </div>
                                <div className="px-4 pb-4">
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-white">
                                        <div
                                            className={
                                                'h-full rounded-full transition-all duration-200 ' +
                                                (registerComplete ? 'bg-emerald-500' : 'bg-slate-900')
                                            }
                                            style={{ width: `${registerProgress}%` }}
                                        />
                                    </div>
                                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <span className={"h-2 w-2 rounded-full " + (registerProgress >= 1 ? 'bg-slate-900' : 'bg-slate-300')} />
                                            Preparing
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={"h-2 w-2 rounded-full " + (registerProgress > 1 && registerProgress < 100 ? 'bg-slate-900 animate-pulse' : registerProgress >= 100 ? 'bg-slate-900' : 'bg-slate-300')} />
                                            Uploading PDF
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={"h-2 w-2 rounded-full " + (registerComplete ? 'bg-emerald-500' : 'bg-slate-300')} />
                                            Finalizing
                                        </div>
                                    </div>
                                    <div className="mt-2 text-[11px] font-semibold text-slate-500">{registerStep || '...'}</div>
                                </div>
                            </div>
                        ) : null}

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            <div>
                                <label className="text-[11px] font-semibold text-slate-700">
                                    Company name <span className="text-rose-600">*</span>
                                </label>
                                <input
                                    value={form.company_name}
                                    onChange={(e) => setForm((p) => ({ ...p, company_name: e.target.value }))}
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                    placeholder="e.g. ABC Supplies Ltd"
                                />
                            </div>

                            <div>
                                <label className="text-[11px] font-semibold text-slate-700">
                                    TIN number <span className="text-rose-600">*</span>
                                </label>
                                <input
                                    value={form.tin_number}
                                    onChange={(e) => setForm((p) => ({ ...p, tin_number: e.target.value }))}
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                    placeholder="TIN"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="text-[11px] font-semibold text-slate-700">
                                    Verification document (PDF) <span className="text-rose-600">*</span>
                                </label>
                                <div className="mt-1 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
                                            <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-700" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 2v6h6" />
                                            </svg>
                                        </div>
                                        <div className="min-w-0">
                                            <div className="truncate text-[12px] font-semibold text-slate-900">
                                                {form.file ? form.file.name : 'Choose PDF file'}
                                            </div>
                                            <div className="mt-0.5 text-[11px] font-semibold text-slate-500">Max 8MB</div>
                                        </div>
                                    </div>

                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => setForm((p) => ({ ...p, file: e.target.files?.[0] || null }))}
                                        className="block w-full text-[12px] sm:w-[260px]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setTab('all')}
                                disabled={registering}
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
                                Register vendor
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
                            <div className="text-[12px] font-semibold text-slate-900">All vendors</div>
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
                                        placeholder="Search vendor or TIN"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={fetchVendors}
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
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Company</th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">TIN</th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Verification</th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">PDF</th>
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
                                    ) : !vendors.length ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-10 text-center text-[12px] text-slate-500">
                                                No vendors found.
                                            </td>
                                        </tr>
                                    ) : (
                                        vendors.map((v) => (
                                            <tr key={v.id} className="hover:bg-slate-50">
                                                <td className="px-4 py-3 text-[12px] font-semibold text-slate-900">{v.company_name}</td>
                                                <td className="px-4 py-3 text-[12px] text-slate-700">{v.tin_number}</td>
                                                <td className="px-4 py-3">
                                                    <div className={"inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold " + statusPill(v.verification_status)}>
                                                        <span className={"h-2 w-2 rounded-full " + statusDot(v.verification_status)} />
                                                        {v.verification_status}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {v.has_document ? (
                                                        <a
                                                            href={route('admin.companies.vendors.download', { vendor: v.id })}
                                                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-900 hover:bg-slate-50"
                                                        >
                                                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v12m0 0l4-4m-4 4l-4-4" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 17v3h16v-3" />
                                                            </svg>
                                                            Download
                                                        </a>
                                                    ) : (
                                                        <div className="text-[12px] text-slate-500">-</div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex flex-wrap items-center justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => openReview(v)}
                                                            disabled={busy}
                                                            className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12px] font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-60"
                                                            title="Review & verify"
                                                        >
                                                            Verify
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => openReview(v)}
                                                            disabled={busy}
                                                            className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[12px] font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                                                            title="Review & reject"
                                                        >
                                                            Reject
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => destroy(v)}
                                                            disabled={busy}
                                                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {reviewOpen && reviewVendor ? (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <button
                            type="button"
                            className="absolute inset-0 bg-slate-900/40"
                            onClick={closeReview}
                            aria-label="Close"
                        />

                        <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 px-5 py-4">
                                <div>
                                    <div className="text-sm font-semibold text-slate-900">Vendor verification</div>
                                    <div className="mt-1 text-[12px] text-slate-600">
                                        <span className="font-semibold text-slate-900">{reviewVendor.company_name}</span>
                                        <span className="mx-2 text-slate-300">•</span>
                                        TIN: {reviewVendor.tin_number}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className={"inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold " + statusPill(reviewVendor.verification_status)}>
                                        <span className={"h-2 w-2 rounded-full " + statusDot(reviewVendor.verification_status)} />
                                        {reviewVendor.verification_status}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={closeReview}
                                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-900 hover:bg-slate-50"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>

                            <div className="grid gap-0 lg:grid-cols-[1fr,320px]">
                                <div className="flex h-[70vh] items-center justify-center bg-slate-50 p-8">
                                    {reviewVendor.has_document ? (
                                        <div className="w-full max-w-md text-center">
                                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white">
                                                <svg viewBox="0 0 24 24" className="h-6 w-6 text-slate-900" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 2v6h6" />
                                                </svg>
                                            </div>
                                            <div className="mt-3 text-[12px] font-semibold text-slate-900">PDF opened in a new tab</div>
                                            <div className="mt-1 text-[12px] text-slate-600">If it didn't open, use the button below.</div>
                                            <div className="mt-4">
                                                <a
                                                    href={route('admin.companies.vendors.preview', { vendor: reviewVendor.id })}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-[12px] font-semibold text-white hover:bg-slate-800"
                                                >
                                                    Open PDF
                                                </a>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center text-[12px] text-slate-600">No PDF document uploaded.</div>
                                    )}
                                </div>

                                <div className="border-t border-slate-200 p-5 lg:border-l lg:border-t-0">
                                    <div className="text-[12px] font-semibold text-slate-900">Review actions</div>
                                    <div className="mt-1 text-[12px] text-slate-600">Confirm verification decision after reviewing the PDF.</div>

                                    <div className="mt-4 grid gap-2">
                                        <a
                                            href={route('admin.companies.vendors.preview', { vendor: reviewVendor.id })}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-900 hover:bg-slate-50"
                                        >
                                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 2v6h6" />
                                            </svg>
                                            Open PDF
                                        </a>
                                        <a
                                            href={route('admin.companies.vendors.download', { vendor: reviewVendor.id })}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-900 hover:bg-slate-50"
                                        >
                                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v12m0 0l4-4m-4 4l-4-4" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 17v3h16v-3" />
                                            </svg>
                                            Download PDF
                                        </a>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                updateStatus(reviewVendor, 'verified');
                                                closeReview();
                                            }}
                                            disabled={busy || !reviewVendor.has_document}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-[12px] font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-60"
                                        >
                                            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                                            Verify vendor
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                updateStatus(reviewVendor, 'rejected');
                                                closeReview();
                                            }}
                                            disabled={busy || !reviewVendor.has_document}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-[12px] font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                                        >
                                            <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
                                            Reject vendor
                                        </button>

                                        {!reviewVendor.has_document ? (
                                            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] text-amber-800">
                                                Cannot verify/reject without PDF.
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </CompaniesPanelLayout>
    );
}
