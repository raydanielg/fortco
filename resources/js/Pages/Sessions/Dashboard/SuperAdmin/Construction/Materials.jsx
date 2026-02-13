import ConstructionPanelLayout from '@/Layouts/ConstructionPanelLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

export default function Materials() {
    const [tab, setTab] = useState('all');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [items, setItems] = useState([]);

    const [name, setName] = useState('');
    const [unit, setUnit] = useState('pcs');
    const [unitRate, setUnitRate] = useState('');

    const [editOpen, setEditOpen] = useState(false);
    const [editId, setEditId] = useState('');
    const [editName, setEditName] = useState('');
    const [editUnit, setEditUnit] = useState('pcs');
    const [editUnitRate, setEditUnitRate] = useState('');

    const unitOptions = useMemo(
        () => [
            { value: 'pcs', label: 'Pcs' },
            { value: 'kg', label: 'Kg' },
            { value: 'ton', label: 'Ton' },
            { value: 'm', label: 'Meter (m)' },
            { value: 'm2', label: 'Square meter (m²)' },
            { value: 'm3', label: 'Cubic meter (m³)' },
            { value: 'bag', label: 'Bag' },
            { value: 'ltr', label: 'Liter (L)' },
        ],
        []
    );

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
        fetch(route('admin.construction.materials.data'), {
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to load materials');
                setItems(Array.isArray(json?.materials) ? json.materials : []);
            })
            .catch((e) => setError(e?.message || 'Failed to load materials'))
            .finally(() => setBusy(false));
    };

    useEffect(() => {
        fetchItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submit = () => {
        if (!name.trim()) {
            setError('Material name is required');
            return;
        }
        if (!unit) {
            setError('Unit is required');
            return;
        }

        setBusy(true);
        setError('');
        fetch(route('admin.construction.materials.store'), {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf(),
                Accept: 'application/json',
            },
            body: JSON.stringify({
                name: name.trim(),
                unit,
                unit_rate: unitRate !== '' ? Number(unitRate) : null,
            }),
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to create material');
                setName('');
                setUnit('pcs');
                setUnitRate('');
                setTab('all');
                fetchItems();
            })
            .catch((e) => setError(e?.message || 'Failed to create material'))
            .finally(() => setBusy(false));
    };

    const destroy = (m) => {
        if (!m?.id) return;
        if (!window.confirm(`Delete material "${m.name}"?`)) return;
        setBusy(true);
        setError('');
        fetch(route('admin.construction.materials.destroy', { material: m.id }), {
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

    const openEdit = (m) => {
        setError('');
        setEditId(String(m?.id || ''));
        setEditName(String(m?.name || ''));
        setEditUnit(String(m?.unit || 'pcs'));
        setEditUnitRate(m?.unit_rate !== null && m?.unit_rate !== undefined && m?.unit_rate !== '' ? String(m.unit_rate) : '');
        setEditOpen(true);
    };

    const closeEdit = () => {
        setEditOpen(false);
        setEditId('');
        setEditName('');
        setEditUnit('pcs');
        setEditUnitRate('');
    };

    const submitEdit = () => {
        if (!editId) return;
        if (!editName.trim()) {
            setError('Material name is required');
            return;
        }
        if (!editUnit) {
            setError('Unit is required');
            return;
        }

        setBusy(true);
        setError('');
        fetch(route('admin.construction.materials.update', { material: editId }), {
            method: 'PUT',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf(),
                Accept: 'application/json',
            },
            body: JSON.stringify({
                name: editName.trim(),
                unit: editUnit,
                unit_rate: editUnitRate !== '' ? Number(editUnitRate) : null,
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
            active="materials"
            items={navItems}
        >
            <Head title="Construction Materials" />

            <div className="border-b border-slate-200 px-6 py-4">
                <div className="text-sm font-semibold text-slate-900">Materials</div>
                <div className="mt-1 text-[12px] text-slate-500">Create and manage master materials list.</div>

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
                        <div className="text-sm font-semibold text-slate-900">Create material</div>
                        <div className="mt-1 text-[12px] text-slate-600">Add a new material to use in projects and stock tracking.</div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                            <div className="sm:col-span-2">
                                <label className="text-[11px] font-semibold text-slate-700">
                                    Material name <span className="text-rose-600">*</span>
                                </label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                    placeholder="e.g. Cement"
                                />
                            </div>

                            <div>
                                <label className="text-[11px] font-semibold text-slate-700">
                                    Unit <span className="text-rose-600">*</span>
                                </label>
                                <select
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                >
                                    {unitOptions.map((o) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="sm:col-span-2">
                                <label className="text-[11px] font-semibold text-slate-700">Unit rate</label>
                                <input
                                    value={unitRate}
                                    onChange={(e) => setUnitRate(e.target.value)}
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                    placeholder="e.g. 25000"
                                />
                            </div>

                            <div className="flex items-end">
                                <button
                                    type="button"
                                    onClick={submit}
                                    disabled={busy}
                                    className="w-full rounded-xl bg-slate-900 px-4 py-2 text-[12px] font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
                            <div className="text-[12px] font-semibold text-slate-900">All materials</div>
                            <button
                                type="button"
                                onClick={fetchItems}
                                disabled={busy}
                                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
                            >
                                Refresh
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-white">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Name</th>
                                        <th className="w-24 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Unit</th>
                                        <th className="w-36 px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-600">Rate</th>
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
                                                No materials found.
                                            </td>
                                        </tr>
                                    ) : null}

                                    {items.map((m) => (
                                        <tr key={m.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 text-[12px] font-semibold text-slate-900">{m.name}</td>
                                            <td className="px-4 py-3 text-[12px] text-slate-700">{m.unit || '-'}</td>
                                            <td className="px-4 py-3 text-right text-[12px] text-slate-900">
                                                {m.unit_rate !== null && m.unit_rate !== undefined && m.unit_rate !== '' ? Number(m.unit_rate).toLocaleString() : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEdit(m)}
                                                        disabled={busy}
                                                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => destroy(m)}
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
                                <div className="text-sm font-semibold text-slate-900">Edit material</div>
                                <div className="mt-1 text-[12px] text-slate-600">Update the material name and save changes.</div>
                            </div>

                            <div className="p-5">
                                <label className="text-[11px] font-semibold text-slate-700">
                                    Material name <span className="text-rose-600">*</span>
                                </label>
                                <input
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                    placeholder="Material name"
                                />

                                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                    <div>
                                        <label className="text-[11px] font-semibold text-slate-700">
                                            Unit <span className="text-rose-600">*</span>
                                        </label>
                                        <select
                                            value={editUnit}
                                            onChange={(e) => setEditUnit(e.target.value)}
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                        >
                                            {unitOptions.map((o) => (
                                                <option key={o.value} value={o.value}>
                                                    {o.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-semibold text-slate-700">Unit rate</label>
                                        <input
                                            value={editUnitRate}
                                            onChange={(e) => setEditUnitRate(e.target.value)}
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                            placeholder="e.g. 25000"
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
            </div>
        </ConstructionPanelLayout>
    );
}
