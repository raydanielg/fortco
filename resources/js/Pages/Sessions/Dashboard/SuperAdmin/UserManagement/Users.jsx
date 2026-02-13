import DashboardLayout from '@/Layouts/DashboardLayout';
import DocumentPreview from '@/Components/DocumentPreview';
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function Users() {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [users, setUsers] = useState([]);
    const [q, setQ] = useState('');

    const [pdfOpen, setPdfOpen] = useState(false);
    const [pdfHtml, setPdfHtml] = useState('');
    const pdfFrameRef = useRef(null);

    const [menuUserId, setMenuUserId] = useState('');
    const menuRef = useRef(null);

    const csrf = () => document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    const readJson = async (r) => {
        const text = await r.text();
        try {
            return text ? JSON.parse(text) : {};
        } catch (e) {
            return {};
        }
    };

    const fetchUsers = () => {
        setBusy(true);
        setError('');
        fetch(route('admin.security.users'), {
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
        })
            .then(async (r) => {
                const json = await r.json().catch(() => ({}));
                if (!r.ok) throw new Error(json?.message || 'Failed to load users');
                setUsers(Array.isArray(json?.users) ? json.users : []);
            })
            .catch((e) => setError(e?.message || 'Failed to load users'))
            .finally(() => setBusy(false));
    };

    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const onDoc = (e) => {
            if (!menuUserId) return;
            if (!menuRef.current) return;
            if (menuRef.current.contains(e.target)) return;
            setMenuUserId('');
        };

        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    }, [menuUserId]);

    const viewProfile = (u) => {
        if (!u?.id) return;
        window.location.href = route('admin.user-management.sessions-logs', { user: u.id });
    };

    const banToggle = (u) => {
        if (!u?.id) return;
        const isBanned = !!u?.banned_at;
        const label = isBanned ? 'Unban' : 'Ban';
        if (!window.confirm(`${label} ${u.name}?`)) return;

        setBusy(true);
        setError('');
        fetch(route(isBanned ? 'admin.security.users.unban' : 'admin.security.users.ban', { user: u.id }), {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf(),
                Accept: 'application/json',
            },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Action failed');
                fetchUsers();
            })
            .catch((e) => setError(e?.message || 'Action failed'))
            .finally(() => setBusy(false));
    };

    const resetPassword = (u) => {
        if (!u?.id) return;
        if (!window.confirm(`Send password reset link to ${u.email}?`)) return;

        setBusy(true);
        setError('');
        fetch(route('admin.security.users.password-reset', { user: u.id }), {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf(),
                Accept: 'application/json',
            },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to send reset link');
                alert('Reset link sent.');
            })
            .catch((e) => setError(e?.message || 'Failed to send reset link'))
            .finally(() => setBusy(false));
    };

    const deleteUser = (u) => {
        if (!u?.id) return;
        if (!window.confirm(`Delete ${u.name}? This cannot be undone.`)) return;

        setBusy(true);
        setError('');
        fetch(route('admin.security.users.delete', { user: u.id }), {
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
                if (!r.ok) throw new Error(json?.message || 'Failed to delete user');
                fetchUsers();
            })
            .catch((e) => setError(e?.message || 'Failed to delete user'))
            .finally(() => setBusy(false));
    };

    const exportPdf = () => {
        try {
            const esc = (s) =>
                String(s ?? '')
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;');

            const rows = (filtered || []).map((u) => {
                const status = u?.banned_at ? 'Banned' : u?.active ? 'Active' : 'Inactive';
                const last = u?.last_activity ? new Date(u.last_activity).toLocaleString() : '-';
                const sessions = u?.sessions_count ?? 0;
                return `
                    <tr>
                        <td>${esc(u?.name)}</td>
                        <td>${esc(u?.email)}</td>
                        <td class="num">${esc(sessions)}</td>
                        <td>${esc(last)}</td>
                        <td>${esc(status)}</td>
                    </tr>
                `;
            });

            const nowStr = new Date().toLocaleString();
            const reportTitle = 'USER ACCOUNTS REPORT';
            const orgLine1 = 'FORTCO ERP';
            const orgLine2 = 'ADMINISTRATION OFFICE';
            const orgContacts = 'Tel: +255 000 000 000, Email: info@fortco.local';
            const summary = `This document provides an official summary of user accounts in the system, including identity details, recent session activity and account status.`;
            const total = (filtered || []).length;
            const qInfo = q.trim() ? `Filter: "${esc(q.trim())}"` : 'Filter: None';
            const logoUrl = `${window.location.origin}/favicon.svg`;

            const html = `
            <!doctype html>
            <html>
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>${reportTitle}</title>
                <style>
                    :root {
                        --ink: #0f172a;
                        --muted: #475569;
                        --line: #cbd5e1;
                        --paper: #ffffff;
                        --canvas: #e5e7eb;
                    }
                    body {
                        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
                        background: var(--canvas);
                        color: var(--ink);
                        margin: 0;
                        padding: 24px;
                    }
                    .page {
                        max-width: 980px;
                        margin: 0 auto;
                        background: var(--paper);
                        border: 1px solid var(--line);
                    }
                    .top {
                        padding: 18px 20px 10px 20px;
                        text-align: center;
                    }
                    .crest {
                        width: 58px;
                        height: 58px;
                        margin: 0 auto 8px auto;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        overflow: hidden;
                    }
                    .crest img { width: 58px; height: 58px; object-fit: contain; }
                    .top .l1 { font-size: 12px; font-weight: 800; letter-spacing: 0.05em; }
                    .top .l2 { font-size: 11px; font-weight: 800; margin-top: 2px; }
                    .top .l3 { font-size: 11px; color: var(--muted); margin-top: 3px; }
                    .title {
                        margin-top: 10px;
                        font-size: 12px;
                        font-weight: 900;
                        letter-spacing: 0.08em;
                    }
                    .titleLine {
                        margin-top: 6px;
                        font-size: 12px;
                        font-weight: 900;
                        letter-spacing: 0.18em;
                    }
                    .subTitle {
                        margin-top: 6px;
                        font-size: 11px;
                        color: var(--muted);
                    }
                    .body {
                        padding: 0 20px 6px 20px;
                    }
                    .section {
                        padding: 14px 0;
                        border-top: 1px dashed #cbd5e1;
                    }
                    .section:first-child { border-top: 1px solid #cbd5e1; }
                    .section h2 {
                        margin: 0 0 6px 0;
                        font-size: 12px;
                        font-weight: 900;
                        letter-spacing: 0.02em;
                    }
                    .section p {
                        margin: 0;
                        font-size: 11px;
                        color: var(--muted);
                        line-height: 1.55;
                    }
                    .metaRow {
                        margin-top: 10px;
                        display: flex;
                        flex-wrap: wrap;
                        gap: 14px;
                        font-size: 11px;
                        color: var(--muted);
                    }
                    .metaRow strong { color: var(--ink); }
                    table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 10px; }
                    th, td { border: 1px solid var(--line); padding: 8px 9px; vertical-align: top; }
                    th { background: #f8fafc; text-align: left; font-weight: 900; }
                    td.num, th.num { text-align: right; }
                    .footer {
                        border-top: 1px solid var(--line);
                        padding: 10px 20px;
                        display: flex;
                        justify-content: space-between;
                        gap: 12px;
                        font-size: 11px;
                        color: var(--muted);
                    }
                    @media print {
                        body { background: #fff; padding: 0; }
                        .page { border: none; max-width: none; }
                    }
                </style>
            </head>
            <body>
                <div class="page">
                    <div class="top">
                        <div class="crest"><img src="${logoUrl}" alt="Logo" /></div>
                        <div class="l1">${esc(orgLine1)}</div>
                        <div class="l2">${esc(orgLine2)}</div>
                        <div class="l3">${esc(orgContacts)}</div>

                        <div class="title">${esc(reportTitle)}</div>
                        <div class="titleLine">===== ===== =====</div>
                        <div class="subTitle">Generated: ${esc(nowStr)}</div>
                    </div>

                    <div class="body">
                        <div class="section">
                            <h2>1. REPORT SUMMARY</h2>
                            <p>${esc(summary)}</p>
                            <div class="metaRow">
                                <div><strong>Total users:</strong> ${esc(total)}</div>
                                <div><strong>${qInfo}</strong></div>
                            </div>
                        </div>

                        <div class="section">
                            <h2>2. USER ACCOUNTS LIST</h2>
                            <p>This table lists all user accounts included in the current selection.</p>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th class="num">Sessions</th>
                                        <th>Last Activity</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${rows.join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="footer">
                        <div>Year ${esc(new Date().getFullYear())}</div>
                        <div>Users: <strong>${esc(total)}</strong></div>
                    </div>
                </div>
            </body>
            </html>
        `;

            setPdfHtml(html);
            setPdfOpen(true);
        } catch (e) {
            setError(e?.message || 'Failed to generate PDF preview.');
        }
    };

    const printPdf = () => {
        const w = pdfFrameRef.current?.contentWindow;
        if (!w) return;
        w.focus();
        w.print();
    };

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();
        if (!query) return users;
        return users.filter((u) => {
            const name = String(u?.name || '').toLowerCase();
            const email = String(u?.email || '').toLowerCase();
            return name.includes(query) || email.includes(query);
        });
    }, [users, q]);

    return (
        <DashboardLayout title="User Management" breadcrumbs={['Admin', 'User Management', 'Users']}>
            <Head title="Users" />

            <DocumentPreview
                open={pdfOpen}
                title="PDF Preview"
                onBack={() => setPdfOpen(false)}
                onPrint={printPdf}
                kind="html"
                srcDoc={pdfHtml}
                iframeRef={pdfFrameRef}
            />

            <div className="rounded-2xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-6 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <div className="text-sm font-semibold text-slate-900">Users</div>
                            <div className="mt-1 text-[12px] text-slate-500">Search users and see sessions activity summary.</div>
                        </div>
                        <div className="text-[12px] text-slate-500">{busy ? 'Loading…' : ''}</div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Search by name or email"
                            className="w-full max-w-md rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        />
                        <button
                            type="button"
                            onClick={exportPdf}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Export to PDF
                        </button>
                        <button
                            type="button"
                            onClick={fetchUsers}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Refresh
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {error ? (
                        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">{error}</div>
                    ) : null}

                    <table className="w-full border border-slate-200 text-left text-[12px]">
                        <thead className="bg-slate-50 text-slate-600">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Name</th>
                                <th className="px-4 py-3 font-semibold">Email</th>
                                <th className="px-4 py-3 font-semibold">Sessions</th>
                                <th className="px-4 py-3 font-semibold">Last Activity</th>
                                <th className="px-4 py-3 font-semibold">Status</th>
                                <th className="px-4 py-3 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filtered.length ? (
                                filtered.map((u) => (
                                    <tr key={u.id} className="bg-white hover:bg-slate-50">
                                        <td className="px-4 py-3 font-semibold text-slate-900">{u.name}</td>
                                        <td className="px-4 py-3 text-slate-700">{u.email}</td>
                                        <td className="px-4 py-3 text-slate-700">{u.sessions_count ?? 0}</td>
                                        <td className="px-4 py-3 text-slate-700">{u.last_activity ? new Date(u.last_activity).toLocaleString() : '-'}</td>
                                        <td className="px-4 py-3">
                                            <span className="text-slate-700">{u.banned_at ? 'Banned' : u.active ? 'Active' : 'Inactive'}</span>
                                        </td>

                                        <td className="relative px-4 py-3 text-right">
                                            <div className="inline-block" ref={menuUserId && String(menuUserId) === String(u.id) ? menuRef : null}>
                                                <button
                                                    type="button"
                                                    onClick={() => setMenuUserId((cur) => (String(cur) === String(u.id) ? '' : String(u.id)))}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                                    aria-label="Actions"
                                                >
                                                    <span className="text-lg leading-none">⋯</span>
                                                </button>

                                                {String(menuUserId) === String(u.id) ? (
                                                    <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setMenuUserId('');
                                                                viewProfile(u);
                                                            }}
                                                            className="block w-full px-4 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50"
                                                        >
                                                            View profile
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setMenuUserId('');
                                                                banToggle(u);
                                                            }}
                                                            className="block w-full px-4 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50"
                                                        >
                                                            {u.banned_at ? 'Unban' : 'Ban'}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setMenuUserId('');
                                                                resetPassword(u);
                                                            }}
                                                            className="block w-full px-4 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50"
                                                        >
                                                            Reset password
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setMenuUserId('');
                                                                deleteUser(u);
                                                            }}
                                                            className="block w-full px-4 py-2 text-left text-[12px] text-red-700 hover:bg-red-50"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="px-4 py-6 text-slate-500" colSpan={6}>
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-[12px] text-slate-600">
                        Open <span className="font-semibold text-slate-900">Sessions & Logs</span> to view per-user sessions and request logs.
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
