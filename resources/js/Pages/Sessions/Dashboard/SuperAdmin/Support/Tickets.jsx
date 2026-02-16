import AdminPanelLayout from '@/Layouts/AdminPanelLayout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function Tickets() {
    const page = usePage();
    const me = page.props.auth?.user;

    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [tickets, setTickets] = useState([]);
    const [q, setQ] = useState('');
    const [assignees, setAssignees] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const [selected, setSelected] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');

    const listRef = useRef(null);
    const csrf = () => document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    const readJson = async (r) => {
        const t = await r.text();
        try { return t ? JSON.parse(t) : {}; } catch (e) { return {}; }
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

    const updateStatus = (status) => {
        if (!selectedId) return;
        setBusy(true);
        fetch(route('support.tickets.status', { ticket: selectedId }), {
            method: 'PUT',
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest', 'X-CSRF-TOKEN': csrf(), Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        })
            .then(async (r) => {
                if (!r.ok) throw new Error('Failed');
                loadTicket(selectedId);
                loadTickets();
            })
            .catch((e) => setError(e?.message || 'Failed'))
            .finally(() => setBusy(false));
    };

    useEffect(() => { loadTickets(); }, []);
    useEffect(() => { if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight; }, [messages.length]);

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();
        if (!query) return tickets;
        return tickets.filter((t) => String(t?.subject || '').toLowerCase().includes(query));
    }, [tickets, q]);

    const items = [
        { key: 'tickets', label: 'Tickets', href: route('admin.support.tickets') },
        { key: 'live-chat', label: 'Live Chat', href: route('admin.support.live-chat') },
        { key: 'knowledge-base', label: 'Knowledge Base', href: route('admin.support.knowledge-base') },
        { key: 'helpdesk-messages', label: 'Helpdesk Messages', href: route('admin.support.helpdesk-messages') },
    ];

    return (
        <>
            <Head title="Support - Tickets" />
            <AdminPanelLayout title="Support" active="tickets" items={items}>
                <div className="border-b border-slate-200 px-6 py-4">
                    <div className="text-sm font-semibold text-slate-900">Manage Tickets</div>
                    <div className="mt-1 text-[12px] text-slate-500">View and manage all system support tickets.</div>
                </div>

                <div className="p-6">
                    {error ? <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">{error}</div> : null}
                    <div className="grid gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white lg:grid-cols-[380px,1fr]">
                        <div className="border-b border-slate-200 lg:border-b-0 lg:border-r">
                            <div className="px-4 py-3 border-b border-slate-100">
                                <div className="text-[12px] font-semibold text-slate-900">All Tickets</div>
                                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tickets..." className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px]" />
                            </div>
                            <div className="max-h-[620px] overflow-auto p-2">
                                {filtered.map((t) => (
                                    <button key={t.id} onClick={() => { setSelectedId(String(t.id)); loadTicket(String(t.id)); }} className={`w-full rounded-xl px-3 py-3 text-left transition ${String(t.id) === selectedId ? 'bg-slate-50' : 'hover:bg-slate-50'}`}>
                                        <div className="flex items-start justify-between">
                                            <div className="min-w-0">
                                                <div className="truncate text-[12px] font-semibold text-slate-900">{t.subject}</div>
                                                <div className="mt-1 text-[11px] text-slate-500">From: {t.creator?.name}</div>
                                            </div>
                                            <div className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${t.status === 'open' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>{t.status}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex min-h-[620px] flex-col">
                            {selected ? (
                                <>
                                    <div className="border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                                        <div>
                                            <div className="text-[12px] font-semibold text-slate-900">{selected.subject}</div>
                                            <div className="text-[11px] text-slate-500">Status: {selected.status}</div>
                                        </div>
                                        <div className="flex gap-2">
                                            <select value={selected.status} onChange={(e) => updateStatus(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold">
                                                <option value="open">Open</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value="resolved">Resolved</option>
                                                <option value="closed">Closed</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div ref={listRef} className="flex-1 overflow-auto bg-slate-50 p-4">
                                        {messages.map((m) => (
                                            <div key={m.id} className={`flex ${String(m.user?.id) === String(me?.id) ? 'justify-end' : 'justify-start'} mb-2`}>
                                                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-[12px] ${String(m.user?.id) === String(me?.id) ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 shadow-sm'}`}>
                                                    <div className="font-bold text-[10px] mb-1 opacity-70">{m.user?.name}</div>
                                                    <div>{m.message}</div>
                                                    <div className="mt-1 text-[10px] opacity-50">{new Date(m.created_at).toLocaleString()}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t border-slate-200 bg-white p-4">
                                        <div className="flex gap-2">
                                            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a reply..." className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px]" onKeyDown={(e) => e.key === 'Enter' && sendMessage()} />
                                            <button onClick={sendMessage} disabled={busy || !text.trim()} className="rounded-xl bg-emerald-500 px-4 py-2 text-[12px] font-semibold text-white hover:bg-emerald-600">Send</button>
                                        </div>
                                    </div>
                                </>
                            ) : <div className="flex flex-1 items-center justify-center text-slate-500 text-[12px]">Select a ticket to view conversation</div>}
                        </div>
                    </div>
                </div>
            </AdminPanelLayout>
        </>
    );
}
