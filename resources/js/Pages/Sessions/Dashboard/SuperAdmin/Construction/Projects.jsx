import ConstructionPanelLayout from '@/Layouts/ConstructionPanelLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

export default function Projects() {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [projects, setProjects] = useState([]);
    const [q, setQ] = useState('');
    const [status, setStatus] = useState('all');
    const [selected, setSelected] = useState({});

    const [menuProjectId, setMenuProjectId] = useState('');

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
        if (status && status !== 'all') params.set('status', status);
        const s = params.toString();
        return s ? `?${s}` : '';
    }, [q, status]);

    const fetchProjects = () => {
        setBusy(true);
        setError('');
        fetch(route('admin.construction.projects.data') + queryString, {
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to load projects');
                setProjects(Array.isArray(json?.projects) ? json.projects : []);
            })
            .catch((e) => setError(e?.message || 'Failed to load projects'))
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

    const statusOptions = useMemo(
        () => [
            { value: 'all', label: 'All statuses' },
            { value: 'planned', label: 'Planned' },
            { value: 'in_progress', label: 'In progress' },
            { value: 'on_hold', label: 'On hold' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' },
        ],
        []
    );

    const selectedIds = useMemo(
        () => Object.keys(selected).filter((id) => selected[id]).map((id) => Number(id)).filter(Boolean),
        [selected]
    );

    const allChecked = useMemo(() => {
        if (!projects.length) return false;
        return projects.every((p) => selected[String(p.id)]);
    }, [projects, selected]);

    const toggleAll = (checked) => {
        if (!projects.length) return;
        const next = {};
        projects.forEach((p) => {
            next[String(p.id)] = checked;
        });
        setSelected(next);
    };

    const toggleOne = (id) => {
        setSelected((prev) => ({
            ...prev,
            [String(id)]: !prev[String(id)],
        }));
    };

    const bulkDelete = () => {
        if (!selectedIds.length) return;
        if (!window.confirm(`Delete ${selectedIds.length} project(s)? This cannot be undone.`)) return;

        setBusy(true);
        setError('');
        fetch(route('admin.construction.projects.bulk-destroy'), {
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

    const viewProject = (p) => {
        if (!p?.id) return;
        window.location.href = route('admin.construction.projects') + `?view=${encodeURIComponent(String(p.id))}`;
    };

    const progressProject = (p) => {
        if (!p?.id) return;
        window.location.href = route('admin.construction.projects') + `?progress=${encodeURIComponent(String(p.id))}`;
    };

    const deleteProject = (p) => {
        if (!p?.id) return;
        if (!window.confirm(`Delete ${p.name}? This cannot be undone.`)) return;

        setBusy(true);
        setError('');
        fetch(route('admin.construction.projects.destroy', { project: p.id }), {
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
                setMenuProjectId('');
                setSelected((prev) => {
                    const next = { ...prev };
                    delete next[String(p.id)];
                    return next;
                });
                fetchProjects();
            })
            .catch((e) => setError(e?.message || 'Delete failed'))
            .finally(() => setBusy(false));
    };

    const exportExcel = () => {
        const url = route('admin.construction.projects.export') + queryString;
        window.location.href = url;
    };

    const goCreate = () => {
        window.location.href = route('admin.construction.projects.create');
    };

    return (
        <ConstructionPanelLayout
            title="Construction"
            active="projects"
            items={[
                { key: 'projects', label: 'Projects', href: route('admin.construction.projects') },
                { key: 'create', label: 'Create Projects', href: route('admin.construction.projects.create') },
                { key: 'categories', label: 'Project Categories', href: route('admin.construction.project-categories') },
                { key: 'locations', label: 'Locations', href: route('admin.construction.locations') },
                { key: 'materials', label: 'Materials', href: route('admin.construction.materials') },
                { key: 'workers', label: 'Workers', href: route('admin.construction.workers') },
            ]}
        >
            <Head title="Construction Projects" />

            <div className="border-b border-slate-200 px-6 py-4">
                <div className="text-sm font-semibold text-slate-900">Projects</div>
                <div className="mt-1 text-[12px] text-slate-500">Manage construction projects with filters, bulk actions and export.</div>
            </div>

            <div className="p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-900">Projects</div>
                        <div className="mt-1 text-[12px] text-slate-600">Search, filter, export and manage projects.</div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                        <button
                            type="button"
                            onClick={goCreate}
                            disabled={busy}
                            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-[12px] font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
                        >
                            Create Project
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
                        <div className="lg:col-span-6">
                            <label className="text-[11px] font-semibold text-slate-700">Search</label>
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Search by name or code..."
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                            />
                        </div>
                        <div className="lg:col-span-3">
                            <label className="text-[11px] font-semibold text-slate-700">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                            >
                                {statusOptions.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="lg:col-span-3">
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

                    <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
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
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Code</th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Name</th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Status</th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Start</th>
                                        <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">End</th>
                                        <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-600">Budget</th>
                                        <th className="w-12 px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-600">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {busy && !projects.length ? (
                                        <tr>
                                            <td colSpan={8} className="px-4 py-8 text-center text-[12px] text-slate-500">
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
                                            <td className="px-4 py-3 text-[12px] font-medium text-slate-900">
                                                {p.code || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-[12px] text-slate-900">{p.name}</td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700">
                                                    {String(p.status || '').replace(/_/g, ' ') || '-'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-[12px] text-slate-600">{p.start_date || '-'}</td>
                                            <td className="px-4 py-3 text-[12px] text-slate-600">{p.end_date || '-'}</td>
                                            <td className="px-4 py-3 text-right text-[12px] text-slate-900">
                                                {p.budget !== null && p.budget !== undefined && p.budget !== '' ? Number(p.budget).toLocaleString() : '-'}
                                            </td>
                                            <td className="relative px-4 py-3 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => setMenuProjectId((v) => (String(v) === String(p.id) ? '' : String(p.id)))}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
                                                    aria-label="Actions"
                                                >
                                                    <span className="text-lg leading-none">⋯</span>
                                                </button>

                                                {String(menuProjectId) === String(p.id) ? (
                                                    <div className="absolute right-4 top-12 z-20 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setMenuProjectId('');
                                                                progressProject(p);
                                                            }}
                                                            className="block w-full px-4 py-2 text-left text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                                                        >
                                                            Progress
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setMenuProjectId('');
                                                                viewProject(p);
                                                            }}
                                                            className="block w-full px-4 py-2 text-left text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                                                        >
                                                            View
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteProject(p)}
                                                            className="block w-full px-4 py-2 text-left text-[12px] font-semibold text-rose-700 hover:bg-rose-50"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                ) : null}
                                            </td>
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
        </ConstructionPanelLayout>
    );
}
