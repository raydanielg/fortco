import AdminPanelLayout from '@/Layouts/AdminPanelLayout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

export default function SubTask() {
    const page = usePage();
    const url = page.url || '';

    const parentId = useMemo(() => {
        const m = String(url).match(/\/admin\/tasks\/(\d+)\/sub-task/);
        return m?.[1] || '';
    }, [url]);

    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const [parent, setParent] = useState(null);
    const [q, setQ] = useState('');
    const [rows, setRows] = useState([]);

    const [openCreate, setOpenCreate] = useState(false);
    const [createTitle, setCreateTitle] = useState('');

    const [openEdit, setOpenEdit] = useState(false);
    const [editId, setEditId] = useState('');
    const [editTitle, setEditTitle] = useState('');

    const isLocked = (t) => ['submitted', 'approved'].includes(String(t?.status || '').toLowerCase());

    const csrf = () => document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    const readJson = async (r) => {
        const t = await r.text();
        try {
            return t ? JSON.parse(t) : {};
        } catch (e) {
            return {};
        }
    };

    const load = () => {
        if (!parentId) return;
        setBusy(true);
        setError('');

        Promise.all([
            fetch(route('admin.tasks.show', { task: parentId }), {
                headers: { Accept: 'application/json' },
                credentials: 'same-origin',
            }).then(async (r) => {
                const j = await readJson(r);
                if (!r.ok) throw new Error(j?.message || 'Failed to load task');
                return j?.task || null;
            }),
            fetch(route('admin.tasks.sub-tasks', { task: parentId }), {
                headers: { Accept: 'application/json' },
                credentials: 'same-origin',
            }).then(async (r) => {
                const j = await readJson(r);
                if (!r.ok) throw new Error(j?.message || 'Failed to load sub tasks');
                return Array.isArray(j?.sub_tasks) ? j.sub_tasks : [];
            }),
        ])
            .then(([t, subs]) => {
                setParent(t);
                setRows(subs);
            })
            .catch((e) => setError(e?.message || 'Failed to load'))
            .finally(() => setBusy(false));
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parentId]);

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();
        if (!query) return rows;
        return rows.filter((r) => String(r?.title || '').toLowerCase().includes(query));
    }, [rows, q]);

    const createSub = () => {
        if (!createTitle.trim() || !parentId) return;
        setBusy(true);
        setError('');
        fetch(route('admin.tasks.sub-tasks.store', { task: parentId }), {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf(),
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: createTitle.trim() }),
        })
            .then(async (r) => {
                const j = await readJson(r);
                if (!r.ok) throw new Error(j?.message || 'Failed');
                setOpenCreate(false);
                setCreateTitle('');
                load();
            })
            .catch((e) => setError(e?.message || 'Failed'))
            .finally(() => setBusy(false));
    };

    const openEditFor = (s) => {
        if (!s?.id) return;
        setEditId(String(s.id));
        setEditTitle(String(s.title || ''));
        setOpenEdit(true);
    };

    const submitEdit = () => {
        if (!editId || !editTitle.trim()) return;
        setBusy(true);
        setError('');
        fetch(route('admin.tasks.update', { task: editId }), {
            method: 'PUT',
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf(),
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: editTitle.trim() }),
        })
            .then(async (r) => {
                const j = await readJson(r);
                if (!r.ok) throw new Error(j?.message || 'Failed');
                setOpenEdit(false);
                setEditId('');
                setEditTitle('');
                load();
            })
            .catch((e) => setError(e?.message || 'Failed'))
            .finally(() => setBusy(false));
    };

    const deleteSub = (s) => {
        if (!s?.id) return;
        if (!window.confirm('Delete this sub task?')) return;
        setBusy(true);
        setError('');
        fetch(route('admin.tasks.destroy', { task: s.id }), {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf(),
                Accept: 'application/json',
            },
        })
            .then(async (r) => {
                if (!r.ok) return;
                load();
            })
            .finally(() => setBusy(false));
    };

    const items = [
        { key: 'employee', label: 'Employee', href: route('admin.tasks.employee') },
        { key: 'assessment', label: 'Assessment', href: route('admin.tasks.assessment') },
        { key: 'evaluation', label: 'Evaluation', href: route('admin.tasks.evaluation') },
        { key: 'task', label: 'Task', href: route('admin.tasks.task') },
        { key: 'planning', label: 'Planning', href: route('admin.tasks.planning') },
    ];

    return (
        <>
            <Head title="Sub Task" />
            <AdminPanelLayout title="Tasks" active="task" items={items}>
                <div className="bg-[#f8fafc] min-h-screen">
                    <div className="bg-white border-b border-slate-200">
                        <div className="px-6 py-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-xl font-bold text-slate-900">Sub Task</h1>
                                    <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                                        <span>Home</span>
                                        <span>/</span>
                                        <span className="font-medium text-slate-900">Sub Task</span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-900 text-white hover:bg-blue-800 transition shadow-sm"
                                    aria-label="Back"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        {error ? (
                            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">
                                {error}
                            </div>
                        ) : null}

                        <div className="flex items-center justify-between gap-3 mb-4">
                            <div className="text-[12px] font-semibold text-slate-700">
                                Task: <span className="text-slate-900">{parent?.title || '—'}</span>
                            </div>
                        </div>

                        <div className="mb-3">
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Search"
                                className="w-full max-w-md rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                            />
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                            {/* Table Header Action */}
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-end bg-slate-50/50 rounded-t-xl">
                                <button
                                    onClick={() => setOpenCreate(true)}
                                    className="bg-blue-900 text-white px-4 py-2 rounded-lg text-[12px] font-semibold hover:bg-blue-800 transition shadow-sm"
                                >
                                    + Add New
                                </button>
                            </div>

                            <div className="min-w-full">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                                            <th className="px-6 py-4 border-r border-slate-100 w-16">No.</th>
                                            <th className="px-6 py-4 border-r border-slate-100">Sub Task</th>
                                            <th className="px-6 py-4 border-r border-slate-100 text-center w-32">Status</th>
                                            <th className="px-6 py-4 border-r border-slate-100 text-center w-32">Start Date</th>
                                            <th className="px-6 py-4 border-r border-slate-100 text-center w-32">End Date</th>
                                            <th className="px-6 py-4 text-center w-24">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filtered.length ? (
                                            filtered.map((s, idx) => (
                                                <tr key={s.id} className="hover:bg-slate-50/50 transition">
                                                    <td className="px-6 py-4 border-r border-slate-100 text-sm text-slate-600 font-medium">{idx + 1}</td>
                                                    <td className="px-6 py-4 border-r border-slate-100">
                                                        <div className="text-sm font-semibold text-slate-900">{s.title}</div>
                                                    </td>
                                                    <td className="px-6 py-4 border-r border-slate-100">
                                                        <div className="flex justify-center">
                                                            <div className="relative inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border border-blue-100">
                                                                {String(s.status || 'submitted').toUpperCase()}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 border-r border-slate-100 text-center text-[12px] text-slate-500">—</td>
                                                    <td className="px-6 py-4 border-r border-slate-100 text-center text-[12px] text-slate-500">—</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-center gap-3">
                                                            <button
                                                                type="button"
                                                                onClick={() => openEditFor(s)}
                                                                title="Edit Sub Task"
                                                                disabled={busy || isLocked(s)}
                                                                className={
                                                                    'h-8 w-8 flex items-center justify-center rounded-lg shadow-sm border transition ' +
                                                                    (isLocked(s)
                                                                        ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
                                                                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-100')
                                                                }
                                                            >
                                                                <span className="text-sm">✎</span>
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => deleteSub(s)}
                                                                title="Delete Sub Task"
                                                                disabled={busy || isLocked(s)}
                                                                className={
                                                                    'h-8 w-8 flex items-center justify-center rounded-lg shadow-sm border transition ' +
                                                                    (isLocked(s)
                                                                        ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
                                                                        : 'bg-red-50 text-red-700 hover:bg-red-100 border-red-100')
                                                                }
                                                            >
                                                                <span className="text-sm">🗑</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500 italic">
                                                    {busy ? 'Loading…' : 'No sub tasks found.'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {openCreate ? (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h3 className="font-bold text-slate-900">Create Sub Task</h3>
                                <button onClick={() => setOpenCreate(false)} className="text-slate-400 hover:text-slate-600 transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-6">
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Sub Task</label>
                                <input
                                    value={createTitle}
                                    onChange={(e) => setCreateTitle(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition outline-none"
                                    placeholder="Enter sub task"
                                    autoFocus
                                />
                            </div>
                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                                <button onClick={() => setOpenCreate(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition">Cancel</button>
                                <button
                                    onClick={createSub}
                                    disabled={busy || !createTitle.trim()}
                                    className="bg-blue-900 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition disabled:opacity-50"
                                >
                                    {busy ? 'Saving…' : 'Create'}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : null}

                {openEdit ? (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h3 className="font-bold text-slate-900">Edit Sub Task</h3>
                                <button onClick={() => setOpenEdit(false)} className="text-slate-400 hover:text-slate-600 transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-6">
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Sub Task</label>
                                <input
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition outline-none"
                                    placeholder="Sub task"
                                    autoFocus
                                />
                            </div>
                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                                <button onClick={() => setOpenEdit(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition">Cancel</button>
                                <button
                                    onClick={submitEdit}
                                    disabled={busy || !editTitle.trim()}
                                    className="bg-blue-900 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition disabled:opacity-50"
                                >
                                    {busy ? 'Saving…' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : null}
            </AdminPanelLayout>
        </>
    );
}
