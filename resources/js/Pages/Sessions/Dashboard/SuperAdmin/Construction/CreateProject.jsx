import ConstructionPanelLayout from '@/Layouts/ConstructionPanelLayout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function CreateProject() {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [form, setForm] = useState({
        code: '',
        category_id: '',
        location_id: '',
        name: '',
        status: 'planned',
        start_date: '',
        end_date: '',
        budget: '',
        description: '',
    });

    const [features, setFeatures] = useState(['']);

    const csrf = () => document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    const readJson = async (r) => {
        const text = await r.text();
        try {
            return text ? JSON.parse(text) : {};
        } catch (e) {
            return {};
        }
    };

    const statusOptions = [
        { value: 'planned', label: 'Planned' },
        { value: 'in_progress', label: 'In progress' },
        { value: 'on_hold', label: 'On hold' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    useEffect(() => {
        fetch(route('admin.construction.project-categories.data'), {
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to load categories');
                setCategories(Array.isArray(json?.categories) ? json.categories : []);
            })
            .catch(() => setCategories([]));

        fetch(route('admin.construction.locations.data'), {
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to load locations');
                setLocations(Array.isArray(json?.locations) ? json.locations : []);
            })
            .catch(() => setLocations([]));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const addFeatureRow = () => {
        setFeatures((prev) => [...prev, '']);
    };

    const removeFeatureRow = (idx) => {
        setFeatures((prev) => {
            const next = prev.filter((_, i) => i !== idx);
            return next.length ? next : [''];
        });
    };

    const setFeatureValue = (idx, value) => {
        setFeatures((prev) => prev.map((x, i) => (i === idx ? value : x)));
    };

    const submit = () => {
        if (!form.name) {
            setError('Project name is required');
            return;
        }

        setBusy(true);
        setError('');

        fetch(route('admin.construction.projects.store'), {
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
                category_id: form.category_id ? Number(form.category_id) : null,
                location_id: form.location_id ? Number(form.location_id) : null,
                features: features.map((x) => String(x || '').trim()).filter(Boolean),
                budget: form.budget !== '' ? Number(form.budget) : null,
                start_date: form.start_date || null,
                end_date: form.end_date || null,
                code: form.code || null,
                description: form.description || null,
            }),
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to create project');
                window.location.href = route('admin.construction.projects');
            })
            .catch((e) => setError(e?.message || 'Failed to create project'))
            .finally(() => setBusy(false));
    };

    return (
        <ConstructionPanelLayout
            title="Construction"
            active="create"
            items={[
                { key: 'projects', label: 'Projects', href: route('admin.construction.projects') },
                { key: 'create', label: 'Create Projects', href: route('admin.construction.projects.create') },
                { key: 'categories', label: 'Project Categories', href: route('admin.construction.project-categories') },
                { key: 'locations', label: 'Locations', href: route('admin.construction.locations') },
                { key: 'materials', label: 'Materials', href: route('admin.construction.materials') },
                { key: 'workers', label: 'Workers', href: route('admin.construction.workers') },
            ]}
        >
            <Head title="Create Project" />

            <div className="border-b border-slate-200 px-6 py-4">
                <div className="text-sm font-semibold text-slate-900">Create project</div>
                <div className="mt-1 text-[12px] text-slate-500">Add a new construction project and save to database.</div>
            </div>

            <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <div className="text-sm font-semibold text-slate-900">Create new project</div>
                        <div className="mt-1 text-[12px] text-slate-600">Fill the details then save.</div>
                    </div>
                    <Link
                        href={route('admin.construction.projects')}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
                    >
                        Back to list
                    </Link>
                </div>

                {error ? (
                    <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[12px] text-rose-700">{error}</div>
                ) : null}

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="text-[11px] font-semibold text-slate-700">Code (auto-generated)</label>
                        <input
                            value={form.code}
                            onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                            placeholder="Leave empty to auto-generate"
                        />
                    </div>

                    <div>
                        <label className="text-[11px] font-semibold text-slate-700">Status</label>
                        <select
                            value={form.status}
                            onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                        >
                            {statusOptions.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-[11px] font-semibold text-slate-700">Category</label>
                        <select
                            value={form.category_id}
                            onChange={(e) => setForm((p) => ({ ...p, category_id: e.target.value }))}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                        >
                            <option value="">Select category</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-[11px] font-semibold text-slate-700">Location</label>
                        <select
                            value={form.location_id}
                            onChange={(e) => setForm((p) => ({ ...p, location_id: e.target.value }))}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                        >
                            <option value="">Select location</option>
                            {locations.map((l) => (
                                <option key={l.id} value={l.id}>
                                    {l.name}
                                    {l.region ? `, ${l.region}` : ''}
                                    {l.country ? `, ${l.country}` : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="sm:col-span-2">
                        <label className="text-[11px] font-semibold text-slate-700">Project name *</label>
                        <input
                            value={form.name}
                            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                            placeholder="e.g. Edmark Residential Estate"
                        />
                    </div>

                        <div>
                            <label className="text-[11px] font-semibold text-slate-700">Start date</label>
                            <input
                                type="date"
                                value={form.start_date}
                                onChange={(e) => setForm((p) => ({ ...p, start_date: e.target.value }))}
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                            />
                        </div>

                        <div>
                            <label className="text-[11px] font-semibold text-slate-700">End date</label>
                            <input
                                type="date"
                                value={form.end_date}
                                onChange={(e) => setForm((p) => ({ ...p, end_date: e.target.value }))}
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                            />
                        </div>

                    <div>
                        <label className="text-[11px] font-semibold text-slate-700">Budget</label>
                        <input
                            value={form.budget}
                            onChange={(e) => setForm((p) => ({ ...p, budget: e.target.value }))}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                            placeholder="e.g. 4500000000"
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="text-[11px] font-semibold text-slate-700">Key features</label>
                        <div className="mt-2 grid gap-2">
                            {features.map((val, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <input
                                        value={val}
                                        onChange={(e) => setFeatureValue(idx, e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                        placeholder="e.g. 25 Luxury Villas"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeFeatureRow(idx)}
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                                        aria-label="Remove"
                                    >
                                        −
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addFeatureRow}
                                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-900 hover:bg-slate-50"
                            >
                                Add feature
                            </button>
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label className="text-[11px] font-semibold text-slate-700">Description</label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                            rows={5}
                            placeholder="Write a clear project description..."
                        />
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={submit}
                        disabled={busy}
                        className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-[12px] font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
                    >
                        Create project
                    </button>
                </div>
            </div>
        </ConstructionPanelLayout>
    );
}
