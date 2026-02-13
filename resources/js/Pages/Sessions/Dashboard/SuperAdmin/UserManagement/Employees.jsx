import DashboardLayout from '@/Layouts/DashboardLayout';
import DocumentPreview from '@/Components/DocumentPreview';
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function Employees() {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const [employees, setEmployees] = useState([]);
    const [q, setQ] = useState('');

    const [pdfOpen, setPdfOpen] = useState(false);
    const [pdfHtml, setPdfHtml] = useState('');
    const pdfFrameRef = useRef(null);

    const [menuEmployeeId, setMenuEmployeeId] = useState('');
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

    const fetchEmployees = () => {
        setBusy(true);
        setError('');
        fetch(route('admin.security.employees'), {
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to load employees');
                setEmployees(Array.isArray(json?.employees) ? json.employees : []);
            })
            .catch((e) => setError(e?.message || 'Failed to load employees'))
            .finally(() => setBusy(false));
    };

    useEffect(() => {
        fetchEmployees();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const onDoc = (e) => {
            if (!menuEmployeeId) return;
            if (!menuRef.current) return;
            if (menuRef.current.contains(e.target)) return;
            setMenuEmployeeId('');
        };

        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    }, [menuEmployeeId]);

    const viewProfile = (emp) => {
        const uid = emp?.user?.id || emp?.user_id;
        if (!uid) return;
        window.location.href = route('admin.user-management.sessions-logs', { user: uid });
    };

    const banToggle = (emp) => {
        const uid = emp?.user?.id || emp?.user_id;
        if (!uid) return;
        const isBanned = !!emp?.user?.banned_at;
        const label = isBanned ? 'Unban' : 'Ban';
        if (!window.confirm(`${label} ${emp.full_name}?`)) return;

        setBusy(true);
        setError('');
        fetch(route(isBanned ? 'admin.security.users.unban' : 'admin.security.users.ban', { user: uid }), {
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
                fetchEmployees();
            })
            .catch((e) => setError(e?.message || 'Action failed'))
            .finally(() => setBusy(false));
    };

    const resetPassword = (emp) => {
        const uid = emp?.user?.id || emp?.user_id;
        const email = emp?.user?.email;
        if (!uid || !email) return;
        if (!window.confirm(`Send password reset link to ${email}?`)) return;

        setBusy(true);
        setError('');
        fetch(route('admin.security.users.password-reset', { user: uid }), {
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

    const exportPdf = () => {
        try {
            const esc = (s) =>
                String(s ?? '')
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;');

            const rows = (filtered || []).map((e) => {
                const status = e?.user?.banned_at ? 'Banned' : e?.active ? 'Active' : 'Inactive';
                const last = e?.last_activity ? new Date(e.last_activity).toLocaleString() : '-';
                const sessions = e?.sessions_count ?? 0;
                return `
                    <tr>
                        <td>${esc(e?.full_name)}</td>
                        <td>${esc(e?.user?.email || '')}</td>
                        <td>${esc(e?.designation || '')}</td>
                        <td>${esc(e?.phone || '')}</td>
                        <td class="num">${esc(sessions)}</td>
                        <td>${esc(last)}</td>
                        <td>${esc(status)}</td>
                    </tr>
                `;
            });

            const nowStr = new Date().toLocaleString();
            const reportTitle = 'EMPLOYEE ACCOUNTS REPORT';
            const orgLine1 = 'FORTCO ERP';
            const orgLine2 = 'ADMINISTRATION OFFICE';
            const orgContacts = 'Tel: +255 000 000 000, Email: info@fortco.local';
            const summary = `This document provides an official summary of employees registered in the system, including contact details, recent session activity and account status.`;
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
                        :root { --ink:#0f172a; --muted:#475569; --line:#cbd5e1; --paper:#ffffff; --canvas:#e5e7eb; }
                        body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; background: var(--canvas); color: var(--ink); margin: 0; padding: 24px; }
                        .page { max-width: 980px; margin: 0 auto; background: var(--paper); border: 1px solid var(--line); }
                        .top { padding: 18px 20px 10px 20px; text-align: center; }
                        .crest { width: 58px; height: 58px; margin: 0 auto 8px auto; display:flex; align-items:center; justify-content:center; overflow:hidden; }
                        .crest img { width: 58px; height: 58px; object-fit: contain; }
                        .top .l1 { font-size: 12px; font-weight: 800; letter-spacing: 0.05em; }
                        .top .l2 { font-size: 11px; font-weight: 800; margin-top: 2px; }
                        .top .l3 { font-size: 11px; color: var(--muted); margin-top: 3px; }
                        .title { margin-top: 10px; font-size: 12px; font-weight: 900; letter-spacing: 0.08em; }
                        .titleLine { margin-top: 6px; font-size: 12px; font-weight: 900; letter-spacing: 0.18em; }
                        .subTitle { margin-top: 6px; font-size: 11px; color: var(--muted); }
                        .body { padding: 0 20px 6px 20px; }
                        .section { padding: 14px 0; border-top: 1px dashed #cbd5e1; }
                        .section:first-child { border-top: 1px solid #cbd5e1; }
                        .section h2 { margin: 0 0 6px 0; font-size: 12px; font-weight: 900; letter-spacing: 0.02em; }
                        .section p { margin: 0; font-size: 11px; color: var(--muted); line-height: 1.55; }
                        .metaRow { margin-top: 10px; display:flex; flex-wrap: wrap; gap: 14px; font-size: 11px; color: var(--muted); }
                        .metaRow strong { color: var(--ink); }
                        table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 10px; }
                        th, td { border: 1px solid var(--line); padding: 8px 9px; vertical-align: top; }
                        th { background: #f8fafc; text-align: left; font-weight: 900; }
                        td.num, th.num { text-align: right; }
                        .footer { border-top: 1px solid var(--line); padding: 10px 20px; display:flex; justify-content: space-between; gap: 12px; font-size: 11px; color: var(--muted); }
                        @media print { body { background:#fff; padding:0; } .page { border:none; max-width:none; } }
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
                                    <div><strong>Total employees:</strong> ${esc(total)}</div>
                                    <div><strong>${qInfo}</strong></div>
                                </div>
                            </div>

                            <div class="section">
                                <h2>2. EMPLOYEE LIST</h2>
                                <p>This table lists all employees included in the current selection.</p>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Full Name</th>
                                            <th>Email</th>
                                            <th>Designation</th>
                                            <th>Phone</th>
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
                            <div>Employees: <strong>${esc(total)}</strong></div>
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
        if (!query) return employees;
        return employees.filter((e) => {
            const full = String(e?.full_name || '').toLowerCase();
            const email = String(e?.user?.email || '').toLowerCase();
            const phone = String(e?.phone || '').toLowerCase();
            const des = String(e?.designation || '').toLowerCase();
            return full.includes(query) || email.includes(query) || phone.includes(query) || des.includes(query);
        });
    }, [employees, q]);

    return (
        <DashboardLayout title="User Management" breadcrumbs={['Admin', 'User Management', 'Employees']}>
            <Head title="Employees" />

            <DocumentPreview open={pdfOpen} title="PDF Preview" onBack={() => setPdfOpen(false)} onPrint={printPdf} kind="html" srcDoc={pdfHtml} iframeRef={pdfFrameRef} />

            <div className="rounded-2xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-6 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <div className="text-sm font-semibold text-slate-900">Employees</div>
                            <div className="mt-1 text-[12px] text-slate-500">Employees registered in the system (linked to user accounts).</div>
                        </div>
                        <div className="text-[12px] text-slate-500">{busy ? 'Loading…' : ''}</div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Search by name, email, phone or designation"
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
                            onClick={fetchEmployees}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Refresh
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {error ? <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">{error}</div> : null}

                    <table className="w-full border border-slate-200 text-left text-[12px]">
                        <thead className="bg-slate-50 text-slate-600">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Full Name</th>
                                <th className="px-4 py-3 font-semibold">Email</th>
                                <th className="px-4 py-3 font-semibold">Designation</th>
                                <th className="px-4 py-3 font-semibold">Phone</th>
                                <th className="px-4 py-3 font-semibold">Sessions</th>
                                <th className="px-4 py-3 font-semibold">Last Activity</th>
                                <th className="px-4 py-3 font-semibold">Status</th>
                                <th className="px-4 py-3 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filtered.length ? (
                                filtered.map((e) => (
                                    <tr key={e.id} className="bg-white hover:bg-slate-50">
                                        <td className="px-4 py-3 font-semibold text-slate-900">{e.full_name}</td>
                                        <td className="px-4 py-3 text-slate-700">{e.user?.email || '-'}</td>
                                        <td className="px-4 py-3 text-slate-700">{e.designation || '-'}</td>
                                        <td className="px-4 py-3 text-slate-700">{e.phone || '-'}</td>
                                        <td className="px-4 py-3 text-slate-700">{e.sessions_count ?? 0}</td>
                                        <td className="px-4 py-3 text-slate-700">{e.last_activity ? new Date(e.last_activity).toLocaleString() : '-'}</td>
                                        <td className="px-4 py-3">
                                            <span className="text-slate-700">{e.user?.banned_at ? 'Banned' : e.active ? 'Active' : 'Inactive'}</span>
                                        </td>

                                        <td className="relative px-4 py-3 text-right">
                                            <div className="inline-block" ref={menuEmployeeId && String(menuEmployeeId) === String(e.id) ? menuRef : null}>
                                                <button
                                                    type="button"
                                                    onClick={() => setMenuEmployeeId((cur) => (String(cur) === String(e.id) ? '' : String(e.id)))}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                                    aria-label="Actions"
                                                >
                                                    <span className="text-lg leading-none">⋯</span>
                                                </button>

                                                {String(menuEmployeeId) === String(e.id) ? (
                                                    <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setMenuEmployeeId('');
                                                                viewProfile(e);
                                                            }}
                                                            className="block w-full px-4 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50"
                                                        >
                                                            View profile
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setMenuEmployeeId('');
                                                                banToggle(e);
                                                            }}
                                                            className="block w-full px-4 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50"
                                                        >
                                                            {e.user?.banned_at ? 'Unban' : 'Ban'}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setMenuEmployeeId('');
                                                                resetPassword(e);
                                                            }}
                                                            className="block w-full px-4 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50"
                                                        >
                                                            Reset password
                                                        </button>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="px-4 py-6 text-slate-500" colSpan={8}>
                                        No employees found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
