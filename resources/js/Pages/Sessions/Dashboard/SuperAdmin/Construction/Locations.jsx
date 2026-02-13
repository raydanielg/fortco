import ConstructionPanelLayout from '@/Layouts/ConstructionPanelLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

export default function Locations() {
    const [tab, setTab] = useState('all');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [items, setItems] = useState([]);

    const [form, setForm] = useState({ region: '', country: '' });

    const [autoOpen, setAutoOpen] = useState(false);
    const [autoCountry, setAutoCountry] = useState('');

    const [editOpen, setEditOpen] = useState(false);
    const [editId, setEditId] = useState('');
    const [editForm, setEditForm] = useState({ name: '', region: '', country: '' });

    const autoRegionsByCountry = useMemo(
        () => ({
            Tanzania: [
                'Arusha',
                'Dar es Salaam',
                'Dodoma',
                'Geita',
                'Iringa',
                'Kagera',
                'Katavi',
                'Kigoma',
                'Kilimanjaro',
                'Lindi',
                'Manyara',
                'Mara',
                'Mbeya',
                'Morogoro',
                'Mtwara',
                'Mwanza',
                'Njombe',
                'Pwani (Coast)',
                'Rukwa',
                'Ruvuma',
                'Shinyanga',
                'Simiyu',
                'Singida',
                'Songwe',
                'Tabora',
                'Tanga',
                'Kaskazini Unguja',
                'Kusini Unguja',
                'Mjini Magharibi',
                'Kaskazini Pemba',
                'Kusini Pemba',
            ],
            Kenya: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kiambu'],
            Uganda: ['Kampala', 'Wakiso', 'Mukono', 'Jinja'],
            Rwanda: ['Kigali', 'Eastern Province', 'Northern Province', 'Western Province', 'Southern Province'],
        }),
        []
    );

    const autoCountries = useMemo(() => Object.keys(autoRegionsByCountry), [autoRegionsByCountry]);

    const csrf = () => document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

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
            { key: 'projects', label: 'Projects', href: route('admin.construction.projects') },
            { key: 'create', label: 'Create Projects', href: route('admin.construction.projects.create') },
            { key: 'categories', label: 'Project Categories', href: route('admin.construction.project-categories') },
            { key: 'locations', label: 'Locations', href: route('admin.construction.locations') },
            { key: 'materials', label: 'Materials', href: route('admin.construction.materials') },
            { key: 'workers', label: 'Workers', href: route('admin.construction.workers') },
        ],
        []
    );

    const fetchItems = () => {
        setBusy(true);
        setError('');
        fetch(route('admin.construction.locations.data'), {
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to load locations');
                setItems(Array.isArray(json?.locations) ? json.locations : []);
            })
            .catch((e) => setError(e?.message || 'Failed to load locations'))
            .finally(() => setBusy(false));
    };

    useEffect(() => {
        fetchItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submit = () => {
        if (!form.country) {
            setError('Country is required');
            return;
        }
        if (!form.region.trim()) {
            setError('Region is required');
            return;
        }

        setBusy(true);
        setError('');
        fetch(route('admin.construction.locations.store'), {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf(),
                Accept: 'application/json',
            },
            body: JSON.stringify({
                name: form.region.trim(),
                region: form.region.trim(),
                country: form.country,
            }),
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to create location');
                setForm({ region: '', country: '' });
                setTab('all');
                fetchItems();
            })
            .catch((e) => setError(e?.message || 'Failed to create location'))
            .finally(() => setBusy(false));
    };

    const openAuto = () => {
        setError('');
        setAutoCountry('');
        setAutoOpen(true);
    };

    const closeAuto = () => {
        setAutoOpen(false);
        setAutoCountry('');
    };

    const submitAuto = () => {
        if (!autoCountry) {
            setError('Country is required');
            return;
        }

        setBusy(true);
        setError('');
        fetch(route('admin.construction.locations.auto-create'), {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf(),
                Accept: 'application/json',
            },
            body: JSON.stringify({
                country: autoCountry,
            }),
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to create location');
                closeAuto();
                fetchItems();
            })
            .catch((e) => setError(e?.message || 'Failed to create location'))
            .finally(() => setBusy(false));
    };

    const destroy = (l) => {
        if (!l?.id) return;
        const label = [l.name, l.region, l.country].filter(Boolean).join(', ');
        if (!window.confirm(`Delete location "${label}"?`)) return;
        setBusy(true);
        setError('');
        fetch(route('admin.construction.locations.destroy', { location: l.id }), {
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
                fetchItems();
            })
            .catch((e) => setError(e?.message || 'Delete failed'))
            .finally(() => setBusy(false));
    };

    const openEdit = (l) => {
        setError('');
        setEditId(String(l?.id || ''));
        setEditForm({
            name: String(l?.name || ''),
            region: String(l?.region || ''),
            country: String(l?.country || ''),
        });
        setEditOpen(true);
    };

    const closeEdit = () => {
        setEditOpen(false);
        setEditId('');
        setEditForm({ name: '', region: '', country: '' });
    };

    const submitEdit = () => {
        if (!editId) return;
        if (!editForm.name.trim()) {
            setError('Location name is required');
            return;
        }

        setBusy(true);
        setError('');
        fetch(route('admin.construction.locations.update', { location: editId }), {
            method: 'PUT',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf(),
                Accept: 'application/json',
            },
            body: JSON.stringify({
                name: editForm.name.trim(),
                region: editForm.region.trim() || null,
                country: editForm.country.trim() || null,
            }),
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Update failed');
                closeEdit();
                fetchItems();
            })
            .catch((e) => setError(e?.message || 'Update failed'))
            .finally(() => setBusy(false));
    };

    return (
        <ConstructionPanelLayout
            title="Construction"
            active="locations"
            items={navItems}
        >
            <Head title="Locations" />

            <div className="border-b border-slate-200 px-6 py-4">
                <div className="text-sm font-semibold text-slate-900">Locations</div>
                <div className="mt-1 text-[12px] text-slate-500">Create and manage locations used in Construction projects.</div>

                <div className="mt-4 flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setTab('all')}
                        className={
                            'rounded-xl px-4 py-2 text-[12px] font-semibold transition ' +
                            (tab === 'all' ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50')
                        }
                    >
                        All items
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab('create')}
                        className={
                            'rounded-xl px-4 py-2 text-[12px] font-semibold transition ' +
                            (tab === 'create'
                                ? 'bg-slate-900 text-white'
                                : 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50')
                        }
                    >
                        Create
                    </button>
                </div>
            </div>

            <div className="p-6">
                {error ? (
                    <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[12px] text-rose-700">{error}</div>
                ) : null}

                {tab === 'create' ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">Create location</div>
                        <div className="mt-1 text-[12px] text-slate-600">Add a location to standardize reporting and tracking.</div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                            <div className="sm:col-span-1">
                                <label className="text-[11px] font-semibold text-slate-700">
                                    Country <span className="text-rose-600">*</span>
                                </label>
                                <select
                                    value={form.country}
                                    onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                >
                                    <option value="">Select country</option>
                                    {autoCountries.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="sm:col-span-2">
                                <label className="text-[11px] font-semibold text-slate-700">
                                    Region <span className="text-rose-600">*</span>
                                </label>
                                <input
                                    value={form.region}
                                    onChange={(e) => setForm((p) => ({ ...p, region: e.target.value }))}
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                    placeholder="Type region e.g. Pwani (Coast)"
                                />
                                <div className="mt-1 text-[11px] text-slate-500">Location name will be saved as the region.</div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-end">
                            <button
                                type="button"
                                onClick={submit}
                                disabled={busy}
                                className="rounded-xl bg-slate-900 px-5 py-2.5 text-[12px] font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
                            <div className="text-[12px] font-semibold text-slate-900">All locations</div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={openAuto}
                                    disabled={busy}
                                    className="rounded-xl bg-slate-900 px-3 py-2 text-[12px] font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
                                >
                                    Auto create
                                </button>
                                <button
                                    type="button"
                                    onClick={fetchItems}
                                    disabled={busy}
                                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
                                >
                                    Refresh
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-white">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Name</th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Region</th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Country</th>
                                        <th className="w-36 px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-600">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {busy && !items.length ? (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-10 text-center text-[12px] text-slate-500">
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : null}

                                    {!busy && !items.length ? (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-10 text-center text-[12px] text-slate-500">
                                                No locations found.
                                            </td>
                                        </tr>
                                    ) : null}

                                    {items.map((l) => (
                                        <tr key={l.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 text-[12px] font-semibold text-slate-900">{l.name}</td>
                                            <td className="px-4 py-3 text-[12px] text-slate-700">{l.region || '-'}</td>
                                            <td className="px-4 py-3 text-[12px] text-slate-700">{l.country || '-'}</td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEdit(l)}
                                                        disabled={busy}
                                                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => destroy(l)}
                                                        disabled={busy}
                                                        className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[12px] font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="border-t border-slate-200 px-4 py-3 text-[11px] text-slate-500">Showing {items.length} item(s)</div>
                    </div>
                )}

                {editOpen ? (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <button
                            type="button"
                            className="absolute inset-0 bg-slate-900/40"
                            onClick={closeEdit}
                            aria-label="Close"
                        />
                        <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                            <div className="border-b border-slate-200 px-5 py-4">
                                <div className="text-sm font-semibold text-slate-900">Edit location</div>
                                <div className="mt-1 text-[12px] text-slate-600">Update location details and save changes.</div>
                            </div>

                            <div className="p-5">
                                <div className="grid gap-3">
                                    <div>
                                        <label className="text-[11px] font-semibold text-slate-700">
                                            Name <span className="text-rose-600">*</span>
                                        </label>
                                        <input
                                            value={editForm.name}
                                            onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                            placeholder="Location name"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-semibold text-slate-700">Region</label>
                                        <input
                                            value={editForm.region}
                                            onChange={(e) => setEditForm((p) => ({ ...p, region: e.target.value }))}
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                            placeholder="Region"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-semibold text-slate-700">Country</label>
                                        <input
                                            value={editForm.country}
                                            onChange={(e) => setEditForm((p) => ({ ...p, country: e.target.value }))}
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                            placeholder="Country"
                                        />
                                    </div>
                                </div>

                                <div className="mt-5 flex items-center justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={closeEdit}
                                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-900 hover:bg-slate-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={submitEdit}
                                        disabled={busy}
                                        className="rounded-xl bg-slate-900 px-4 py-2 text-[12px] font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}

                {autoOpen ? (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <button
                            type="button"
                            className="absolute inset-0 bg-slate-900/40"
                            onClick={closeAuto}
                            aria-label="Close"
                        />
                        <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                            <div className="border-b border-slate-200 px-5 py-4">
                                <div className="text-sm font-semibold text-slate-900">Auto create location</div>
                                <div className="mt-1 text-[12px] text-slate-600">Choose a country then we will create all regions for that country.</div>
                            </div>

                            <div className="p-5">
                                <div className="grid gap-3">
                                    <div>
                                        <label className="text-[11px] font-semibold text-slate-700">
                                            Country <span className="text-rose-600">*</span>
                                        </label>
                                        <select
                                            value={autoCountry}
                                            onChange={(e) => setAutoCountry(e.target.value)}
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                        >
                                            <option value="">Select country</option>
                                            {autoCountries.map((c) => (
                                                <option key={c} value={c}>
                                                    {c}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {autoCountry ? (
                                    <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] text-slate-700">
                                        <div className="text-[11px] font-semibold text-slate-600">Regions to create</div>
                                        <div className="mt-1">{(autoRegionsByCountry[autoCountry] || []).join(', ') || 'No regions configured for this country.'}</div>
                                    </div>
                                ) : null}

                                <div className="mt-5 flex items-center justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={closeAuto}
                                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-900 hover:bg-slate-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={submitAuto}
                                        disabled={busy}
                                        className="rounded-xl bg-slate-900 px-4 py-2 text-[12px] font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                                    >
                                        Create all
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </ConstructionPanelLayout>
    );
}
