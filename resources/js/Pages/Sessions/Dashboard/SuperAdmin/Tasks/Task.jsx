import AdminPanelLayout from '@/Layouts/AdminPanelLayout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Task() {
    const page = usePage();
    const url = page.url || '';

    const [tasks, setTasks] = useState([]);
    const [busy, setBusy] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [form, setForm] = useState({ title: '', description: '' });
    const [openEdit, setOpenEdit] = useState(false);
    const [editTaskId, setEditTaskId] = useState('');
    const [editTitle, setEditTitle] = useState('');

    const [openSubCreate, setOpenSubCreate] = useState(false);
    const [subParentId, setSubParentId] = useState('');
    const [subTitle, setSubTitle] = useState('');

    const items = [
        { key: 'employee', label: 'Employee', href: route('admin.tasks.employee') },
        { key: 'assessment', label: 'Assessment', href: route('admin.tasks.assessment') },
        { key: 'evaluation', label: 'Evaluation', href: route('admin.tasks.evaluation') },
        { key: 'task', label: 'Task', href: route('admin.tasks.task') },
        { key: 'planning', label: 'Planning', href: route('admin.tasks.planning') },
    ];

    const active = items.find((i) => url.includes(`/admin/tasks/${i.key}`))?.key || 'task';
    const activeLabel = items.find((i) => i.key === active)?.label || 'Task';

    const csrf = () => document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    const isLocked = (t) => ['submitted', 'approved'].includes(String(t?.status || '').toLowerCase());

    const readJson = async (r) => {
        const t = await r.text();
        try {
            return t ? JSON.parse(t) : {};
        } catch (e) {
            return {};
        }
    };

    const loadTasks = () => {
        setBusy(true);
        fetch(route('admin.tasks.data'), {
            headers: { Accept: 'application/json' },
        })
            .then((r) => r.json())
            .then((data) => setTasks(data.tasks || []))
            .finally(() => setBusy(false));
    };

    const openEditFor = (t) => {
        if (!t?.id) return;
        setEditTaskId(String(t.id));
        setEditTitle(String(t.title || ''));
        setOpenEdit(true);
    };

    const submitEdit = () => {
        if (!editTaskId) return;
        setBusy(true);
        fetch(route('admin.tasks.update', { task: editTaskId }), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf(),
                Accept: 'application/json',
            },
            body: JSON.stringify({ title: editTitle }),
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed');
                setOpenEdit(false);
                setEditTaskId('');
                setEditTitle('');
                loadTasks();
            })
            .catch(() => {
            })
            .finally(() => setBusy(false));
    };

    const deleteTask = (t) => {
        if (!t?.id) return;
        if (!window.confirm('Delete this task?')) return;
        setBusy(true);
        fetch(route('admin.tasks.destroy', { task: t.id }), {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': csrf(),
                Accept: 'application/json',
            },
        })
            .then(async (r) => {
                if (!r.ok) return;
                loadTasks();
            })
            .finally(() => setBusy(false));
    };

    const openSubCreateFor = (t) => {
        if (!t?.id) return;
        setSubParentId(String(t.id));
        setSubTitle('');
        setOpenSubCreate(true);
    };

    const submitSubCreate = () => {
        if (!subParentId || !subTitle.trim()) return;
        setBusy(true);
        fetch(route('admin.tasks.sub-tasks.store', { task: subParentId }), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf(),
                Accept: 'application/json',
            },
            body: JSON.stringify({ title: subTitle.trim() }),
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed');
                setOpenSubCreate(false);
                setSubParentId('');
                setSubTitle('');
            })
            .catch(() => {
            })
            .finally(() => setBusy(false));
    };


    useEffect(() => {
        loadTasks();
    }, []);

    const submitCreate = () => {
        setBusy(true);
        fetch(route('admin.tasks.store'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf(),
                Accept: 'application/json',
            },
            body: JSON.stringify({ title: form.title }),
        })
            .then((r) => r.json())
            .then(() => {
                setOpenCreate(false);
                setForm({ title: '' });
                loadTasks();
            })
            .finally(() => setBusy(false));
    };

    return (
        <>
            <Head title={activeLabel} />
            <AdminPanelLayout title="Tasks" active={active} items={items}>
                <div className="bg-[#f8fafc] min-h-screen">
                    {/* Page Header */}
                    <div className="bg-white border-b border-slate-200">
                        <div className="px-6 py-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-xl font-bold text-slate-900">Annual Institutional Performance Plan Update</h1>
                                    <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                                        <span>Home</span>
                                        <span>/</span>
                                        <span className="font-medium text-slate-900">Task</span>
                                    </div>
                                </div>
                                <button className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-900 text-white hover:bg-blue-800 transition shadow-sm">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                            {/* Table Header Action */}
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-end bg-slate-50/50 rounded-t-xl">
                                <button
                                    onClick={() => setOpenCreate(true)}
                                    className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition shadow-sm"
                                >
                                    Create Task
                                </button>
                            </div>

                            <div className="min-w-full">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                                            <th className="px-6 py-4 border-r border-slate-100 w-16">No.</th>
                                            <th className="px-6 py-4 border-r border-slate-100">Task</th>
                                            <th className="px-6 py-4 border-r border-slate-100 text-center w-32">Status</th>
                                            <th className="px-6 py-4 text-center w-24">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {tasks.length > 0 ? (
                                            tasks.map((task, idx) => (
                                                <tr key={task.id} className="hover:bg-slate-50/50 transition">
                                                    <td className="px-6 py-4 border-r border-slate-100 text-sm text-slate-600 font-medium">
                                                        {idx + 1}
                                                    </td>
                                                    <td className="px-6 py-4 border-r border-slate-100">
                                                        <div className="text-sm font-semibold text-slate-900">{task.title}</div>
                                                        {task.description && (
                                                            <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{task.description}</div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 border-r border-slate-100">
                                                        <div className="flex justify-center">
                                                            <div className="relative inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border border-blue-100">
                                                                {String(task.status || 'submitted').toUpperCase()}
                                                                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] text-white font-black shadow-sm border border-white">
                                                                    {task.sub_tasks_count || 0}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-center gap-3">
                                                            <button
                                                                type="button"
                                                                onClick={() => openSubCreateFor(task)}
                                                                title="Create Sub Task"
                                                                disabled={busy || isLocked(task)}
                                                                className={
                                                                    'h-8 w-8 flex items-center justify-center rounded-lg shadow-sm border transition ' +
                                                                    (isLocked(task)
                                                                        ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
                                                                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100')
                                                                }
                                                            >
                                                                <span className="text-lg font-bold">+</span>
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => window.location.href = route('admin.tasks.sub-task', { task: task.id })}
                                                                title="View Sub Tasks"
                                                                className="h-8 w-8 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition shadow-sm border border-indigo-100"
                                                            >
                                                                <span className="text-sm font-bold">≡</span>
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => openEditFor(task)}
                                                                title="Edit Task"
                                                                disabled={busy || isLocked(task)}
                                                                className={
                                                                    'h-8 w-8 flex items-center justify-center rounded-lg shadow-sm border transition ' +
                                                                    (isLocked(task)
                                                                        ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
                                                                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-100')
                                                                }
                                                            >
                                                                <span className="text-sm">✎</span>
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => deleteTask(task)}
                                                                title="Delete Task"
                                                                disabled={busy || isLocked(task)}
                                                                className={
                                                                    'h-8 w-8 flex items-center justify-center rounded-lg shadow-sm border transition ' +
                                                                    (isLocked(task)
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
                                                <td colSpan="4" className="px-6 py-12 text-center text-sm text-slate-500 italic">
                                                    No tasks found. Click "Create Task" to add one.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Create Modal */}
                {openCreate && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h3 className="font-bold text-slate-900">New Task</h3>
                                <button onClick={() => setOpenCreate(false)} className="text-slate-400 hover:text-slate-600 transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Task</label>
                                    <input
                                        value={form.title}
                                        onChange={(e) => setForm({ title: e.target.value })}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition outline-none"
                                        placeholder="Enter task name here..."
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                                <button onClick={() => setOpenCreate(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition">
                                    Cancel
                                </button>
                                <button
                                    onClick={submitCreate}
                                    disabled={busy || !form.title}
                                    className="bg-blue-900 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition disabled:opacity-50"
                                >
                                    {busy ? 'Saving...' : 'Save Task'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {openEdit && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h3 className="font-bold text-slate-900">Edit Task</h3>
                                <button onClick={() => setOpenEdit(false)} className="text-slate-400 hover:text-slate-600 transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-6">
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Task</label>
                                <input
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition outline-none"
                                    placeholder="Task name"
                                    autoFocus
                                />
                            </div>
                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                                <button onClick={() => setOpenEdit(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition">
                                    Cancel
                                </button>
                                <button
                                    onClick={submitEdit}
                                    disabled={busy || !editTitle.trim()}
                                    className="bg-blue-900 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition disabled:opacity-50"
                                >
                                    {busy ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {openSubCreate && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h3 className="font-bold text-slate-900">Create Sub Task</h3>
                                <button onClick={() => setOpenSubCreate(false)} className="text-slate-400 hover:text-slate-600 transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-6">
                                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Sub Task</label>
                                <input
                                    value={subTitle}
                                    onChange={(e) => setSubTitle(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition outline-none"
                                    placeholder="Enter sub task"
                                    autoFocus
                                />
                            </div>
                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                                <button onClick={() => setOpenSubCreate(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition">
                                    Cancel
                                </button>
                                <button
                                    onClick={submitSubCreate}
                                    disabled={busy || !subTitle.trim()}
                                    className="bg-blue-900 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition disabled:opacity-50"
                                >
                                    {busy ? 'Saving...' : 'Create'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </AdminPanelLayout>
        </>
    );
}
