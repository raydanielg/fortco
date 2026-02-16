import AdminPanelLayout from '@/Layouts/AdminPanelLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function HelpdeskMessages() {
    const [busy, setBusy] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [error, setError] = useState('');

    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const [lastSyncedAt, setLastSyncedAt] = useState(null);

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

    const loadConversations = () => {
        setSyncing(true);
        setError('');
        fetch(route('admin.helpdesk.conversations'), {
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to load conversations');
                setConversations(Array.isArray(json?.conversations) ? json.conversations : []);
                setLastSyncedAt(new Date().toISOString());
            })
            .catch((e) => setError(e?.message || 'Failed to load conversations'))
            .finally(() => setSyncing(false));
    };

    const loadMessages = (userId) => {
        if (!userId) return;
        setSyncing(true);
        setError('');
        fetch(route('admin.helpdesk.messages', { user: userId }), {
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to load messages');
                setSelectedUser(json?.user || null);
                setMessages(Array.isArray(json?.messages) ? json.messages : []);
                setLastSyncedAt(new Date().toISOString());
            })
            .catch((e) => setError(e?.message || 'Failed to load messages'))
            .finally(() => setSyncing(false));
    };

    useEffect(() => {
        loadConversations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!listRef.current) return;
        listRef.current.scrollTop = listRef.current.scrollHeight;
    }, [messages.length]);

    useEffect(() => {
        if (!selectedUser?.id) return;
        const t = window.setInterval(() => loadMessages(selectedUser.id), 3000);
        return () => window.clearInterval(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedUser?.id]);

    const send = () => {
        const msg = text.trim();
        if (!msg || !selectedUser?.id) return;

        const optimistic = {
            id: `tmp-${Date.now()}`,
            sender: 'admin',
            message: msg,
            created_at: new Date().toISOString(),
            reply_to: replyTo
                ? {
                      id: replyTo.id,
                      sender: replyTo.sender,
                      message: replyTo.message,
                      created_at: replyTo.created_at,
                  }
                : null,
        };

        setMessages((p) => [...p, optimistic]);
        setText('');
        setReplyTo(null);

        setBusy(true);
        setError('');
        fetch(route('admin.helpdesk.reply', { user: selectedUser.id }), {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf(),
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: msg, reply_to_id: replyTo?.id || null }),
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || json?.errors?.message?.[0] || 'Failed to send reply');
                loadMessages(selectedUser.id);
                loadConversations();
            })
            .catch((e) => setError(e?.message || 'Failed to send reply'))
            .finally(() => setBusy(false));
    };

    const items = [
        { key: 'tickets', label: 'Tickets', href: route('admin.support.tickets') },
        { key: 'live-chat', label: 'Live Chat', href: route('admin.support.live-chat') },
        { key: 'knowledge-base', label: 'Knowledge Base', href: route('admin.support.knowledge-base') },
        { key: 'helpdesk-messages', label: 'Helpdesk Messages', href: route('admin.support.helpdesk-messages') },
    ];

    const selectedId = selectedUser?.id ? String(selectedUser.id) : '';

    const conversationItem = (c) => {
        const u = c?.user;
        const preview = String(c?.last_message || '').slice(0, 64);
        const active = String(u?.id || '') === selectedId;

        return (
            <button
                key={u?.id}
                type="button"
                onClick={() => loadMessages(u?.id)}
                className={
                    'w-full rounded-xl border px-4 py-3 text-left transition ' +
                    (active
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-900 hover:bg-slate-50')
                }
            >
                <div className="flex items-center justify-between gap-2">
                    <div className={active ? 'text-[12px] font-semibold text-white' : 'text-[12px] font-semibold text-slate-900'}>
                        {u?.name || 'User'}
                    </div>
                    <div className={active ? 'text-[10px] text-white/70' : 'text-[10px] text-slate-500'}>
                        {c?.last_at ? new Date(c.last_at).toLocaleString() : ''}
                    </div>
                </div>
                <div className={active ? 'mt-1 text-[11px] text-white/80' : 'mt-1 text-[11px] text-slate-500'}>
                    {u?.email || ''}
                </div>
                <div className={active ? 'mt-2 text-[11px] text-white/80' : 'mt-2 text-[11px] text-slate-600'}>
                    {preview || '—'}
                </div>
            </button>
        );
    };

    return (
        <>
            <Head title="Support - Helpdesk Messages" />
            <AdminPanelLayout title="Support" active="helpdesk-messages" items={items}>
                <div className="border-b border-slate-200 px-6 py-4">
                    <div className="text-sm font-semibold text-slate-900">Helpdesk messages</div>
                    <div className="mt-1 text-[12px] text-slate-500">View messages sent from banned users and reply.</div>
                </div>

                <div className="p-6">
                    {error ? <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">{error}</div> : null}

                    <div className="grid gap-4 lg:grid-cols-[360px,1fr]">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <div className="flex items-center justify-between">
                                <div className="text-[12px] font-semibold text-slate-900">Conversations</div>
                                <button type="button" onClick={loadConversations} className="text-[11px] font-semibold text-slate-700 hover:text-slate-900">
                                    Refresh
                                </button>
                            </div>

                            <div className="mt-3 grid gap-2">
                                {conversations.length ? conversations.map(conversationItem) : <div className="text-[12px] text-slate-500">No conversations yet.</div>}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white">
                            <div className="border-b border-slate-200 px-4 py-3">
                                <div className="text-[12px] font-semibold text-slate-900">{selectedUser ? selectedUser.name : 'Select a conversation'}</div>
                                <div className="mt-1 text-[11px] text-slate-500">{selectedUser ? selectedUser.email : ''}</div>
                                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-700">
                                    <span className={syncing ? 'h-2 w-2 rounded-full bg-amber-500' : 'h-2 w-2 rounded-full bg-emerald-500'} />
                                    {syncing ? 'Syncing…' : 'Up to date'}
                                    <span className="font-normal text-slate-500">
                                        {lastSyncedAt ? `• ${new Date(lastSyncedAt).toLocaleTimeString()}` : ''}
                                    </span>
                                </div>
                            </div>

                            <div ref={listRef} className="max-h-[420px] overflow-auto p-4">
                                {messages.length ? (
                                    <div className="grid gap-3">
                                        {messages.map((m) => (
                                            <div key={m.id} className={m.sender === 'admin' ? 'flex justify-end' : 'flex justify-start'}>
                                                <div
                                                    className={
                                                        'max-w-[85%] rounded-2xl px-4 py-3 text-[12px] leading-relaxed ' +
                                                        (m.sender === 'admin' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900')
                                                    }
                                                    role="button"
                                                    tabIndex={0}
                                                    onClick={() => {
                                                        if (!m?.id || String(m.id).startsWith('tmp-')) return;
                                                        setReplyTo(m);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            if (!m?.id || String(m.id).startsWith('tmp-')) return;
                                                            setReplyTo(m);
                                                        }
                                                    }}
                                                >
                                                    {m.reply_to ? (
                                                        <div className={m.sender === 'admin' ? 'mb-2 rounded-xl bg-white/10 px-3 py-2' : 'mb-2 rounded-xl bg-white px-3 py-2'}>
                                                            <div className={m.sender === 'admin' ? 'text-[10px] font-bold text-white/80' : 'text-[10px] font-bold text-slate-700'}>
                                                                Replying to {m.reply_to.sender}
                                                            </div>
                                                            <div className={m.sender === 'admin' ? 'mt-0.5 text-[10px] text-white/70' : 'mt-0.5 text-[10px] text-slate-500'}>
                                                                {String(m.reply_to.message || '').slice(0, 140)}
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                    <div>{m.message}</div>
                                                    <div className={m.sender === 'admin' ? 'mt-1 text-[10px] text-white/70' : 'mt-1 text-[10px] text-slate-500'}>
                                                        {m.created_at ? new Date(m.created_at).toLocaleTimeString() : ''}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-[12px] text-slate-500">No messages yet.</div>
                                )}
                            </div>

                            <div className="border-t border-slate-200 p-4">
                                {replyTo ? (
                                    <div className="mb-3 flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                        <div className="min-w-0">
                                            <div className="text-[10px] font-bold text-slate-700">Replying to {replyTo.sender}</div>
                                            <div className="mt-0.5 truncate text-[11px] text-slate-600">{replyTo.message}</div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setReplyTo(null)}
                                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-700 hover:bg-slate-50"
                                        >
                                            X
                                        </button>
                                    </div>
                                ) : null}

                                <div className="flex gap-2">
                                    <input
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        placeholder={selectedUser ? 'Write a reply...' : 'Select a conversation first'}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                                        disabled={!selectedUser}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                send();
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={send}
                                        disabled={!selectedUser || !text.trim() || busy}
                                        className="rounded-xl bg-slate-900 px-4 py-2 text-[12px] font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                                    >
                                        Send
                                    </button>
                                </div>
                                <div className="mt-2 text-[10px] text-slate-500">Click any message bubble to reply.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminPanelLayout>
        </>
    );
}
