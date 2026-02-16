import AdminPanelLayout from '@/Layouts/AdminPanelLayout';
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

    const [openCreate, setOpenCreate] = useState(false);
    const [createStep, setCreateStep] = useState(1);
    const [roles, setRoles] = useState([]);

    const [openEdit, setOpenEdit] = useState(false);
    const [editEmployeeId, setEditEmployeeId] = useState('');
    const [edit, setEdit] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        hire_date: '',
        national_id: '',
        email: '',
        role: '',
        designation: '',
        phone: '',
        sex: '',
    });

    const [openReset, setOpenReset] = useState(false);
    const [resetUserId, setResetUserId] = useState('');
    const [resetEmail, setResetEmail] = useState('');
    const [resetDone, setResetDone] = useState(false);

    const [create, setCreate] = useState({
        first_name: '',
        middle_name: '',
        last_name: '',
        hire_date: '',
        national_id: '',
        email: '',
        role: '',
        designation: '',
        phone: '',
        sex: '',
        password: '',
        password_confirm: '',
    });

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

    const openResetFor = (emp) => {
        const uid = emp?.user?.id || emp?.user_id;
        if (!uid) return;
        setResetUserId(String(uid));
        setResetEmail(String(emp?.user?.email || ''));
        setResetDone(false);
        setOpenReset(true);
    };

    const confirmReset = () => {
        if (!resetUserId) return;
        setBusy(true);
        setError('');

        fetch(route('admin.security.users.password-reset-default', { user: resetUserId }), {
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
                if (!r.ok) throw new Error(json?.message || 'Failed to reset password');
                setResetDone(true);
            })
            .catch((e) => setError(e?.message || 'Failed to reset password'))
            .finally(() => setBusy(false));
    };

    const openEditFor = (emp) => {
        if (!emp?.id) return;
        setEditEmployeeId(String(emp.id));
        setEdit({
            first_name: emp?.first_name || '',
            middle_name: emp?.middle_name || '',
            last_name: emp?.last_name || '',
            hire_date: emp?.hire_date ? String(emp.hire_date).slice(0, 10) : '',
            national_id: emp?.national_id || '',
            email: emp?.user?.email || '',
            role: emp?.department || '',
            designation: emp?.designation || '',
            phone: emp?.phone || '',
            sex: emp?.sex || '',
        });
        setOpenEdit(true);
    };

    const submitEdit = () => {
        if (!editEmployeeId) return;
        setBusy(true);
        setError('');
        fetch(route('admin.security.employees.update', { employee: editEmployeeId }), {
            method: 'PUT',
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf(),
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                first_name: edit.first_name,
                middle_name: edit.middle_name || null,
                last_name: edit.last_name,
                hire_date: edit.hire_date || null,
                national_id: edit.national_id || null,
                email: edit.email,
                role: edit.role,
                designation: edit.designation || null,
                phone: edit.phone || null,
                sex: edit.sex || null,
            }),
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) {
                    const msg =
                        json?.message ||
                        json?.errors?.email?.[0] ||
                        json?.errors?.role?.[0] ||
                        json?.errors?.first_name?.[0] ||
                        json?.errors?.last_name?.[0] ||
                        'Failed to update employee';
                    throw new Error(msg);
                }
                setOpenEdit(false);
                setEditEmployeeId('');
                fetchEmployees();
            })
            .catch((e) => setError(e?.message || 'Failed to update employee'))
            .finally(() => setBusy(false));
    };

    const fetchRoles = () => {
        fetch(route('admin.role-permission.data'), {
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to load roles');
                setRoles(Array.isArray(json?.roles) ? json.roles : []);
            })
            .catch(() => setRoles([]));
    };

    useEffect(() => {
        fetchEmployees();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!openCreate) return;
        setCreateStep(1);
        fetchRoles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openCreate]);

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

    const submitCreate = () => {
        if ((create.password || '') !== (create.password_confirm || '')) {
            setError('Password confirmation does not match.');
            return;
        }

        setBusy(true);
        setError('');
        fetch(route('admin.security.employees.store'), {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf(),
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                first_name: create.first_name,
                middle_name: create.middle_name || null,
                last_name: create.last_name,
                hire_date: create.hire_date || null,
                national_id: create.national_id || null,
                email: create.email,
                role: create.role,
                designation: create.designation || null,
                phone: create.phone || null,
                sex: create.sex || null,
                password: create.password,
            }),
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) {
                    const msg =
                        json?.message ||
                        json?.errors?.email?.[0] ||
                        json?.errors?.role?.[0] ||
                        json?.errors?.password?.[0] ||
                        json?.errors?.first_name?.[0] ||
                        json?.errors?.last_name?.[0] ||
                        'Failed to create employee';
                    throw new Error(msg);
                }
                setOpenCreate(false);
                setCreate({
                    first_name: '',
                    middle_name: '',
                    last_name: '',
                    hire_date: '',
                    national_id: '',
                    email: '',
                    role: '',
                    designation: '',
                    phone: '',
                    sex: '',
                    password: '',
                    password_confirm: '',
                });
                fetchEmployees();
            })
            .catch((e) => setError(e?.message || 'Failed to create employee'))
            .finally(() => setBusy(false));
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

    const items = useMemo(
        () => [
            { key: 'users', label: 'Users', href: route('admin.user-management.users') },
            { key: 'employees', label: 'Employees', href: route('admin.user-management.employees') },
            { key: 'roles', label: 'Roles', href: route('admin.user-management.roles') },
            { key: 'permissions', label: 'Permissions', href: route('admin.user-management.permissions') },
            { key: 'sessions-logs', label: 'Sessions & Logs', href: route('admin.user-management.sessions-logs') },
        ],
        []
    );

    return (
        <>
            <Head title="Employees" />

            <AdminPanelLayout title="User Management" active="employees" items={items}>

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
                            onClick={() => setOpenCreate(true)}
                            className="rounded-xl bg-slate-900 px-4 py-2 text-[12px] font-semibold text-white hover:bg-slate-800"
                        >
                            Create Employee
                        </button>
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

                    {openReset ? (
                        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/40 p-4">
                            <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                                <div className="border-b border-slate-200 px-6 py-4">
                                    <div className="text-sm font-semibold text-slate-900">Reset password</div>
                                    <div className="mt-1 text-[12px] text-slate-500">
                                        This will set the user password to a default value.
                                    </div>
                                </div>

                                <div className="p-6">
                                    {!resetDone ? (
                                        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] text-amber-900">
                                            <div className="font-semibold">Confirm action</div>
                                            <div className="mt-1 text-amber-800">
                                                Reset password for <span className="font-semibold">{resetEmail || 'this user'}</span> to default
                                                password <span className="font-mono font-semibold">fortco123</span>?
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[12px] text-emerald-900">
                                            <div className="font-semibold">Password reset completed</div>
                                            <div className="mt-1 text-emerald-800">Default password is:</div>
                                            <div className="mt-2 rounded-lg border border-emerald-200 bg-white px-3 py-2 font-mono text-[12px] text-slate-900">
                                                fortco123
                                            </div>
                                            <div className="mt-2 text-[11px] text-emerald-800">You can copy and share it with the user.</div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-6 py-4">
                                    <button
                                        type="button"
                                        onClick={() => setOpenReset(false)}
                                        disabled={busy}
                                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                                    >
                                        {resetDone ? 'Close' : 'Cancel'}
                                    </button>
                                    {!resetDone ? (
                                        <button
                                            type="button"
                                            onClick={confirmReset}
                                            disabled={busy}
                                            className="rounded-xl bg-slate-900 px-4 py-2 text-[12px] font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                                        >
                                            {busy ? 'Resetting…' : 'Confirm reset'}
                                        </button>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {openEdit ? (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4">
                            <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                                <div className="border-b border-slate-200 px-6 py-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <div className="text-sm font-semibold text-slate-900">Edit Employee</div>
                                            <div className="mt-1 text-[12px] text-slate-500">Update employee details (no password change here).</div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setOpenEdit(false)}
                                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="text-[11px] font-semibold text-slate-700">First name</label>
                                            <input value={edit.first_name} onChange={(e) => setEdit((p) => ({ ...p, first_name: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]" />
                                        </div>

                                        <div>
                                            <label className="text-[11px] font-semibold text-slate-700">Middle name</label>
                                            <input value={edit.middle_name} onChange={(e) => setEdit((p) => ({ ...p, middle_name: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]" />
                                        </div>

                                        <div>
                                            <label className="text-[11px] font-semibold text-slate-700">Last name</label>
                                            <input value={edit.last_name} onChange={(e) => setEdit((p) => ({ ...p, last_name: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]" />
                                        </div>

                                        <div>
                                            <label className="text-[11px] font-semibold text-slate-700">Sex</label>
                                            <select value={edit.sex} onChange={(e) => setEdit((p) => ({ ...p, sex: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]">
                                                <option value="">Select</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-[11px] font-semibold text-slate-700">Hire date</label>
                                            <input type="date" value={edit.hire_date} onChange={(e) => setEdit((p) => ({ ...p, hire_date: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]" />
                                        </div>

                                        <div>
                                            <label className="text-[11px] font-semibold text-slate-700">National ID</label>
                                            <input value={edit.national_id} onChange={(e) => setEdit((p) => ({ ...p, national_id: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]" />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label className="text-[11px] font-semibold text-slate-700">Email (username)</label>
                                            <input value={edit.email} onChange={(e) => setEdit((p) => ({ ...p, email: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]" />
                                        </div>

                                        <div>
                                            <label className="text-[11px] font-semibold text-slate-700">Role</label>
                                            <select value={edit.role} onChange={(e) => setEdit((p) => ({ ...p, role: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]">
                                                <option value="">Select role</option>
                                                {roles.map((r) => (
                                                    <option key={r.id} value={r.name}>
                                                        {r.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-[11px] font-semibold text-slate-700">Designation</label>
                                            <input value={edit.designation} onChange={(e) => setEdit((p) => ({ ...p, designation: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]" />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label className="text-[11px] font-semibold text-slate-700">Mobile number</label>
                                            <input value={edit.phone} onChange={(e) => setEdit((p) => ({ ...p, phone: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-6 py-4">
                                    <button type="button" onClick={() => setOpenEdit(false)} disabled={busy} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60">
                                        Cancel
                                    </button>
                                    <button type="button" onClick={submitEdit} disabled={busy} className="rounded-xl bg-slate-900 px-4 py-2 text-[12px] font-semibold text-white hover:bg-slate-800 disabled:opacity-60">
                                        {busy ? 'Saving…' : 'Save changes'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {openCreate ? (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4">
                            <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                                <div className="border-b border-slate-200 px-6 py-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <div className="text-sm font-semibold text-slate-900">Create Employee</div>
                                            <div className="mt-1 text-[12px] text-slate-500">Fill employee details. A user account will be created and a reset link will be sent to the email.</div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setOpenCreate(false)}
                                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {createStep === 1 ? (
                                            <>
                                                <div>
                                                    <label className="text-[11px] font-semibold text-slate-700">First name</label>
                                                    <input
                                                        value={create.first_name}
                                                        onChange={(e) => setCreate((p) => ({ ...p, first_name: e.target.value }))}
                                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                                        placeholder="John"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-[11px] font-semibold text-slate-700">Middle name</label>
                                                    <input
                                                        value={create.middle_name}
                                                        onChange={(e) => setCreate((p) => ({ ...p, middle_name: e.target.value }))}
                                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                                        placeholder="(optional)"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-[11px] font-semibold text-slate-700">Last name</label>
                                                    <input
                                                        value={create.last_name}
                                                        onChange={(e) => setCreate((p) => ({ ...p, last_name: e.target.value }))}
                                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                                        placeholder="Doe"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-[11px] font-semibold text-slate-700">Sex</label>
                                                    <select
                                                        value={create.sex}
                                                        onChange={(e) => setCreate((p) => ({ ...p, sex: e.target.value }))}
                                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                                    >
                                                        <option value="">Select</option>
                                                        <option value="male">Male</option>
                                                        <option value="female">Female</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="text-[11px] font-semibold text-slate-700">Hire date</label>
                                                    <input
                                                        type="date"
                                                        value={create.hire_date}
                                                        onChange={(e) => setCreate((p) => ({ ...p, hire_date: e.target.value }))}
                                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-[11px] font-semibold text-slate-700">National ID</label>
                                                    <input
                                                        value={create.national_id}
                                                        onChange={(e) => setCreate((p) => ({ ...p, national_id: e.target.value }))}
                                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                                        placeholder="NIDA / Passport"
                                                    />
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <label className="text-[11px] font-semibold text-slate-700">Email (will be username)</label>
                                                    <input
                                                        value={create.email}
                                                        onChange={(e) => setCreate((p) => ({ ...p, email: e.target.value }))}
                                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                                        placeholder="john@company.com"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-[11px] font-semibold text-slate-700">Role</label>
                                                    <select
                                                        value={create.role}
                                                        onChange={(e) => setCreate((p) => ({ ...p, role: e.target.value }))}
                                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                                    >
                                                        <option value="">Select role</option>
                                                        {roles.map((r) => (
                                                            <option key={r.id} value={r.name}>
                                                                {r.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="text-[11px] font-semibold text-slate-700">Designation</label>
                                                    <input
                                                        value={create.designation}
                                                        onChange={(e) => setCreate((p) => ({ ...p, designation: e.target.value }))}
                                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                                        placeholder="Accountant"
                                                    />
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <label className="text-[11px] font-semibold text-slate-700">Mobile number</label>
                                                    <input
                                                        value={create.phone}
                                                        onChange={(e) => setCreate((p) => ({ ...p, phone: e.target.value }))}
                                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                                        placeholder="+255..."
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="sm:col-span-2">
                                                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] text-slate-700">
                                                        <div className="font-semibold text-slate-900">Account details</div>
                                                        <div className="mt-1 text-slate-600">Username will be the email you entered.</div>
                                                    </div>
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <label className="text-[11px] font-semibold text-slate-700">Username</label>
                                                    <input
                                                        value={create.email}
                                                        readOnly
                                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] text-slate-700"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-[11px] font-semibold text-slate-700">Password</label>
                                                    <input
                                                        type="password"
                                                        value={create.password}
                                                        onChange={(e) => setCreate((p) => ({ ...p, password: e.target.value }))}
                                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                                        placeholder="Minimum 8 characters"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-[11px] font-semibold text-slate-700">Confirm password</label>
                                                    <input
                                                        type="password"
                                                        value={create.password_confirm}
                                                        onChange={(e) => setCreate((p) => ({ ...p, password_confirm: e.target.value }))}
                                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-6 py-4">
                                    {createStep === 2 ? (
                                        <button
                                            type="button"
                                            onClick={() => setCreateStep(1)}
                                            disabled={busy}
                                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                                        >
                                            Back
                                        </button>
                                    ) : null}
                                    <button
                                        type="button"
                                        onClick={() => setOpenCreate(false)}
                                        disabled={busy}
                                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (createStep === 1) {
                                                if (!create.first_name.trim() || !create.last_name.trim() || !create.email.trim() || !create.role.trim()) {
                                                    setError('Please fill required fields (first name, last name, email, role).');
                                                    return;
                                                }
                                                setError('');
                                                setCreateStep(2);
                                                return;
                                            }
                                            submitCreate();
                                        }}
                                        disabled={busy}
                                        className="rounded-xl bg-slate-900 px-4 py-2 text-[12px] font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                                    >
                                        {createStep === 1 ? 'Next' : busy ? 'Saving…' : 'Create Employee'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    <table className="w-full border border-slate-200 text-left text-[12px]">
                        <thead className="bg-slate-50 text-slate-600">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Full Name</th>
                                <th className="px-4 py-3 font-semibold">Email</th>
                                <th className="px-4 py-3 font-semibold">National ID</th>
                                <th className="px-4 py-3 font-semibold">Hire Date</th>
                                <th className="px-4 py-3 font-semibold">Sex</th>
                                <th className="px-4 py-3 font-semibold">Department</th>
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
                                        <td className="px-4 py-3 text-slate-700">{e.national_id || '-'}</td>
                                        <td className="px-4 py-3 text-slate-700">{e.hire_date ? new Date(e.hire_date).toLocaleDateString() : '-'}</td>
                                        <td className="px-4 py-3 text-slate-700">{e.sex || '-'}</td>
                                        <td className="px-4 py-3 text-slate-700">{e.department || '-'}</td>
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
                                                                openEditFor(e);
                                                            }}
                                                            className="block w-full px-4 py-2 text-left text-[12px] text-slate-700 hover:bg-slate-50"
                                                        >
                                                            Edit
                                                        </button>
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
                                                                openResetFor(e);
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
                                    <td className="px-4 py-6 text-slate-500" colSpan={12}>
                                        No employees found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            </AdminPanelLayout>
        </>
    );
}
