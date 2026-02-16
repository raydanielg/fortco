import AdminPanelLayout from '@/Layouts/AdminPanelLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

export default function SessionsLogs() {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');

    const [sessions, setSessions] = useState([]);
    const [logs, setLogs] = useState([]);

    const [activeTab, setActiveTab] = useState('sessions');

    const readJson = async (r) => {
        const text = await r.text();
        try {
            return text ? JSON.parse(text) : {};
        } catch (e) {
            return {};
        }
    };

    const loadUsers = () => {
        setBusy(true);
        setError('');
        fetch(route('admin.security.users'), {
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to load users');
                const list = Array.isArray(json?.users) ? json.users : [];
                setUsers(list);

                const qsId = (() => {
                    try {
                        return new URLSearchParams(window.location.search).get('user') || '';
                    } catch (e) {
                        return '';
                    }
                })();

                if (!selectedUserId) {
                    const exists = qsId && list.some((u) => String(u.id) === String(qsId));
                    if (exists) setSelectedUserId(String(qsId));
                    else if (list[0]?.id) setSelectedUserId(String(list[0].id));
                }
            })
            .catch((e) => setError(e?.message || 'Failed to load users'))
            .finally(() => setBusy(false));
    };

    const loadSessions = (userId) => {
        if (!userId) return;
        setBusy(true);
        setError('');
        fetch(route('admin.security.users.sessions', { user: userId }), {
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to load sessions');
                setSessions(Array.isArray(json?.sessions) ? json.sessions : []);
            })
            .catch((e) => setError(e?.message || 'Failed to load sessions'))
            .finally(() => setBusy(false));
    };

    const loadLogs = (userId) => {
        if (!userId) return;
        setBusy(true);
        setError('');
        fetch(route('admin.security.users.logs', { user: userId, limit: 120 }), {
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to load logs');
                setLogs(Array.isArray(json?.logs) ? json.logs : []);
            })
            .catch((e) => setError(e?.message || 'Failed to load logs'))
            .finally(() => setBusy(false));
    };

    useEffect(() => {
        loadUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!selectedUserId) return;
        loadSessions(selectedUserId);
        loadLogs(selectedUserId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedUserId]);

    const selectedUser = useMemo(() => users.find((u) => String(u.id) === String(selectedUserId)) || null, [users, selectedUserId]);

    const clearAllSessions = () => {
        if (!selectedUserId) return;
        if (!window.confirm('Clear ALL sessions for this user?')) return;

        setBusy(true);
        setError('');
        fetch(route('admin.security.users.sessions.clear', { user: selectedUserId }), {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                Accept: 'application/json',
            },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to clear sessions');
                loadSessions(selectedUserId);
            })
            .catch((e) => setError(e?.message || 'Failed to clear sessions'))
            .finally(() => setBusy(false));
    };

    const deleteSession = (sessionId) => {
        if (!selectedUserId || !sessionId) return;
        if (!window.confirm('Delete this session?')) return;

        setBusy(true);
        setError('');
        fetch(route('admin.security.users.sessions.delete', { user: selectedUserId, sessionId }), {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                Accept: 'application/json',
            },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to delete session');
                loadSessions(selectedUserId);
            })
            .catch((e) => setError(e?.message || 'Failed to delete session'))
            .finally(() => setBusy(false));
    };

    const tabClass = (isActive) =>
        'inline-flex items-center border-b-2 px-4 py-3 text-[12px] font-semibold transition ' +
        (isActive ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-900');

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
            <Head title="Sessions & Logs" />

            <AdminPanelLayout title="User Management" active="sessions-logs" items={items}>

            <div className="rounded-2xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-6 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <div className="text-sm font-semibold text-slate-900">Sessions & Logs</div>
                            <div className="mt-1 text-[12px] text-slate-500">View sessions/devices and recent HTTP request logs per user.</div>
                        </div>
                        <div className="text-[12px] text-slate-500">{busy ? 'Working…' : ''}</div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        <select
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className="w-full max-w-md rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] text-slate-900 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        >
                            {users.map((u) => (
                                <option key={u.id} value={String(u.id)}>
                                    {u.name} ({u.email})
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={() => {
                                loadUsers();
                            }}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Refresh users
                        </button>
                    </div>

                    {selectedUser ? (
                        <div className="mt-3 text-[12px] text-slate-600">
                            Selected: <span className="font-semibold text-slate-900">{selectedUser.name}</span>
                        </div>
                    ) : null}

                    <div className="mt-4 flex items-center gap-1 px-2">
                        <button type="button" onClick={() => setActiveTab('sessions')} className={tabClass(activeTab === 'sessions')}>
                            Sessions
                        </button>
                        <button type="button" onClick={() => setActiveTab('logs')} className={tabClass(activeTab === 'logs')}>
                            Logs
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {error ? (
                        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">{error}</div>
                    ) : null}

                    {activeTab === 'sessions' ? (
                        <div>
                            <div className="mb-3 flex items-center justify-end">
                                <button
                                    type="button"
                                    onClick={clearAllSessions}
                                    className="rounded-xl border border-red-200 bg-white px-4 py-2 text-[12px] font-semibold text-red-700 hover:bg-red-50"
                                >
                                    Clear all sessions
                                </button>
                            </div>

                            <div className="overflow-auto rounded-xl border border-slate-200">
                                <table className="min-w-full text-left text-[12px]">
                                    <thead className="bg-slate-50 text-slate-600">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold">Session ID</th>
                                            <th className="px-4 py-3 font-semibold">IP</th>
                                            <th className="px-4 py-3 font-semibold">User Agent</th>
                                            <th className="px-4 py-3 font-semibold">Last Activity</th>
                                            <th className="px-4 py-3 font-semibold" />
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {sessions.length ? (
                                            sessions.map((s) => (
                                                <tr key={s.id}>
                                                    <td className="px-4 py-3 font-mono text-[11px] text-slate-900 break-all">{s.id}</td>
                                                    <td className="px-4 py-3 text-slate-700">{s.ip_address || '-'}</td>
                                                    <td className="px-4 py-3 text-slate-700 max-w-[380px] truncate">{s.user_agent || '-'}</td>
                                                    <td className="px-4 py-3 text-slate-700">{s.last_activity ? new Date(s.last_activity).toLocaleString() : '-'}</td>
                                                    <td className="px-4 py-3 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteSession(s.id)}
                                                            className="rounded-xl border border-red-200 bg-white px-3 py-2 text-[12px] font-semibold text-red-700 hover:bg-red-50"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="px-4 py-6 text-slate-500">
                                                    No sessions found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-4 text-[12px] text-slate-500">
                                Note: session management actions require <span className="font-semibold text-slate-700">SESSION_DRIVER=database</span>.
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="mb-3 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => loadLogs(selectedUserId)}
                                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Refresh logs
                                </button>
                            </div>

                            <div className="overflow-auto rounded-xl border border-slate-200">
                                <table className="min-w-full text-left text-[12px]">
                                    <thead className="bg-slate-50 text-slate-600">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold">At</th>
                                            <th className="px-4 py-3 font-semibold">Method</th>
                                            <th className="px-4 py-3 font-semibold">Path</th>
                                            <th className="px-4 py-3 font-semibold">Status</th>
                                            <th className="px-4 py-3 font-semibold">Duration</th>
                                            <th className="px-4 py-3 font-semibold">IP</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {logs.length ? (
                                            logs.map((l, idx) => (
                                                <tr key={idx}>
                                                    <td className="px-4 py-3 text-slate-700">{l.at ? new Date(l.at).toLocaleString() : '-'}</td>
                                                    <td className="px-4 py-3 font-mono text-[11px] text-slate-900">{l.method || '-'}</td>
                                                    <td className="px-4 py-3 font-mono text-[11px] text-slate-700 break-all">{l.path || '-'}</td>
                                                    <td className="px-4 py-3 text-slate-700">{l.status ?? '-'}</td>
                                                    <td className="px-4 py-3 text-slate-700">{l.duration_ms != null ? `${l.duration_ms} ms` : '-'}</td>
                                                    <td className="px-4 py-3 text-slate-700">{l.ip || '-'}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="px-4 py-6 text-slate-500">
                                                    No logs found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-4 text-[12px] text-slate-500">Logs are read from server log and filtered by user_id (HTTP_REQUEST entries).</div>
                        </div>
                    )}
                </div>
            </div>
            </AdminPanelLayout>
        </>
    );
}
