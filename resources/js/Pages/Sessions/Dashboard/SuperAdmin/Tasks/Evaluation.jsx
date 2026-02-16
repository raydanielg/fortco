import AdminPanelLayout from '@/Layouts/AdminPanelLayout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

export default function Evaluation() {
    const page = usePage();
    const url = page.url || '';

    const currentYear = useMemo(() => new Date().getFullYear(), []);
    const [year, setYear] = useState(currentYear);

    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [tasks, setTasks] = useState([]);

    const [openEval, setOpenEval] = useState(false);
    const [activeTab, setActiveTab] = useState('evaluate');
    const [selectedTask, setSelectedTask] = useState(null);
    const [history, setHistory] = useState([]);
    const [total, setTotal] = useState(0);
    const [remaining, setRemaining] = useState(100);
    const [percent, setPercent] = useState('');

    const items = [
        { key: 'employee', label: 'Employee', href: route('admin.tasks.employee') },
        { key: 'assessment', label: 'Assessment', href: route('admin.tasks.assessment') },
        { key: 'evaluation', label: 'Evaluation', href: route('admin.tasks.evaluation') },
        { key: 'task', label: 'Task', href: route('admin.tasks.task') },
        { key: 'planning', label: 'Planning', href: route('admin.tasks.planning') },
    ];

    const active = items.find((i) => url.includes(`/admin/tasks/${i.key}`))?.key || 'evaluation';
    const activeLabel = items.find((i) => i.key === active)?.label || 'Evaluation';

    const readJson = async (r) => {
        const t = await r.text();
        try {
            return t ? JSON.parse(t) : {};
        } catch (e) {
            return {};
        }
    };

    const csrf = () => document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    const load = (y) => {
        setBusy(true);
        setError('');
        fetch(route('admin.tasks.evaluation.data', { year: y }), {
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

    const years = useMemo(() => {
        const ys = [];
        for (let i = currentYear - 3; i <= currentYear + 1; i += 1) ys.push(i);
        return ys;
    }, [currentYear]);

    const loadHistory = (taskId) => {
        if (!taskId) return;
        setBusy(true);
        setError('');
        fetch(route('admin.tasks.evaluation.history', { task: taskId }), {
            headers: { Accept: 'application/json' },
        })
            .then(async (r) => {
                const j = await readJson(r);
                if (!r.ok) throw new Error(j?.message || 'Failed');
                setHistory(j?.history || []);
                setTotal(j?.total || 0);
                setRemaining(j?.remaining ?? 100);
            })
            .catch((e) => setError(e?.message || 'Failed to load'))
            .finally(() => setBusy(false));
    };

    const openEvaluation = (t) => {
        setSelectedTask(t);
        setActiveTab('evaluate');
        setPercent('');
        setHistory([]);
        setTotal(0);
        setRemaining(100);
        setOpenEval(true);
        loadHistory(t?.id);
    };

    const submitPercent = () => {
        if (!selectedTask?.id) return;
        const p = Number(percent);
        if (!Number.isFinite(p) || p <= 0) return;

        setBusy(true);
        setError('');
        fetch(route('admin.tasks.evaluation.store', { task: selectedTask.id }), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf(),
                'X-Requested-With': 'XMLHttpRequest',
                Accept: 'application/json',
            },
            body: JSON.stringify({ percent: p }),
        })
            .then(async (r) => {
                const j = await readJson(r);
                if (!r.ok) throw new Error(j?.message || 'Failed');
                setHistory(j?.history || []);
                setTotal(j?.total || 0);
                setRemaining(j?.remaining ?? 0);
                setPercent('');
                setActiveTab('history');
            })
            .catch((e) => setError(e?.message || 'Failed'))
            .finally(() => setBusy(false));
    };

    return (
        <>
            <Head title={activeLabel} />
            <AdminPanelLayout title="Tasks" active={active} items={items}>
                <div className="bg-white border-b border-slate-200">
                    <div className="px-6 py-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="text-sm font-semibold text-slate-900">Evaluation</div>
                                <div className="mt-1 text-[12px] text-slate-500">Home / Tasks / Evaluation</div>
                            </div>

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
                            <div className="text-[12px] font-semibold text-slate-700">Approved tasks for {year}</div>
                            <div className="text-[12px] text-slate-500">{busy ? 'Loading…' : `${tasks.length} tasks`}</div>
                        </div>

                        <div className="min-w-full">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                                        <th className="px-6 py-4 border-r border-slate-100 w-16">No.</th>
                                        <th className="px-6 py-4 border-r border-slate-100">Task</th>
                                        <th className="px-6 py-4 border-r border-slate-100 text-center w-32">Sub Tasks</th>
                                        <th className="px-6 py-4 border-r border-slate-100 text-center w-32">Approved</th>
                                        <th className="px-6 py-4 border-r border-slate-100 text-center w-32">Approved At</th>
                                        <th className="px-6 py-4 border-r border-slate-100 text-center w-32">Progress</th>
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
                                                <td className="px-6 py-4 border-r border-slate-100 text-center">
                                                    <div className="inline-flex items-center justify-center rounded-full bg-indigo-50 text-indigo-700 px-3 py-1 text-[11px] font-bold border border-indigo-100">
                                                        {t.sub_tasks_count || 0}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 border-r border-slate-100 text-center">
                                                    <div className="inline-flex items-center justify-center rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-[11px] font-bold border border-emerald-100">
                                                        APPROVED
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 border-r border-slate-100 text-center text-[12px] text-slate-600">
                                                    {t.approved_at ? new Date(t.approved_at).toLocaleDateString() : '—'}
                                                </td>
                                                <td className="px-6 py-4 border-r border-slate-100 text-center">
                                                    <div className="inline-flex items-center justify-center rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-[11px] font-bold border border-blue-100">
                                                        {Number(t.progress_percent || 0)}%
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center">
                                                        <button
                                                            type="button"
                                                            className="rounded-lg px-4 py-2 text-[12px] font-semibold transition border bg-blue-900 text-white border-blue-900 hover:bg-blue-800"
                                                            onClick={() => openEvaluation(t)}
                                                        >
                                                            Start Evaluation
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center text-sm text-slate-500 italic">
                                                {busy ? 'Loading…' : 'No approved tasks for this year.'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-[12px] text-slate-600">
                        Only approved tasks appear here. If a task is missing, submit it and approve it in Planning first.
                    </div>
                </div>

                {openEval ? (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
                        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div>
                                    <div className="text-[12px] font-bold text-slate-900">Evaluation</div>
                                    <div className="mt-0.5 text-[12px] text-slate-600 font-semibold">{selectedTask?.title || '—'}</div>
                                </div>
                                <button onClick={() => setOpenEval(false)} className="text-slate-400 hover:text-slate-600 transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="px-6 pt-4">
                                {error ? (
                                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">
                                        {error}
                                    </div>
                                ) : null}

                                <div className="flex items-center justify-between gap-3">
                                    <div className="text-[12px] text-slate-600">
                                        <span className="font-bold text-slate-900">Progress:</span> {total}%
                                        <span className="mx-2 text-slate-300">|</span>
                                        <span className="font-bold text-slate-900">Remaining:</span> {remaining}%
                                    </div>

                                    <div className="inline-flex rounded-xl border border-slate-200 bg-white overflow-hidden">
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('history')}
                                            className={
                                                'px-4 py-2 text-[12px] font-semibold transition ' +
                                                (activeTab === 'history' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50')
                                            }
                                        >
                                            History
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('evaluate')}
                                            className={
                                                'px-4 py-2 text-[12px] font-semibold transition border-l border-slate-200 ' +
                                                (activeTab === 'evaluate' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50')
                                            }
                                        >
                                            Evaluate
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                {activeTab === 'evaluate' ? (
                                    <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
                                        <div className="grid gap-4">
                                            <div className="grid gap-2">
                                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Percent</label>
                                                <input
                                                    value={percent}
                                                    onChange={(e) => setPercent(e.target.value)}
                                                    type="number"
                                                    min={Math.min(100, (Number(total) || 0) + 1)}
                                                    max={100}
                                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition outline-none"
                                                    placeholder={`Enter progress % (min ${(Number(total) || 0) + 1}, max 100)`}
                                                    disabled={busy || remaining <= 0}
                                                />
                                                <div className="text-[11px] text-slate-500">Date is automatic (today).</div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={submitPercent}
                                                    disabled={busy || remaining <= 0 || !String(percent).trim()}
                                                    className="rounded-lg px-5 py-2 text-[12px] font-semibold transition border bg-blue-900 text-white border-blue-900 hover:bg-blue-800 disabled:opacity-50"
                                                >
                                                    {remaining <= 0 ? 'Completed' : busy ? 'Saving…' : 'Save'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setActiveTab('history');
                                                        loadHistory(selectedTask?.id);
                                                    }}
                                                    className="rounded-lg px-5 py-2 text-[12px] font-semibold transition border border-slate-200 text-slate-700 hover:bg-slate-50"
                                                >
                                                    View History
                                                </button>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Progress</div>
                                            <div className="mt-4 grid gap-4 md:grid-cols-[140px,1fr] items-center">
                                                <div className="flex items-center justify-center">
                                                    <div className="relative h-28 w-28">
                                                        <svg viewBox="0 0 36 36" className="h-28 w-28">
                                                            <path
                                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                                fill="none"
                                                                stroke="#E2E8F0"
                                                                strokeWidth="3"
                                                            />
                                                            <path
                                                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                                fill="none"
                                                                stroke="#1E3A8A"
                                                                strokeWidth="3"
                                                                strokeDasharray={`${Math.min(100, Math.max(0, total))}, 100`}
                                                                strokeLinecap="round"
                                                            />
                                                        </svg>
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                            <div className="text-xl font-extrabold text-slate-900">{total}%</div>
                                                            <div className="text-[11px] font-semibold text-slate-500">done</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="flex items-center justify-between text-[12px]">
                                                        <div className="font-semibold text-slate-700">Progress trend</div>
                                                        <div className="text-slate-500">Last {Math.min(history.length, 7)} entries</div>
                                                    </div>

                                                    <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                                                        <svg viewBox="0 0 200 60" className="h-16 w-full">
                                                            {(() => {
                                                                const sorted = [...(history || [])].sort((a, b) => String(a.entry_date).localeCompare(String(b.entry_date)));
                                                                const last = sorted.slice(Math.max(0, sorted.length - 7));
                                                                const h = 60;
                                                                const w = 200;
                                                                const padTop = 6;
                                                                const padBottom = 10;
                                                                const plotH = h - padTop - padBottom;

                                                                const gridLines = [0, 25, 50, 75, 100];

                                                                const toY = (pct) => {
                                                                    const clamped = Math.min(100, Math.max(0, pct));
                                                                    return padTop + (1 - clamped / 100) * plotH;
                                                                };

                                                                const values = last.map((x) => Math.min(100, Math.max(0, Number(x.percent || 0))));

                                                                let pts = [];
                                                                if (values.length === 0) {
                                                                    pts = [`0,${toY(0)}`, `${w},${toY(0)}`];
                                                                } else if (values.length === 1) {
                                                                    pts = [`0,${toY(values[0])}`, `${w},${toY(values[0])}`];
                                                                } else {
                                                                    pts = values.map((v, i) => {
                                                                        const x = (i / (values.length - 1)) * w;
                                                                        const y = toY(v);
                                                                        return `${x},${y}`;
                                                                    });
                                                                }

                                                                const area = [...pts, `${w},${h - padBottom}`, `0,${h - padBottom}`].join(' ');

                                                                return (
                                                                    <>
                                                                        {gridLines.map((g) => {
                                                                            const y = toY(g);
                                                                            return <line key={g} x1="0" x2={w} y1={y} y2={y} stroke="#E2E8F0" strokeWidth="1" />;
                                                                        })}

                                                                        <polyline fill="rgba(30,58,138,0.08)" points={area} />
                                                                        <polyline fill="none" stroke="#1E3A8A" strokeWidth="2" points={pts.join(' ')} strokeLinecap="round" strokeLinejoin="round" />

                                                                        {values.length >= 2
                                                                            ? pts.map((p, idx) => {
                                                                                const [x, y] = p.split(',');
                                                                                return <circle key={idx} cx={x} cy={y} r="2.5" fill="#1E3A8A" />;
                                                                            })
                                                                            : null}
                                                                    </>
                                                                );
                                                            })()}
                                                        </svg>
                                                    </div>

                                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                                        <div className="rounded-xl border border-slate-200 p-3">
                                                            <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Remaining</div>
                                                            <div className="mt-1 text-lg font-extrabold text-slate-900">{remaining}%</div>
                                                        </div>
                                                        <div className="rounded-xl border border-slate-200 p-3">
                                                            <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Status</div>
                                                            <div className="mt-1 text-[12px] font-bold text-slate-900">
                                                                {remaining <= 0 ? 'Completed' : 'In Progress'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-slate-200 overflow-hidden">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50/50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                                                    <th className="px-6 py-4 border-r border-slate-100 w-16">No.</th>
                                                    <th className="px-6 py-4 border-r border-slate-100">Date</th>
                                                    <th className="px-6 py-4 text-center w-32">Percent</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {history.length ? (
                                                    history.map((h, idx) => (
                                                        <tr key={h.id} className="hover:bg-slate-50/50 transition">
                                                            <td className="px-6 py-4 border-r border-slate-100 text-sm text-slate-600 font-medium">{idx + 1}</td>
                                                            <td className="px-6 py-4 border-r border-slate-100 text-[12px] font-semibold text-slate-700">
                                                                {h.entry_date ? new Date(h.entry_date).toLocaleDateString() : '—'}
                                                            </td>
                                                            <td className="px-6 py-4 text-center">
                                                                <div className="inline-flex items-center justify-center rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-[11px] font-bold border border-blue-100">
                                                                    {h.percent}%
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="3" className="px-6 py-12 text-center text-sm text-slate-500 italic">
                                                            {busy ? 'Loading…' : 'No history yet. Add evaluation in Evaluate tab.'}
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : null}
            </AdminPanelLayout>
        </>
    );
}
