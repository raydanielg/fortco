import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function Chat() {
    const [busy, setBusy] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [error, setError] = useState('');
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const [lastSyncedAt, setLastSyncedAt] = useState(null);
    const [attachOpen, setAttachOpen] = useState(false);
    const [pendingFiles, setPendingFiles] = useState([]);

    const [isAtBottom, setIsAtBottom] = useState(true);

    const listRef = useRef(null);

    const getCookie = (name) => {
        const v = `; ${document.cookie}`;
        const parts = v.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return '';
    };

    const csrf = () => document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    const xsrf = () => {
        const raw = getCookie('XSRF-TOKEN');
        try {
            return raw ? decodeURIComponent(raw) : '';
        } catch (e) {
            return raw || '';
        }
    };

    const readJson = async (r) => {
        const t = await r.text();
        try {
            return t ? JSON.parse(t) : {};
        } catch (e) {
            return {};
        }
    };

    const load = () => {
        setSyncing(true);
        setError('');
        fetch(route('helpdesk.chat.messages'), {
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to load messages');
                setMessages(Array.isArray(json?.messages) ? json.messages : []);
                setLastSyncedAt(new Date().toISOString());
            })
            .catch((e) => setError(e?.message || 'Failed to load messages'))
            .finally(() => setSyncing(false));
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const t = window.setInterval(() => {
            if (busy) return;
            if (!isAtBottom) return;
            load();
        }, 3000);
        return () => window.clearInterval(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [busy, isAtBottom]);

    useEffect(() => {
        if (!listRef.current) return;
        if (!isAtBottom) return;
        listRef.current.scrollTop = listRef.current.scrollHeight;
    }, [messages.length, isAtBottom]);

    const canSend = useMemo(() => text.trim().length > 0 && !busy, [text, busy]);

    const fileToAttachment = (f) => {
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
    };

    const onPickFiles = (files) => {
        const arr = Array.from(files || []);
        if (!arr.length) return;
        setPendingFiles((p) => [...p, ...arr]);
    };

    const send = () => {
        const msg = text.trim();
        if (!msg && pendingFiles.length === 0) return;

        const optimistic = {
            id: `tmp-${Date.now()}`,
            sender: 'user',
            message: msg,
            created_at: new Date().toISOString(),
            attachments: pendingFiles.map(fileToAttachment),
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

        fetch(route('helpdesk.chat.store'), {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf(),
                'X-XSRF-TOKEN': xsrf(),
                Accept: 'application/json',
            },
            body: fd,
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || json?.errors?.message?.[0] || 'Failed to send');
                load();
            })
            .catch((e) => setError(e?.message || 'Failed to send'))
            .finally(() => setBusy(false));
    };

    const removePending = (idx) => {
        setPendingFiles((p) => p.filter((_, i) => i !== idx));
    };

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
                            <div key={a.id} className={isMine ? 'rounded-xl bg-white/10 p-2' : 'rounded-xl bg-white p-2'}>
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
                                (isMine ? 'bg-white/10 text-white' : 'bg-white text-slate-900')
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

    return (
        <GuestLayout
            subtitle="HELPDESK"
            title="Support chat"
            description="Send a message to our support team. Your messages will remain here even if you leave and come back."
            footer={
                <div className="text-xs text-slate-500">
                    <Link href={route('banned')} className="font-semibold text-slate-700 hover:text-slate-900">
                        Back to banned page
                    </Link>
                </div>
            }
        >
            <Head title="Helpdesk Chat" />

            {error ? <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">{error}</div> : null}

            <div className="rounded-2xl border border-slate-200 bg-white">
                <div
                    ref={listRef}
                    className="max-h-[320px] overflow-auto p-4"
                    onScroll={() => {
                        const el = listRef.current;
                        if (!el) return;
                        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 24;
                        setIsAtBottom(atBottom);
                    }}
                >
                    {messages.length ? (
                        <div className="grid gap-3">
                            {messages.map((m) => (
                                <div key={m.id} className={m.sender === 'user' ? 'flex justify-end' : 'flex justify-start'}>
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
                                            'max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ' +
                                            (m.sender === 'user'
                                                ? 'bg-slate-900 text-white'
                                                : 'bg-slate-100 text-slate-900')
                                        }
                                    >
                                        {m.reply_to ? (
                                            <div className={m.sender === 'user' ? 'mb-2 rounded-xl bg-white/10 px-3 py-2' : 'mb-2 rounded-xl bg-white px-3 py-2'}>
                                                <div className={m.sender === 'user' ? 'text-[10px] font-bold text-white/80' : 'text-[10px] font-bold text-slate-700'}>
                                                    Replying to {m.reply_to.sender}
                                                </div>
                                                <div className={m.sender === 'user' ? 'mt-0.5 text-[10px] text-white/70' : 'mt-0.5 text-[10px] text-slate-500'}>
                                                    {String(m.reply_to.message || '').slice(0, 140)}
                                                </div>
                                            </div>
                                        ) : null}
                                        {renderAttachments(m.attachments, m.sender === 'user')}
                                        {m.message ? <div>{m.message}</div> : null}
                                        <div className={m.sender === 'user' ? 'mt-1 text-[10px] text-white/70' : 'mt-1 text-[10px] text-slate-500'}>
                                            {m.created_at ? new Date(m.created_at).toLocaleTimeString() : ''}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-xs text-slate-500">No messages yet. Write your first message below.</div>
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

                    {pendingFiles.length ? (
                        <div className="mb-3 flex flex-wrap gap-2">
                            {pendingFiles.map((f, idx) => (
                                <div key={`${f.name}-${idx}`} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-semibold text-slate-700">
                                    <span className="max-w-[180px] truncate">{f.name}</span>
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
                            placeholder="Type a message"
                            className="w-full bg-transparent px-1 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
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
                    <div className="mt-2 flex items-center justify-end text-[10px] text-slate-500">{syncing ? 'Loading…' : ''}</div>
                </div>
            </div>
        </GuestLayout>
    );
}
