import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function Index() {
    const page = usePage();
    const me = page.props.auth?.user;

    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const [tickets, setTickets] = useState([]);
    const [q, setQ] = useState('');

    const [assignees, setAssignees] = useState([]);

    const [openCreate, setOpenCreate] = useState(false);
    const [create, setCreate] = useState({ subject: '', description: '', priority: 'normal', assignee_user_id: '' });

    const [selectedId, setSelectedId] = useState('');
    const [selected, setSelected] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');

    const listRef = useRef(null);

    const csrf = () => document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    const readJson = async (r) => {
        const t = await r.text();
        try {
            return t ? JSON.parse(t) : {};
        } catch (e) {
            return {};
        }
    };

    const loadTickets = () => {
        setBusy(true);
        setError('');
        fetch(route('support.tickets.data', { q }), {
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to load tickets');
                setTickets(Array.isArray(json?.tickets) ? json.tickets : []);
            })
            .catch((e) => setError(e?.message || 'Failed to load tickets'))
            .finally(() => setBusy(false));
    };

    const loadAssignees = () => {
        fetch(route('support.tickets.assignees'), {
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error('Failed');
                setAssignees(Array.isArray(json?.assignees) ? json.assignees : []);
            })
            .catch(() => setAssignees([]));
    };

    const loadTicket = (id) => {
        if (!id) return;
        setBusy(true);
        setError('');
        fetch(route('support.tickets.show', { ticket: id }), {
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to load ticket');
                setSelected(json?.ticket || null);
                setMessages(Array.isArray(json?.messages) ? json.messages : []);
            })
            .catch((e) => setError(e?.message || 'Failed to load ticket'))
            .finally(() => setBusy(false));
    };

    useEffect(() => {
        loadTickets();
        loadAssignees();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!listRef.current) return;
        listRef.current.scrollTop = listRef.current.scrollHeight;
    }, [messages.length]);

    const createTicket = () => {
        setBusy(true);
        setError('');
        fetch(route('support.tickets.store'), {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf(),
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                subject: create.subject,
                description: create.description,
                priority: create.priority,
                assignee_user_id: create.assignee_user_id || null,
            }),
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || json?.errors?.subject?.[0] || 'Failed to create ticket');
                setOpenCreate(false);
                setCreate({ subject: '', description: '', priority: 'normal', assignee_user_id: '' });
                loadTickets();
                if (json?.ticket_id) {
                    setSelectedId(String(json.ticket_id));
                    loadTicket(String(json.ticket_id));
                }
            })
            .catch((e) => setError(e?.message || 'Failed to create ticket'))
            .finally(() => setBusy(false));
    };

    const sendMessage = () => {
        const msg = text.trim();
        if (!msg || !selectedId) return;

        const optimistic = {
            id: `tmp-${Date.now()}`,
            message: msg,
            created_at: new Date().toISOString(),
            user: { id: me?.id, name: me?.name, email: me?.email },
        };

        setMessages((p) => [...p, optimistic]);
        setText('');

        setBusy(true);
        setError('');
        fetch(route('support.tickets.messages.store', { ticket: selectedId }), {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf(),
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: msg }),
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || json?.errors?.message?.[0] || 'Failed');
                loadTicket(selectedId);
                loadTickets();
            })
            .catch((e) => setError(e?.message || 'Failed to send'))
            .finally(() => setBusy(false));
    };

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();
        if (!query) return tickets;
        return tickets.filter((t) => {
            const sub = String(t?.subject || '').toLowerCase();
            const st = String(t?.status || '').toLowerCase();
            const pri = String(t?.priority || '').toLowerCase();
            return sub.includes(query) || st.includes(query) || pri.includes(query);
        });
    }, [tickets, q]);

    const statusBadge = (s) => {
        const v = String(s || 'open');
        const base = 'inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ';
        if (v === 'resolved' || v === 'closed') return base + 'bg-emerald-100 text-emerald-700';
        if (v === 'in_progress') return base + 'bg-amber-100 text-amber-700';
        return base + 'bg-slate-100 text-slate-700';
    };

    return (
        <DashboardLayout title="Tickets" breadcrumbs={['Support', 'Tickets']}>
            <Head title="Tickets" />

            {error ? <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">{error}</div> : null}

            {openCreate ? (
                <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/40 p-4">
                    <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                        <div className="border-b border-slate-200 px-6 py-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="text-sm font-semibold text-slate-900">Create ticket</div>
                                    <div className="mt-1 text-[12px] text-slate-500">Create a private ticket for support. Only you, the assignee, and Super Admin can view it.</div>
                                </div>
                                <button type="button" onClick={() => setOpenCreate(false)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50">
                                    Close
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label className="text-[11px] font-semibold text-slate-700">Subject</label>
                                    <input value={create.subject} onChange={(e) => setCreate((p) => ({ ...p, subject: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]" />
                                </div>

                                <div>
                                    <label className="text-[11px] font-semibold text-slate-700">Priority</label>
                                    <select value={create.priority} onChange={(e) => setCreate((p) => ({ ...p, priority: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]">
                                        <option value="low">Low</option>
                                        <option value="normal">Normal</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[11px] font-semibold text-slate-700">Target employee (optional)</label>
                                    <select value={create.assignee_user_id} onChange={(e) => setCreate((p) => ({ ...p, assignee_user_id: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]">
                                        <option value="">Super Admin / Unassigned</option>
                                        {assignees.map((a) => (
                                            <option key={a.id} value={a.id}>
                                                {a.name} {a.email ? `(${a.email})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="text-[11px] font-semibold text-slate-700">Description</label>
                                    <textarea value={create.description} onChange={(e) => setCreate((p) => ({ ...p, description: e.target.value }))} rows={4} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]" />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-6 py-4">
                            <button type="button" onClick={() => setOpenCreate(false)} disabled={busy} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60">
                                Cancel
                            </button>
                            <button type="button" onClick={createTicket} disabled={busy} className="rounded-xl bg-slate-900 px-4 py-2 text-[12px] font-semibold text-white hover:bg-slate-800 disabled:opacity-60">
                                {busy ? 'Saving…' : 'Create ticket'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            <div className="grid gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white lg:grid-cols-[380px,1fr]">
                <div className="border-b border-slate-200 lg:border-b-0 lg:border-r">
                    <div className="flex items-center justify-between px-4 py-3">
                        <div>
                            <div className="text-[12px] font-semibold text-slate-900">My tickets</div>
                            <div className="mt-0.5 text-[11px] text-slate-500">{busy ? 'Loading…' : `${filtered.length} tickets`}</div>
                        </div>
                        <button type="button" onClick={() => setOpenCreate(true)} className="rounded-xl bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white hover:bg-slate-800">
                            Create
                        </button>
                    </div>

                    <div className="px-4 pb-4">
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Search tickets"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                        />
                    </div>

                    <div className="max-h-[620px] overflow-auto p-2">
                        {filtered.length ? (
                            <div className="grid gap-1">
                                {filtered.map((t) => {
                                    const active = String(t.id) === String(selectedId);
                                    return (
                                        <button
                                            key={t.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedId(String(t.id));
                                                loadTicket(String(t.id));
                                            }}
                                            className={
                                                'w-full rounded-xl px-3 py-3 text-left transition ' +
                                                (active ? 'bg-slate-50' : 'hover:bg-slate-50')
                                            }
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <div className="truncate text-[12px] font-semibold text-slate-900">{t.subject}</div>
                                                    <div className="mt-1 text-[11px] text-slate-500">{t.assignee ? `Assigned: ${t.assignee.name}` : 'Unassigned'}</div>
                                                </div>
                                                <div className="shrink-0 text-right">
                                                    <div className={statusBadge(t.status)}>{t.status}</div>
                                                    <div className="mt-1 text-[10px] text-slate-500">{t.updated_at ? new Date(t.updated_at).toLocaleDateString() : ''}</div>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="px-3 py-6 text-center text-[12px] text-slate-500">No tickets yet.</div>
                        )}
                    </div>
                </div>

                <div className="flex min-h-[620px] flex-col">
                    {selected ? (
                        <>
                            <div className="border-b border-slate-200 px-4 py-3">
                                <div className="text-[12px] font-semibold text-slate-900">{selected.subject}</div>
                                <div className="mt-1 text-[11px] text-slate-500">
                                    Status: <span className="font-semibold">{selected.status}</span>
                                    {'  •  '}
                                    Priority: <span className="font-semibold">{selected.priority}</span>
                                </div>
                            </div>

                            <div ref={listRef} className="flex-1 overflow-auto bg-slate-50 p-4">
                                {messages.length ? (
                                    <div className="grid gap-2">
                                        {messages.map((m) => {
                                            const mine = String(m?.user?.id || '') === String(me?.id || '');
                                            return (
                                                <div key={m.id} className={mine ? 'flex justify-end' : 'flex justify-start'}>
                                                    <div className={mine ? 'max-w-[85%] rounded-2xl bg-slate-900 px-4 py-3 text-[12px] text-white' : 'max-w-[85%] rounded-2xl bg-white px-4 py-3 text-[12px] text-slate-900'}>
                                                        <div>{m.message}</div>
                                                        <div className={mine ? 'mt-1 text-[10px] text-white/70' : 'mt-1 text-[10px] text-slate-500'}>
                                                            {m.created_at ? new Date(m.created_at).toLocaleString() : ''}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-[12px] text-slate-500">No messages yet.</div>
                                )}
                            </div>

                            <div className="border-t border-slate-200 bg-white p-4">
                                <div className="flex gap-2">
                                    <input
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        placeholder="Write a message"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                sendMessage();
                                            }
                                        }}
                                    />
                                    <button type="button" onClick={sendMessage} disabled={busy || !text.trim()} className="rounded-xl bg-emerald-500 px-4 py-2 text-[12px] font-semibold text-white hover:bg-emerald-600 disabled:opacity-50">
                                        Send
                                    </button>
                                </div>
                                <div className="mt-2 flex items-center justify-end text-[10px] text-slate-500">{busy ? 'Working…' : ''}</div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-1 items-center justify-center bg-slate-50 p-6">
                            <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                                <div className="text-lg font-semibold text-slate-900">Support Tickets</div>
                                <div className="mt-2 text-[12px] text-slate-500">Create a private ticket to get help. Only you, the assignee and Super Admin can view it.</div>
                                <button type="button" onClick={() => setOpenCreate(true)} className="mt-6 rounded-xl bg-slate-900 px-4 py-2 text-[12px] font-semibold text-white hover:bg-slate-800">
                                    Create ticket
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
