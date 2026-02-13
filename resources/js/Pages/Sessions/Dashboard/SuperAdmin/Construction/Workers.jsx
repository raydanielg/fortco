import ConstructionPanelLayout from '@/Layouts/ConstructionPanelLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

export default function Workers() {
    const [tab, setTab] = useState('all');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const [groups, setGroups] = useState([]);
    const [groupsLoading, setGroupsLoading] = useState(true);
    const [activeGroupId, setActiveGroupId] = useState('');

    const [detailsLoading, setDetailsLoading] = useState(false);
    const [activeGroup, setActiveGroup] = useState(null);
    const [workers, setWorkers] = useState([]);
    const [projects, setProjects] = useState([]);

    const [projectsOptions, setProjectsOptions] = useState([]);
    const [assignProjectId, setAssignProjectId] = useState('');

    const [newGroup, setNewGroup] = useState({ name: '', type: 'company' });
    const [newWorker, setNewWorker] = useState({ name: '', age: '', date_of_birth: '', nida: '' });

    const [editDocOpen, setEditDocOpen] = useState(false);
    const [editDoc, setEditDoc] = useState(null);
    const [editDocForm, setEditDocForm] = useState({ status: 'pending', expiry_date: '', notes: '' });

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

    const docLabels = useMemo(
        () => ({
            nida: 'NIDA',
            id_passport: 'ID/Passport',
            work_permit: 'Work Permit',
            safety_training: 'Safety/Training',
        }),
        []
    );

    const statusBadge = (status) => {
        const v = String(status || 'pending');
        if (v === 'verified') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
        if (v === 'rejected') return 'border-rose-200 bg-rose-50 text-rose-700';
        return 'border-slate-200 bg-slate-50 text-slate-700';
    };

    const statusDot = (status) => {
        const v = String(status || 'pending');
        if (v === 'verified') return 'bg-emerald-500';
        if (v === 'rejected') return 'bg-rose-500';
        return 'bg-amber-500 animate-pulse';
    };

    const fetchGroups = () => {
        setGroupsLoading(true);
        setError('');
        fetch(route('admin.construction.workers.groups'), {
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to load groups');
                const rows = Array.isArray(json?.groups) ? json.groups : [];
                setGroups(rows);
                if (!activeGroupId && rows.length) setActiveGroupId(String(rows[0].id));
            })
            .catch((e) => setError(e?.message || 'Failed to load groups'))
            .finally(() => setGroupsLoading(false));
    };

    const fetchProjectsOptions = () => {
        fetch(route('admin.construction.workers.projects'), {
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to load projects');
                setProjectsOptions(Array.isArray(json?.projects) ? json.projects : []);
            })
            .catch(() => setProjectsOptions([]));
    };

    const fetchDetails = (groupId) => {
        if (!groupId) return;
        setDetailsLoading(true);
        setError('');
        fetch(route('admin.construction.workers.groups.show', { group: groupId }), {
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to load group details');
                setActiveGroup(json?.group || null);
                setWorkers(Array.isArray(json?.workers) ? json.workers : []);
                setProjects(Array.isArray(json?.projects) ? json.projects : []);
                setAssignProjectId('');
            })
            .catch((e) => setError(e?.message || 'Failed to load group details'))
            .finally(() => setDetailsLoading(false));
    };

    useEffect(() => {
        fetchGroups();
        fetchProjectsOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (activeGroupId) fetchDetails(activeGroupId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeGroupId]);

    const createGroup = () => {
        if (!newGroup.name.trim()) {
            setError('Group name is required');
            return;
        }
        setBusy(true);
        setError('');
        fetch(route('admin.construction.workers.groups.store'), {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf(),
                Accept: 'application/json',
            },
            body: JSON.stringify({ name: newGroup.name.trim(), type: newGroup.type }),
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to create group');
                setNewGroup({ name: '', type: 'company' });
                setTab('all');
                fetchGroups();
            })
            .catch((e) => setError(e?.message || 'Failed to create group'))
            .finally(() => setBusy(false));
    };

    const createWorker = () => {
        if (!activeGroupId) return;
        if (!newWorker.name.trim()) {
            setError('Worker name is required');
            return;
        }
        setBusy(true);
        setError('');
        fetch(route('admin.construction.workers.store'), {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf(),
                Accept: 'application/json',
            },
            body: JSON.stringify({
                group_id: Number(activeGroupId),
                name: newWorker.name.trim(),
                age: newWorker.age !== '' ? Number(newWorker.age) : null,
                date_of_birth: newWorker.date_of_birth || null,
                nida: newWorker.nida.trim() || null,
            }),
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to create worker');
                setNewWorker({ name: '', age: '', date_of_birth: '', nida: '' });
                fetchDetails(activeGroupId);
                fetchGroups();
            })
            .catch((e) => setError(e?.message || 'Failed to create worker'))
            .finally(() => setBusy(false));
    };

    const deleteWorker = (w) => {
        if (!w?.id) return;
        if (!window.confirm(`Delete worker "${w.name}"?`)) return;
        setBusy(true);
        setError('');
        fetch(route('admin.construction.workers.destroy', { worker: w.id }), {
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
                fetchDetails(activeGroupId);
                fetchGroups();
            })
            .catch((e) => setError(e?.message || 'Delete failed'))
            .finally(() => setBusy(false));
    };

    const assignProject = () => {
        if (!activeGroupId || !assignProjectId) return;
        setBusy(true);
        setError('');
        fetch(route('admin.construction.workers.groups.assign', { group: activeGroupId }), {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf(),
                Accept: 'application/json',
            },
            body: JSON.stringify({ project_id: Number(assignProjectId) }),
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Assign failed');
                fetchDetails(activeGroupId);
            })
            .catch((e) => setError(e?.message || 'Assign failed'))
            .finally(() => setBusy(false));
    };

    const unassignProject = (p) => {
        if (!activeGroupId || !p?.id) return;
        setBusy(true);
        setError('');
        fetch(route('admin.construction.workers.groups.unassign', { group: activeGroupId }), {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf(),
                Accept: 'application/json',
            },
            body: JSON.stringify({ project_id: Number(p.id) }),
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Unassign failed');
                fetchDetails(activeGroupId);
            })
            .catch((e) => setError(e?.message || 'Unassign failed'))
            .finally(() => setBusy(false));
    };

    const openDoc = (worker, doc) => {
        setError('');
        setEditDoc({ worker, doc });
        setEditDocForm({
            status: doc?.status || 'pending',
            expiry_date: doc?.expiry_date || '',
            notes: doc?.notes || '',
        });
        setEditDocOpen(true);
    };

    const closeDoc = () => {
        setEditDocOpen(false);
        setEditDoc(null);
        setEditDocForm({ status: 'pending', expiry_date: '', notes: '' });
    };

    const saveDoc = () => {
        const docId = editDoc?.doc?.id;
        if (!docId) {
            setError('Document record not found');
            return;
        }

        setBusy(true);
        setError('');
        fetch(route('admin.construction.workers.documents.update', { document: docId }), {
            method: 'PUT',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf(),
                Accept: 'application/json',
            },
            body: JSON.stringify({
                status: editDocForm.status,
                expiry_date: editDocForm.expiry_date || null,
                notes: editDocForm.notes || null,
                file_path: editDoc?.doc?.file_path || null,
            }),
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Update failed');
                closeDoc();
                fetchDetails(activeGroupId);
            })
            .catch((e) => setError(e?.message || 'Update failed'))
            .finally(() => setBusy(false));
    };

    const skeletonGroups = (
        <div className="grid gap-2 p-2">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded-xl bg-slate-100" />
            ))}
        </div>
    );

    const skeletonDetails = (
        <div className="p-6">
            <div className="h-6 w-52 animate-pulse rounded bg-slate-100" />
            <div className="mt-3 h-4 w-80 animate-pulse rounded bg-slate-100" />
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-20 animate-pulse rounded-2xl border border-slate-200 bg-white" />
                ))}
            </div>
            <div className="mt-6 h-64 animate-pulse rounded-2xl border border-slate-200 bg-white" />
        </div>
    );

    return (
        <ConstructionPanelLayout
            title="Construction"
            active="workers"
            items={navItems}
        >
            <Head title="Construction Workers" />

            <div className="border-b border-slate-200 px-6 py-4">
                <div className="text-sm font-semibold text-slate-900">Workers</div>
                <div className="mt-1 text-[12px] text-slate-500">Manage groups (companies/individuals) and assign them to projects.</div>

                <div className="mt-4 flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setTab('all')}
                        className={
                            'rounded-xl px-4 py-2 text-[12px] font-semibold transition ' +
                            (tab === 'all' ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50')
                        }
                    >
                        All workers
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
                        Add group
                    </button>
                </div>
            </div>

            <div className="p-6">
                {error ? (
                    <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[12px] text-rose-700">{error}</div>
                ) : null}

                {tab === 'create' ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">Add group</div>
                        <div className="mt-1 text-[12px] text-slate-600">Create a company/individual group, then add workers and assign to projects.</div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                            <div className="sm:col-span-2">
                                <label className="text-[11px] font-semibold text-slate-700">
                                    Group name <span className="text-rose-600">*</span>
                                </label>
                                <input
                                    value={newGroup.name}
                                    onChange={(e) => setNewGroup((p) => ({ ...p, name: e.target.value }))}
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                    placeholder="e.g. ABC Contractors Ltd"
                                />
                            </div>

                            <div>
                                <label className="text-[11px] font-semibold text-slate-700">
                                    Type <span className="text-rose-600">*</span>
                                </label>
                                <select
                                    value={newGroup.type}
                                    onChange={(e) => setNewGroup((p) => ({ ...p, type: e.target.value }))}
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                >
                                    <option value="company">Company</option>
                                    <option value="individual">Individual</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-end">
                            <button
                                type="button"
                                onClick={createGroup}
                                disabled={busy}
                                className="rounded-xl bg-slate-900 px-5 py-2.5 text-[12px] font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
                            >
                                Save group
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                            <div className="flex items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
                                <div className="text-[12px] font-semibold text-slate-900">Groups</div>
                                <button
                                    type="button"
                                    onClick={fetchGroups}
                                    disabled={groupsLoading}
                                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
                                >
                                    Refresh
                                </button>
                            </div>

                            {groupsLoading ? (
                                skeletonGroups
                            ) : (
                                <div className="p-2">
                                    {groups.length ? null : (
                                        <div className="p-4 text-[12px] text-slate-500">No groups yet. Use “Add group”.</div>
                                    )}
                                    <div className="grid gap-1">
                                        {groups.map((g) => {
                                            const active = String(activeGroupId) === String(g.id);
                                            return (
                                                <button
                                                    key={g.id}
                                                    type="button"
                                                    onClick={() => setActiveGroupId(String(g.id))}
                                                    className={
                                                        'flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[12px] font-semibold transition ' +
                                                        (active
                                                            ? 'bg-slate-900 text-white'
                                                            : 'text-slate-900 hover:bg-slate-50')
                                                    }
                                                >
                                                    <div className="min-w-0">
                                                        <div className="truncate">{g.name}</div>
                                                        <div className={"mt-0.5 text-[11px] font-semibold " + (active ? 'text-white/80' : 'text-slate-500')}>
                                                            {g.type} • {g.workers_count} worker(s)
                                                        </div>
                                                    </div>
                                                    <div className={"h-2 w-2 rounded-full " + (active ? 'bg-white' : 'bg-slate-300')} />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                            {detailsLoading ? (
                                skeletonDetails
                            ) : !activeGroup ? (
                                <div className="p-6 text-[12px] text-slate-500">Select a group to view workers.</div>
                            ) : (
                                <>
                                    <div className="border-b border-slate-200 px-6 py-4">
                                        <div className="flex flex-wrap items-end justify-between gap-3">
                                            <div>
                                                <div className="text-sm font-semibold text-slate-900">{activeGroup.name}</div>
                                                <div className="mt-1 text-[12px] text-slate-500">Group type: {activeGroup.type}</div>
                                            </div>

                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                                <select
                                                    value={assignProjectId}
                                                    onChange={(e) => setAssignProjectId(e.target.value)}
                                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] sm:w-72"
                                                >
                                                    <option value="">Assign to project…</option>
                                                    {projectsOptions.map((p) => (
                                                        <option key={p.id} value={p.id}>
                                                            {p.code ? `${p.code} - ` : ''}
                                                            {p.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={assignProject}
                                                    disabled={busy || !assignProjectId}
                                                    className="rounded-xl bg-slate-900 px-4 py-2 text-[12px] font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
                                                >
                                                    Assign
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {projects.length ? null : (
                                                <div className="text-[12px] text-slate-500">Not assigned to any project.</div>
                                            )}
                                            {projects.map((p) => (
                                                <button
                                                    key={p.id}
                                                    type="button"
                                                    onClick={() => unassignProject(p)}
                                                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                                                    title="Click to remove"
                                                >
                                                    <span className="truncate">{p.code ? `${p.code}: ` : ''}{p.name}</span>
                                                    <span className="text-slate-400">×</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                            <div className="text-[12px] font-semibold text-slate-900">Add worker</div>
                                            <div className="mt-1 text-[11px] text-slate-600">Add individual worker into this group.</div>

                                            <div className="mt-4 grid gap-3 sm:grid-cols-5">
                                                <div className="sm:col-span-2">
                                                    <label className="text-[11px] font-semibold text-slate-700">
                                                        Full name <span className="text-rose-600">*</span>
                                                    </label>
                                                    <input
                                                        value={newWorker.name}
                                                        onChange={(e) => setNewWorker((p) => ({ ...p, name: e.target.value }))}
                                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                                        placeholder="Worker name"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[11px] font-semibold text-slate-700">Age</label>
                                                    <input
                                                        value={newWorker.age}
                                                        onChange={(e) => setNewWorker((p) => ({ ...p, age: e.target.value }))}
                                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                                        placeholder="e.g. 28"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[11px] font-semibold text-slate-700">DOB</label>
                                                    <input
                                                        type="date"
                                                        value={newWorker.date_of_birth}
                                                        onChange={(e) => setNewWorker((p) => ({ ...p, date_of_birth: e.target.value }))}
                                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[11px] font-semibold text-slate-700">NIDA</label>
                                                    <input
                                                        value={newWorker.nida}
                                                        onChange={(e) => setNewWorker((p) => ({ ...p, nida: e.target.value }))}
                                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                                        placeholder="NIDA number"
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-4 flex items-center justify-end">
                                                <button
                                                    type="button"
                                                    onClick={createWorker}
                                                    disabled={busy}
                                                    className="rounded-xl bg-slate-900 px-4 py-2 text-[12px] font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                                                >
                                                    Add worker
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                                            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                                                <div className="text-[12px] font-semibold text-slate-900">Workers</div>
                                            </div>

                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-slate-200">
                                                    <thead className="bg-white">
                                                        <tr>
                                                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Name</th>
                                                            <th className="w-24 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Age</th>
                                                            <th className="w-32 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">DOB</th>
                                                            <th className="w-44 px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">NIDA</th>
                                                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-600">Documents</th>
                                                            <th className="w-24 px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-600">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-200 bg-white">
                                                        {!workers.length ? (
                                                            <tr>
                                                                <td colSpan={6} className="px-4 py-10 text-center text-[12px] text-slate-500">
                                                                    No workers in this group.
                                                                </td>
                                                            </tr>
                                                        ) : null}

                                                        {workers.map((w) => (
                                                            <tr key={w.id} className="hover:bg-slate-50">
                                                                <td className="px-4 py-3 text-[12px] font-semibold text-slate-900">{w.name}</td>
                                                                <td className="px-4 py-3 text-[12px] text-slate-700">{w.age ?? '-'}</td>
                                                                <td className="px-4 py-3 text-[12px] text-slate-700">{w.date_of_birth || '-'}</td>
                                                                <td className="px-4 py-3 text-[12px] text-slate-700">{w.nida || '-'}</td>
                                                                <td className="px-4 py-3">
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {Object.entries(w.documents || {}).map(([type, doc]) => (
                                                                            <button
                                                                                key={type}
                                                                                type="button"
                                                                                onClick={() => openDoc(w, doc)}
                                                                                className={
                                                                                    'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold ' +
                                                                                    statusBadge(doc.status)
                                                                                }
                                                                            >
                                                                                <span className={"h-2 w-2 rounded-full " + statusDot(doc.status)} />
                                                                                <span>{docLabels[type] || type}</span>
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-3 text-right">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => deleteWorker(w)}
                                                                        disabled={busy}
                                                                        className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[12px] font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {editDocOpen ? (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <button
                            type="button"
                            className="absolute inset-0 bg-slate-900/40"
                            onClick={closeDoc}
                            aria-label="Close"
                        />
                        <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                            <div className="border-b border-slate-200 px-5 py-4">
                                <div className="text-sm font-semibold text-slate-900">Document verification</div>
                                <div className="mt-1 text-[12px] text-slate-600">
                                    {editDoc?.worker?.name} • {docLabels[editDoc?.doc?.type] || editDoc?.doc?.type}
                                </div>
                            </div>

                            <div className="p-5">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div>
                                        <label className="text-[11px] font-semibold text-slate-700">Status</label>
                                        <select
                                            value={editDocForm.status}
                                            onChange={(e) => setEditDocForm((p) => ({ ...p, status: e.target.value }))}
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="verified">Verified</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-semibold text-slate-700">Expiry date</label>
                                        <input
                                            type="date"
                                            value={editDocForm.expiry_date}
                                            onChange={(e) => setEditDocForm((p) => ({ ...p, expiry_date: e.target.value }))}
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="text-[11px] font-semibold text-slate-700">Notes</label>
                                        <textarea
                                            value={editDocForm.notes}
                                            onChange={(e) => setEditDocForm((p) => ({ ...p, notes: e.target.value }))}
                                            rows={4}
                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                            placeholder="Optional notes..."
                                        />
                                    </div>
                                </div>

                                <div className="mt-5 flex items-center justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={closeDoc}
                                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-900 hover:bg-slate-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={saveDoc}
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
