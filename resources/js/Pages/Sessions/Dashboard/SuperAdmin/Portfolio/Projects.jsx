import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

export default function Projects() {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [projects, setProjects] = useState([]);

    const [q, setQ] = useState('');
    const [type, setType] = useState('all');
    const [published, setPublished] = useState('all');

    const [selected, setSelected] = useState({});

    const [openAdd, setOpenAdd] = useState(false);
    const [form, setForm] = useState({
        type: 'featured',
        name: '',
        slug: '',
        location: '',
        year: '',
        category: '',
        value: '',
        expected: '',
        progress: '',
        desc: '',
        features: '',
        occupied_by: '',
        status_updates: '',
        testimonial: '',
        sort_order: 0,
        is_published: true,
    });

    const csrf = () => document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    const readJson = async (r) => {
        const text = await r.text();
        try {
            return text ? JSON.parse(text) : {};
        } catch (e) {
            return {};
        }
    };

    const queryString = useMemo(() => {
        const params = new URLSearchParams();
        if (q) params.set('q', q);
        if (type && type !== 'all') params.set('type', type);
        if (published && published !== 'all') params.set('published', published);
        const s = params.toString();
        return s ? `?${s}` : '';
    }, [q, type, published]);

    const fetchProjects = () => {
        setBusy(true);
        setError('');
        fetch(route('admin.portfolio-projects.data') + queryString, {
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to load portfolio projects');
                setProjects(Array.isArray(json?.projects) ? json.projects : []);
            })
            .catch((e) => setError(e?.message || 'Failed to load portfolio projects'))
            .finally(() => setBusy(false));
    };

    useEffect(() => {
        fetchProjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchProjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryString]);

    const selectedIds = useMemo(
        () => Object.keys(selected).filter((id) => selected[id]).map((id) => Number(id)).filter(Boolean),
        [selected]
    );

    const allChecked = useMemo(() => {
        if (!projects.length) return false;
        return projects.every((p) => selected[String(p.id)]);
    }, [projects, selected]);

    const toggleAll = (checked) => {
        const next = {};
        projects.forEach((p) => {
            next[String(p.id)] = checked;
        });
        setSelected(next);
    };

    const toggleOne = (id) => {
        setSelected((prev) => ({ ...prev, [String(id)]: !prev[String(id)] }));
    };

    const bulkDelete = () => {
        if (!selectedIds.length) return;
        if (!window.confirm(`Delete ${selectedIds.length} project(s)? This cannot be undone.`)) return;

        setBusy(true);
        setError('');
        fetch(route('admin.portfolio-projects.bulk-destroy'), {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf(),
                Accept: 'application/json',
            },
            body: JSON.stringify({ ids: selectedIds }),
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Bulk delete failed');
                setSelected({});
                fetchProjects();
            })
            .catch((e) => setError(e?.message || 'Bulk delete failed'))
            .finally(() => setBusy(false));
    };

    const exportExcel = () => {
        window.location.href = route('admin.portfolio-projects.export') + queryString;
    };

    const openAddModal = () => {
        setError('');
        setForm((prev) => ({
            ...prev,
            type: 'featured',
            name: '',
            slug: '',
            location: '',
            year: '',
            category: '',
            value: '',
            expected: '',
            progress: '',
            desc: '',
            features: '',
            occupied_by: '',
            status_updates: '',
            testimonial: '',
            sort_order: 0,
            is_published: true,
        }));
        setOpenAdd(true);
    };

    const submitAdd = () => {
        if (!form.name) {
            setError('Project name is required');
            return;
        }

        setBusy(true);
        setError('');

        fetch(route('admin.portfolio-projects.store'), {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf(),
                Accept: 'application/json',
            },
            body: JSON.stringify({
                ...form,
                year: form.year ? Number(form.year) : null,
                sort_order: Number(form.sort_order || 0),
            }),
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to create project');
                setOpenAdd(false);
                fetchProjects();
            })
            .catch((e) => setError(e?.message || 'Failed to create project'))
            .finally(() => setBusy(false));
    };

    const typeOptions = [
        { value: 'all', label: 'All types' },
        { value: 'featured', label: 'Featured' },
        { value: 'ongoing', label: 'Ongoing' },
    ];

    const publishedOptions = [
        { value: 'all', label: 'All' },
        { value: '1', label: 'Published' },
        { value: '0', label: 'Hidden' },
    ];

    return (
        <DashboardLayout title="Portfolio Projects" breadcrumbs={['Home', 'Portfolio', 'Projects']}>
            <Head title="Portfolio Projects" />

            <div className="grid gap-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="text-sm font-semibold text-slate-900">Portfolio projects</div>
                            <div className="mt-1 text-[12px] text-slate-600">
                                These projects power the public Portfolio page (Featured + Ongoing). Add/edit data here.
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                            <button
                                type="button"
                                onClick={openAddModal}
                                disabled={busy}
                                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-[12px] font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
                            >
                                Add project
                            </button>
                            <button
                                type="button"
                                onClick={exportExcel}
                                disabled={busy}
                                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-900 shadow-sm hover:bg-slate-50 disabled:opacity-60"
                            >
                                Export Excel
                            </button>
                        </div>
                    </div>

                    <div className="mt-5 grid gap-3 lg:grid-cols-12">
                        <div className="lg:col-span-5">
                            <label className="text-[11px] font-semibold text-slate-700">Search</label>
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Search name, slug, location..."
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                            />
                        </div>
                        <div className="lg:col-span-3">
                            <label className="text-[11px] font-semibold text-slate-700">Type</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                            >
                                {typeOptions.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="lg:col-span-2">
                            <label className="text-[11px] font-semibold text-slate-700">Published</label>
                            <select
                                value={published}
                                onChange={(e) => setPublished(e.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                            >
                                {publishedOptions.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="lg:col-span-2">
                            <label className="text-[11px] font-semibold text-slate-700">Bulk actions</label>
                            <button
                                type="button"
                                onClick={bulkDelete}
                                disabled={busy || !selectedIds.length}
                                className="mt-1 w-full rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[12px] font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                            >
                                Bulk delete ({selectedIds.length})
                            </button>
                        </div>
                    </div>

                    {error ? (
                        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[12px] text-rose-700">
                            {error}
                        </div>
                    ) : null}

                    <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="w-10 px-4 py-3 text-left">
                                            <input
                                                type="checkbox"
                                                checked={allChecked}
                                                onChange={(e) => toggleAll(e.target.checked)}
                                                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                                            />
                                        </th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Name</th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Type</th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Location</th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Year</th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Category</th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Published</th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Slug</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {busy && !projects.length ? (
                                        <tr>
                                            <td colSpan={8} className="px-4 py-10 text-center text-[12px] text-slate-500">
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : null}

                                    {!busy && !projects.length ? (
                                        <tr>
                                            <td colSpan={8} className="px-4 py-10 text-center text-[12px] text-slate-500">
                                                No projects found.
                                            </td>
                                        </tr>
                                    ) : null}

                                    {projects.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3">
                                                <input
                                                    type="checkbox"
                                                    checked={!!selected[String(p.id)]}
                                                    onChange={() => toggleOne(p.id)}
                                                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-[12px] font-semibold text-slate-900">{p.name}</td>
                                            <td className="px-4 py-3 text-[12px] text-slate-700">{String(p.type || '').replace(/_/g, ' ')}</td>
                                            <td className="px-4 py-3 text-[12px] text-slate-700">{p.location || '-'}</td>
                                            <td className="px-4 py-3 text-[12px] text-slate-700">{p.year || '-'}</td>
                                            <td className="px-4 py-3 text-[12px] text-slate-700">{p.category || '-'}</td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={
                                                        'inline-flex items-center rounded-full border px-2 py-1 text-[11px] font-semibold ' +
                                                        (p.is_published
                                                            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                                            : 'border-slate-200 bg-slate-50 text-slate-700')
                                                    }
                                                >
                                                    {p.is_published ? 'Yes' : 'No'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-[12px] font-mono text-slate-600">{p.slug}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                        <div>Showing {projects.length} project(s)</div>
                        <div>{busy ? 'Updating...' : 'Live'}</div>
                    </div>
                </div>

                {openAdd ? (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60" onClick={() => setOpenAdd(false)} />
                        <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5">
                            <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-6">
                                <div>
                                    <div className="text-lg font-black tracking-tight text-slate-900">Add portfolio project</div>
                                    <div className="mt-1 text-[12px] text-slate-600">
                                        For ongoing projects, you can paste status updates as: <span className="font-mono">label | value</span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setOpenAdd(false)}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                                    aria-label="Close"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="max-h-[70vh] overflow-y-auto p-6">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="text-[11px] font-semibold text-slate-700">Type</label>
                                        <select
                                            value={form.type}
                                            onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                        >
                                            <option value="featured">Featured</option>
                                            <option value="ongoing">Ongoing</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-2 pt-6">
                                        <input
                                            id="is_published"
                                            type="checkbox"
                                            checked={!!form.is_published}
                                            onChange={(e) => setForm((p) => ({ ...p, is_published: e.target.checked }))}
                                            className="h-4 w-4 rounded border-slate-300"
                                        />
                                        <label htmlFor="is_published" className="text-[12px] font-semibold text-slate-700">
                                            Published
                                        </label>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="text-[11px] font-semibold text-slate-700">Name *</label>
                                        <input
                                            value={form.name}
                                            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                            placeholder="Project name"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-semibold text-slate-700">Slug (optional)</label>
                                        <input
                                            value={form.slug}
                                            onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                            placeholder="auto-generated if empty"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-semibold text-slate-700">Location</label>
                                        <input
                                            value={form.location}
                                            onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                            placeholder="Kigamboni, Dar es Salaam"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-semibold text-slate-700">Year (featured)</label>
                                        <input
                                            value={form.year}
                                            onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))}
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                            placeholder="2025"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-semibold text-slate-700">Category</label>
                                        <input
                                            value={form.category}
                                            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                            placeholder="Luxury Residential"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-semibold text-slate-700">Value (featured)</label>
                                        <input
                                            value={form.value}
                                            onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))}
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                            placeholder="TZS 4.5 Billion"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-semibold text-slate-700">Sort order</label>
                                        <input
                                            value={form.sort_order}
                                            onChange={(e) => setForm((p) => ({ ...p, sort_order: e.target.value }))}
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                            placeholder="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-semibold text-slate-700">Expected (ongoing)</label>
                                        <input
                                            value={form.expected}
                                            onChange={(e) => setForm((p) => ({ ...p, expected: e.target.value }))}
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                            placeholder="December 2026"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-semibold text-slate-700">Progress (ongoing)</label>
                                        <input
                                            value={form.progress}
                                            onChange={(e) => setForm((p) => ({ ...p, progress: e.target.value }))}
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                            placeholder="65% Complete"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="text-[11px] font-semibold text-slate-700">Description</label>
                                        <textarea
                                            value={form.desc}
                                            onChange={(e) => setForm((p) => ({ ...p, desc: e.target.value }))}
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="text-[11px] font-semibold text-slate-700">Features (one per line)</label>
                                        <textarea
                                            value={form.features}
                                            onChange={(e) => setForm((p) => ({ ...p, features: e.target.value }))}
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-mono"
                                            rows={4}
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="text-[11px] font-semibold text-slate-700">Occupied by (one per line)</label>
                                        <textarea
                                            value={form.occupied_by}
                                            onChange={(e) => setForm((p) => ({ ...p, occupied_by: e.target.value }))}
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-mono"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="text-[11px] font-semibold text-slate-700">Status updates (ongoing) - one per line</label>
                                        <textarea
                                            value={form.status_updates}
                                            onChange={(e) => setForm((p) => ({ ...p, status_updates: e.target.value }))}
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-mono"
                                            rows={3}
                                            placeholder="Site clearing | 100%"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="text-[11px] font-semibold text-slate-700">Testimonial (optional)</label>
                                        <textarea
                                            value={form.testimonial}
                                            onChange={(e) => setForm((p) => ({ ...p, testimonial: e.target.value }))}
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 border-t border-slate-200 p-6">
                                <button
                                    type="button"
                                    onClick={() => setOpenAdd(false)}
                                    disabled={busy}
                                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={submitAdd}
                                    disabled={busy}
                                    className="rounded-xl bg-slate-900 px-4 py-2 text-[12px] font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </DashboardLayout>
    );
}
