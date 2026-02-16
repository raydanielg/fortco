import AdminPanelLayout from '@/Layouts/AdminPanelLayout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

export default function Planning() {
    const page = usePage();
    const url = page.url || '';

    const roles = page.props.auth?.roles || [];
    const canApprove = roles.includes('Super Admin') || roles.includes('Admin');
    const userId = page.props.auth?.user?.id;

    const currentYear = useMemo(() => new Date().getFullYear(), []);
    const [year, setYear] = useState(currentYear);

    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [tasks, setTasks] = useState([]);

    const [openCreate, setOpenCreate] = useState(false);
    const [title, setTitle] = useState('');

    const items = [
        { key: 'employee', label: 'Employee', href: route('admin.tasks.employee') },
        { key: 'assessment', label: 'Assessment', href: route('admin.tasks.assessment') },
        { key: 'evaluation', label: 'Evaluation', href: route('admin.tasks.evaluation') },
        { key: 'task', label: 'Task', href: route('admin.tasks.task') },
        { key: 'planning', label: 'Planning', href: route('admin.tasks.planning') },
    ];

    const active = items.find((i) => url.includes(`/admin/tasks/${i.key}`))?.key || 'planning';
    const activeLabel = items.find((i) => i.key === active)?.label || 'Planning';

    const csrf = () => document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    const readJson = async (r) => {
        const t = await r.text();
        try {
            return t ? JSON.parse(t) : {};
        } catch (e) {
            return {};
        }
    };

    const rollbackTask = (t) => {
        if (!t?.id) return;
        setBusy(true);
        setError('');
        fetch(route('admin.tasks.rollback', { task: t.id }), {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': csrf(),
                'X-Requested-With': 'XMLHttpRequest',
                Accept: 'application/json',
            },
        })
            .then(async (r) => {
                const j = await readJson(r);
                if (!r.ok) throw new Error(j?.message || 'Failed');
                const updated = j?.task;
                if (updated?.id) {
                    setTasks((prev) => prev.map((x) => (x.id === updated.id ? { ...x, ...updated } : x)));
                } else {
                    load(year);
                }
            })
            .catch((e) => setError(e?.message || 'Failed'))
            .finally(() => setBusy(false));
    };

    const submitForApproval = (t) => {
        if (!t?.id) return;
        setBusy(true);
        setError('');
        fetch(route('admin.tasks.submit', { task: t.id }), {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': csrf(),
                'X-Requested-With': 'XMLHttpRequest',
                Accept: 'application/json',
            },
        })
            .then(async (r) => {
                const j = await readJson(r);
                if (!r.ok) throw new Error(j?.message || 'Failed');
                const updated = j?.task;
                if (updated?.id) {
                    setTasks((prev) => prev.map((x) => (x.id === updated.id ? { ...x, ...updated } : x)));
                } else {
                    load(year);
                }
            })
            .catch((e) => setError(e?.message || 'Failed'))
            .finally(() => setBusy(false));
    };

    const load = (y) => {
        setBusy(true);
        setError('');
        fetch(route('admin.tasks.planning.data', { year: y }), {
            headers: { Accept: 'application/json' },
        })
            .then(async (r) => {
                const j = await readJson(r);
                if (!r.ok) throw new Error(j?.message || 'Failed');
                setTasks(j?.tasks || []);
            })
            .catch((e) => setError(e?.message || 'Failed to load'))
            .finally(() => setBusy(false));
    };

    useEffect(() => {
        load(year);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [year]);

    const submitCreate = () => {
        if (!title.trim()) return;
        setBusy(true);
        setError('');
        fetch(route('admin.tasks.store'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf(),
                Accept: 'application/json',
            },
            body: JSON.stringify({ title: title.trim(), year }),
        })
            .then(async (r) => {
                const j = await readJson(r);
                if (!r.ok) throw new Error(j?.message || 'Failed');
                setOpenCreate(false);
                setTitle('');
                load(year);
            })
            .catch((e) => setError(e?.message || 'Failed'))
            .finally(() => setBusy(false));
    };

    const approveTask = (t) => {
        if (!t?.id) return;
        setBusy(true);
        setError('');
        fetch(route('admin.tasks.approve', { task: t.id }), {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': csrf(),
                'X-Requested-With': 'XMLHttpRequest',
                Accept: 'application/json',
            },
        })
            .then(async (r) => {
                const j = await readJson(r);
                if (!r.ok) throw new Error(j?.message || 'Failed');
                const updated = j?.task;
                if (updated?.id) {
                    setTasks((prev) => prev.map((x) => (x.id === updated.id ? { ...x, ...updated } : x)));
                } else {
                    load(year);
                }
            })
            .catch((e) => setError(e?.message || 'Failed'))
            .finally(() => setBusy(false));
    };

    const years = useMemo(() => {
        const ys = [];
        for (let i = currentYear - 3; i <= currentYear + 1; i += 1) ys.push(i);
        return ys;
    }, [currentYear]);

    return (
        <>
            <Head title={activeLabel} />
            <AdminPanelLayout title="Tasks" active={active} items={items}>
                <div className="bg-white border-b border-slate-200">
                    <div className="px-6 py-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="text-sm font-semibold text-slate-900">Planning</div>
                                <div className="mt-1 text-[12px] text-slate-500">Home / Tasks / Planning</div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Year</div>
                                    <select
                                        value={year}
                                        onChange={(e) => setYear(Number(e.target.value))}
                                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-900"
                                    >
                                        {years.map((y) => (
                                            <option key={y} value={y}>
                                                {y}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setOpenCreate(true)}
                                    className="bg-blue-900 text-white px-4 py-2 rounded-lg text-[12px] font-semibold hover:bg-blue-800 transition shadow-sm"
                                >
                                    Create Task
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {error ? (
                        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">
                            {error}
                        </div>
                    ) : null}

                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-xl">
                            <div className="text-[12px] font-semibold text-slate-700">Tasks for {year}</div>
                            <div className="text-[12px] text-slate-500">{busy ? 'Loading…' : `${tasks.length} tasks`}</div>
                        </div>

                        <div className="min-w-full">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                                        <th className="px-6 py-4 border-r border-slate-100 w-16">No.</th>
                                        <th className="px-6 py-4 border-r border-slate-100">Task</th>
                                        <th className="px-6 py-4 border-r border-slate-100">Submitted By</th>
                                        <th className="px-6 py-4 border-r border-slate-100 text-center w-32">Submitted At</th>
                                        <th className="px-6 py-4 border-r border-slate-100 text-center w-32">Sub Tasks</th>
                                        <th className="px-6 py-4 border-r border-slate-100 text-center w-32">Approved</th>
                                        <th className="px-6 py-4 border-r border-slate-100 text-center w-32">Approved At</th>
                                        <th className="px-6 py-4 border-r border-slate-100">Approved By</th>
                                        <th className="px-6 py-4 text-center w-36">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {tasks.length ? (
                                        tasks.map((t, idx) => (
                                            <tr key={t.id} className="hover:bg-slate-50/50 transition">
                                                <td className="px-6 py-4 border-r border-slate-100 text-sm text-slate-600 font-medium">{idx + 1}</td>
                                                <td className="px-6 py-4 border-r border-slate-100">
                                                    <div className="text-sm font-semibold text-slate-900">{t.title}</div>
                                                </td>
                                                <td className="px-6 py-4 border-r border-slate-100">
                                                    <div className="text-[12px] font-semibold text-slate-700">{t.creator?.name || '—'}</div>
                                                </td>
                                                <td className="px-6 py-4 border-r border-slate-100 text-center text-[12px] text-slate-600">
                                                    {t.created_at ? new Date(t.created_at).toLocaleDateString() : '—'}
                                                </td>
                                                <td className="px-6 py-4 border-r border-slate-100 text-center">
                                                    <div className="inline-flex items-center justify-center rounded-full bg-indigo-50 text-indigo-700 px-3 py-1 text-[11px] font-bold border border-indigo-100">
                                                        {t.sub_tasks_count || 0}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 border-r border-slate-100 text-center">
                                                    {t.status === 'approved' ? (
                                                        <div className="inline-flex items-center justify-center rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-[11px] font-bold border border-emerald-100">
                                                            APPROVED
                                                        </div>
                                                    ) : t.status === 'rolled_back' ? (
                                                        <div className="inline-flex items-center justify-center rounded-full bg-red-50 text-red-700 px-3 py-1 text-[11px] font-bold border border-red-100">
                                                            ROLLED BACK
                                                        </div>
                                                    ) : (
                                                        <div className="inline-flex items-center justify-center rounded-full bg-amber-50 text-amber-700 px-3 py-1 text-[11px] font-bold border border-amber-100">
                                                            SUBMITTED
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 border-r border-slate-100 text-center text-[12px] text-slate-600">
                                                    {t.approved_at ? new Date(t.approved_at).toLocaleDateString() : '—'}
                                                </td>
                                                <td className="px-6 py-4 border-r border-slate-100">
                                                    <div className="text-[12px] font-semibold text-slate-700">{t.status === 'approved' ? (t.approver?.name || '—') : '—'}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center">
                                                        <div className="flex items-center gap-2">
                                                            {canApprove && t.status === 'submitted' ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => approveTask(t)}
                                                                    disabled={busy}
                                                                    className="rounded-lg px-4 py-2 text-[12px] font-semibold transition border bg-blue-900 text-white border-blue-900 hover:bg-blue-800"
                                                                >
                                                                    Approve
                                                                </button>
                                                            ) : null}

                                                            {canApprove && t.status === 'approved' ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => rollbackTask(t)}
                                                                    disabled={busy}
                                                                    className="rounded-lg px-4 py-2 text-[12px] font-semibold transition border bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                                                                >
                                                                    Rollback
                                                                </button>
                                                            ) : null}

                                                            {t.status === 'rolled_back' && (t.created_by === userId || canApprove) ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => submitForApproval(t)}
                                                                    disabled={busy}
                                                                    className="rounded-lg px-4 py-2 text-[12px] font-semibold transition border bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                                                                >
                                                                    Resubmit
                                                                </button>
                                                            ) : null}

                                                            {!canApprove && t.status !== 'rolled_back' ? (
                                                                <div className="text-[12px] text-slate-400">—</div>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9" className="px-6 py-12 text-center text-sm text-slate-500 italic">
                                                {busy ? 'Loading…' : 'No tasks for this year.'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-[12px] text-slate-600">
                        Approved tasks are ready for evaluation. Unapproved tasks cannot proceed to evaluation.
                    </div>
                </div>

                {openCreate ? (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h3 className="font-bold text-slate-900">Create Task ({year})</h3>
                                <button onClick={() => setOpenCreate(false)} className="text-slate-400 hover:text-slate-600 transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-6">
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Task</label>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition outline-none"
                                    placeholder="Enter task"
                                    autoFocus
                                />
                            </div>
                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                                <button onClick={() => setOpenCreate(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition">
                                    Cancel
                                </button>
                                <button
                                    onClick={submitCreate}
                                    disabled={busy || !title.trim()}
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
