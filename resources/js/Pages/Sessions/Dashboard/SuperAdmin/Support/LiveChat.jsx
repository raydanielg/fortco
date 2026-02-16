import AdminPanelLayout from '@/Layouts/AdminPanelLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function LiveChat() {
    const [busy, setBusy] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [error, setError] = useState('');

    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const [lastSyncedAt, setLastSyncedAt] = useState(null);

    const [openPicker, setOpenPicker] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [employeeQuery, setEmployeeQuery] = useState('');
    const [pickerMode, setPickerMode] = useState('chat');

    const [attachOpen, setAttachOpen] = useState(false);
    const [pendingFiles, setPendingFiles] = useState([]);

    const [isAtBottom, setIsAtBottom] = useState(true);

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

    const openPickerFor = (mode) => {
        setPickerMode(mode);
        setOpenPicker(true);
    };

    const loadEmployees = () => {
        setSyncing(true);
        setError('');
        fetch(route('admin.security.employees'), {
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to load employees');
                const list = Array.isArray(json?.employees) ? json.employees : [];
                setEmployees(list);
            })
            .catch((e) => setError(e?.message || 'Failed to load employees'))
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
        if (!openPicker) return;
        if (employees.length) return;
        loadEmployees();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openPicker]);

    useEffect(() => {
        if (!listRef.current) return;
        if (!isAtBottom) return;
        listRef.current.scrollTop = listRef.current.scrollHeight;
    }, [messages.length, isAtBottom]);

    useEffect(() => {
        const t = window.setInterval(() => {
            if (busy) return;
            if (!isAtBottom) return;
            loadConversations();
            if (selectedUser?.id) loadMessages(selectedUser.id);
        }, 2500);
        return () => window.clearInterval(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [busy, selectedUser?.id, isAtBottom]);

    const send = () => {
        const msg = text.trim();
        if ((!msg && pendingFiles.length === 0) || !selectedUser?.id) return;

        const optimistic = {
            id: `tmp-${Date.now()}`,
            sender: 'admin',
            message: msg,
            created_at: new Date().toISOString(),
            attachments: pendingFiles.map((f) => {
                const mime = String(f?.type || '');
                const kind = mime.startsWith('image/') || mime.startsWith('video/') ? 'media' : mime.startsWith('audio/') ? 'audio' : 'document';
                return {
                    id: `local-${f.name}-${f.size}-${f.lastModified}`,
                    kind,
                    original_name: f.name,
                    mime,
                    size: f.size,
                    url: URL.createObjectURL(f),
                    local: true,
                };
            }),
            reply_to: replyTo
                ? {
                      id: replyTo.id,
                      sender: replyTo.sender,
                      message: replyTo.message,
                      created_at: replyTo.created_at,
                  }
                : null,
        };

        setMessages((prev) => [...prev, optimistic]);
        setText('');
        setReplyTo(null);
        setPendingFiles([]);
        setAttachOpen(false);

        setBusy(true);
        setError('');
        const fd = new FormData();
        fd.append('message', msg || '');
        if (replyTo?.id) fd.append('reply_to_id', String(replyTo.id));
        pendingFiles.forEach((f) => fd.append('files[]', f));

        fetch(route('admin.helpdesk.reply', { user: selectedUser.id }), {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf(),
                Accept: 'application/json',
            },
            body: fd,
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || json?.errors?.message?.[0] || 'Failed to send');
                loadMessages(selectedUser.id);
                loadConversations();
            })
            .catch((e) => setError(e?.message || 'Failed to send'))
            .finally(() => setBusy(false));
    };

    const onPickFiles = (files) => {
        const arr = Array.from(files || []);
        if (!arr.length) return;
        setPendingFiles((p) => [...p, ...arr]);
    };

    const removePending = (idx) => setPendingFiles((p) => p.filter((_, i) => i !== idx));

    const renderAttachments = (attachments, isMine) => {
        const list = Array.isArray(attachments) ? attachments : [];
        if (!list.length) return null;
        return (
            <div className="mb-2 grid gap-2">
                {list.map((a) => {
                    const name = a.original_name || 'Attachment';
                    if (a.kind === 'media' && String(a.mime || '').startsWith('image/')) {
                        return (
                            <a key={a.id} href={a.url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl">
                                <img src={a.url} alt={name} className="max-h-56 w-full object-cover" />
                            </a>
                        );
                    }
                    if (a.kind === 'audio') {
                        return (
                            <div key={a.id} className={isMine ? 'rounded-xl bg-white/10 p-2' : 'rounded-xl bg-slate-50 p-2'}>
                                <audio controls src={a.url} className="w-full" />
                            </div>
                        );
                    }
                    return (
                        <a
                            key={a.id}
                            href={a.url}
                            target="_blank"
                            rel="noreferrer"
                            className={
                                'flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-[11px] ' +
                                (isMine ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-900')
                            }
                        >
                            <div className="min-w-0">
                                <div className="truncate font-semibold">{name}</div>
                                <div className={isMine ? 'mt-0.5 text-[10px] text-white/70' : 'mt-0.5 text-[10px] text-slate-500'}>
                                    {a.mime || 'document'}
                                </div>
                            </div>
                            <div className={isMine ? 'text-[10px] text-white/70' : 'text-[10px] text-slate-500'}>Open</div>
                        </a>
                    );
                })}
            </div>
        );
    };

    const items = [
        { key: 'tickets', label: 'Tickets', href: route('admin.support.tickets') },
        { key: 'live-chat', label: 'Live Chat', href: route('admin.support.live-chat') },
        { key: 'knowledge-base', label: 'Knowledge Base', href: route('admin.support.knowledge-base') },
        { key: 'helpdesk-messages', label: 'Helpdesk Messages', href: route('admin.support.helpdesk-messages') },
    ];

    return (
        <>
            <Head title="Support - Live Chat" />
            <AdminPanelLayout title="Support" active="live-chat" items={items}>
                <div className="border-b border-slate-200 px-6 py-4">
                    <div className="text-sm font-semibold text-slate-900">Live Chat</div>
                    <div className="mt-1 text-[12px] text-slate-500">WhatsApp-style support chat. Conversations update automatically.</div>
                </div>

                <div className="p-6">
                    {error ? <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">{error}</div> : null}

                    {openPicker ? (
                        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/40 p-4">
                            <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                                <div className="border-b border-slate-200 px-6 py-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <div className="text-sm font-semibold text-slate-900">
                                                {pickerMode === 'document' ? 'Send document' : 'Start new chat'}
                                            </div>
                                            <div className="mt-1 text-[12px] text-slate-500">
                                                {pickerMode === 'document'
                                                    ? 'Choose which employee you want to send the document to.'
                                                    : 'Choose an employee to open a conversation.'}
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setOpenPicker(false)}
                                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <input
                                        value={employeeQuery}
                                        onChange={(e) => setEmployeeQuery(e.target.value)}
                                        placeholder="Search employee by name or email"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                                    />

                                    <div className="mt-3 max-h-[360px] overflow-auto">
                                        {(employees || [])
                                            .filter((e) => {
                                                const q = employeeQuery.trim().toLowerCase();
                                                if (!q) return true;
                                                const name = String(e?.full_name || '').toLowerCase();
                                                const email = String(e?.user?.email || '').toLowerCase();
                                                return name.includes(q) || email.includes(q);
                                            })
                                            .map((e) => {
                                                const uid = e?.user?.id || e?.user_id;
                                                if (!uid) return null;
                                                const active = !!e?.active;
                                                return (
                                                    <button
                                                        key={e.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setOpenPicker(false);
                                                            setEmployeeQuery('');
                                                            setPickerMode('chat');
                                                            setSelectedUser({
                                                                id: uid,
                                                                name: e?.full_name || e?.user?.name || 'User',
                                                                email: e?.user?.email || '',
                                                                active: active,
                                                            });
                                                            setMessages([]);
                                                            loadMessages(uid);
                                                        }}
                                                        className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-[12px] text-slate-900 hover:bg-slate-50"
                                                    >
                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <div className="truncate font-semibold">{e.full_name || 'Employee'}</div>
                                                                <span className={active ? 'h-2 w-2 rounded-full bg-emerald-500' : 'h-2 w-2 rounded-full bg-slate-300'} />
                                                            </div>
                                                            <div className="mt-0.5 truncate text-[11px] text-slate-500">{e?.user?.email || ''}</div>
                                                        </div>
                                                        <div className="text-[11px] font-semibold text-slate-700">Open</div>
                                                    </button>
                                                );
                                            })
                                            .filter(Boolean)}

                                        {!employees.length ? <div className="py-6 text-center text-[12px] text-slate-500">Loading employees…</div> : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    <div className="grid gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white lg:grid-cols-[360px,1fr]">
                        <div className="border-b border-slate-200 lg:border-b-0 lg:border-r">
                            <div className="flex items-center justify-between px-4 py-3">
                                <div>
                                    <div className="text-[12px] font-semibold text-slate-900">Chats</div>
                                    <div className="mt-0.5 text-[11px] text-slate-500">{`${conversations.length} conversations`}</div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => openPickerFor('chat')}
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white hover:bg-slate-800"
                                        aria-label="New chat"
                                    >
                                        <span className="text-lg leading-none">+</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={loadConversations}
                                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                                    >
                                        Refresh
                                    </button>
                                </div>
                            </div>

                            <div className="max-h-[520px] overflow-auto p-2">
                                {conversations.length ? (
                                    <div className="grid gap-1">
                                        {conversations.map((c) => {
                                            const u = c?.user;
                                            const active = String(u?.id || '') === String(selectedUser?.id || '');
                                            const preview = String(c?.last_message || '').slice(0, 48);
                                            const isOnline = !!c?.user_active;
                                            return (
                                                <button
                                                    key={u?.id}
                                                    type="button"
                                                    onClick={() => loadMessages(u?.id)}
                                                    className={
                                                        'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition ' +
                                                        (active ? 'bg-slate-50' : 'hover:bg-slate-50')
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            'flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-bold ' +
                                                            (active ? 'bg-slate-900 text-white' : 'bg-slate-900 text-white')
                                                        }
                                                    >
                                                        <div className="relative">
                                                            {(u?.name || 'U').trim().slice(0, 1).toUpperCase()}
                                                            <span
                                                                className={
                                                                    'absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full border-2 ' +
                                                                    (active ? 'border-white' : 'border-white') +
                                                                    (isOnline ? ' bg-emerald-500' : ' bg-slate-300')
                                                                }
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <div className={'truncate text-[12px] font-semibold text-slate-900'}>
                                                                {u?.name || 'User'}
                                                            </div>
                                                            <div className={'text-[10px] text-slate-500'}>
                                                                {c?.last_at ? new Date(c.last_at).toLocaleTimeString() : ''}
                                                            </div>
                                                        </div>
                                                        <div className={'truncate text-[11px] text-slate-500'}>
                                                            {preview || u?.email || '—'}
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="px-3 py-4 text-[12px] text-slate-500">No chats yet.</div>
                                )}
                            </div>
                        </div>

                        <div className="flex min-h-[540px] flex-col">
                            <div className="border-b border-slate-200 px-4 py-3">
                                {selectedUser ? (
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <div className="truncate text-[12px] font-semibold text-slate-900">{selectedUser.name}</div>
                                                <span className={selectedUser.active ? 'h-2 w-2 rounded-full bg-emerald-500' : 'h-2 w-2 rounded-full bg-slate-300'} />
                                            </div>
                                            <div className="truncate text-[11px] text-slate-500">{selectedUser.email}</div>
                                        </div>
                                        <div className="text-[11px] text-slate-500">Online</div>
                                    </div>
                                ) : (
                                    <div className="text-[12px] text-slate-500">Live Chat</div>
                                )}
                            </div>

                            {selectedUser ? (
                                <>
                                    <div
                                        ref={listRef}
                                        className="flex-1 overflow-auto bg-slate-50 p-4"
                                        onScroll={() => {
                                            const el = listRef.current;
                                            if (!el) return;
                                            const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 24;
                                            setIsAtBottom(atBottom);
                                        }}
                                    >
                                        {messages.length ? (
                                            <div className="grid gap-2">
                                                {messages.map((m) => {
                                                    const isAdmin = m.sender === 'admin';
                                                    return (
                                                        <div key={m.id} className={isAdmin ? 'flex justify-end' : 'flex justify-start'}>
                                                            <div
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
                                                                className={
                                                                    'max-w-[85%] rounded-2xl px-4 py-3 text-[12px] leading-relaxed shadow-sm ' +
                                                                    (isAdmin ? 'bg-slate-900 text-white' : 'bg-white text-slate-900')
                                                                }
                                                            >
                                                                {m.reply_to ? (
                                                                    <div className={isAdmin ? 'mb-2 rounded-xl bg-white/10 px-3 py-2' : 'mb-2 rounded-xl bg-slate-50 px-3 py-2'}>
                                                                        <div className={isAdmin ? 'text-[10px] font-bold text-white/80' : 'text-[10px] font-bold text-slate-700'}>
                                                                            Replying to {m.reply_to.sender}
                                                                        </div>
                                                                        <div className={isAdmin ? 'mt-0.5 text-[10px] text-white/70' : 'mt-0.5 text-[10px] text-slate-500'}>
                                                                            {String(m.reply_to.message || '').slice(0, 140)}
                                                                        </div>
                                                                    </div>
                                                                ) : null}
                                                                {renderAttachments(m.attachments, isAdmin)}
                                                                {m.message ? <div>{m.message}</div> : null}
                                                                <div className={isAdmin ? 'mt-1 text-[10px] text-white/70' : 'mt-1 text-[10px] text-slate-500'}>
                                                                    {m.created_at ? new Date(m.created_at).toLocaleTimeString() : ''}
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
                                        {pendingFiles.length ? (
                                            <div className="mb-3 flex flex-wrap gap-2">
                                                {pendingFiles.map((f, idx) => (
                                                    <div key={`${f.name}-${idx}`} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold text-slate-700">
                                                        <span className="max-w-[160px] truncate">{f.name}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removePending(idx)}
                                                            className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-700 hover:bg-slate-100"
                                                        >
                                                            X
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : null}

                                        <div className="relative flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5">
                                            <button
                                                type="button"
                                                onClick={() => setAttachOpen((p) => !p)}
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 hover:bg-slate-100"
                                                aria-label="Attach"
                                            >
                                                <span className="text-lg leading-none">+</span>
                                            </button>

                                            {attachOpen ? (
                                                <div className="absolute bottom-12 left-2 z-20 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                                                    <label className="flex cursor-pointer items-center gap-3 px-4 py-3 text-[12px] font-semibold text-slate-700 hover:bg-slate-50">
                                                        <span>Document</span>
                                                        <input type="file" className="hidden" multiple onChange={(e) => onPickFiles(e.target.files)} />
                                                    </label>
                                                    <label className="flex cursor-pointer items-center gap-3 px-4 py-3 text-[12px] font-semibold text-slate-700 hover:bg-slate-50">
                                                        <span>Photos & videos</span>
                                                        <input type="file" className="hidden" multiple accept="image/*,video/*" onChange={(e) => onPickFiles(e.target.files)} />
                                                    </label>
                                                    <label className="flex cursor-pointer items-center gap-3 px-4 py-3 text-[12px] font-semibold text-slate-700 hover:bg-slate-50">
                                                        <span>Audio</span>
                                                        <input type="file" className="hidden" multiple accept="audio/*" onChange={(e) => onPickFiles(e.target.files)} />
                                                    </label>
                                                </div>
                                            ) : null}

                                            <input
                                                value={text}
                                                onChange={(e) => setText(e.target.value)}
                                                placeholder={selectedUser ? 'Type a message' : 'Select a chat first'}
                                                className="w-full bg-transparent px-1 py-2 text-[12px] text-slate-900 placeholder:text-slate-400 focus:outline-none"
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
                                                disabled={busy || (!text.trim() && pendingFiles.length === 0)}
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white transition hover:bg-emerald-600 disabled:opacity-50"
                                                aria-label="Send"
                                            >
                                                <span className="text-[12px] font-black">➤</span>
                                            </button>
                                        </div>

                                        <div className="mt-2 flex items-center justify-end text-[10px] text-slate-500">{busy ? 'Working…' : ''}</div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-1 items-center justify-center bg-slate-50 p-6">
                                    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-900 text-white">
                                            <div className="text-3xl font-black">F</div>
                                        </div>
                                        <div className="mt-5 text-lg font-semibold text-slate-900">Fortco Live Chat</div>
                                        <div className="mt-2 text-[12px] leading-relaxed text-slate-500">
                                            Start a conversation to send messages faster. You can also choose an employee to send a document.
                                        </div>

                                        <div className="mt-6 grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => openPickerFor('document')}
                                                className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left hover:bg-slate-50"
                                            >
                                                <div className="text-[12px] font-semibold text-slate-900">Send document</div>
                                                <div className="mt-1 text-[11px] text-slate-500">Choose employee</div>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => openPickerFor('chat')}
                                                className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left hover:bg-slate-50"
                                            >
                                                <div className="text-[12px] font-semibold text-slate-900">Add contact</div>
                                                <div className="mt-1 text-[11px] text-slate-500">Start chat</div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </AdminPanelLayout>
        </>
    );
}
