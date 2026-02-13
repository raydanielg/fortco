import SettingsSectionShell from './SettingsSectionShell';
import {
    EllipsisVerticalIcon,
    TrashIcon,
    DocumentMagnifyingGlassIcon,
    ArrowPathIcon,
    ShieldCheckIcon,
    WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function SecuritySettings() {
    const [active, setActive] = useState('main');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const [users, setUsers] = useState([]);
    const [openMenuUserId, setOpenMenuUserId] = useState(null);
    const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState('sessions');
    const [drawerUser, setDrawerUser] = useState(null);
    const [drawerSessions, setDrawerSessions] = useState([]);
    const [drawerLogs, setDrawerLogs] = useState([]);
    const [drawerLogLimit, setDrawerLogLimit] = useState(120);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmUser, setConfirmUser] = useState(null);
    const [confirmType, setConfirmType] = useState('clear_all');
    const [confirmSessionId, setConfirmSessionId] = useState(null);

    const [mainLoaded, setMainLoaded] = useState(false);
    const [pyramid, setPyramid] = useState({ l1: true, l2: true, l3: true, l4: true, l5: true, l6: true, l7: true });
    const [maintenance, setMaintenance] = useState({ enabled: false, message: '' });
    const [mainSaving, setMainSaving] = useState(false);

    const [logLines, setLogLines] = useState([]);
    const [logCursor, setLogCursor] = useState(0);
    const [logRunning, setLogRunning] = useState(true);
    const [autoScroll, setAutoScroll] = useState(true);
    const logBoxRef = useRef(null);

    const LS_CURSOR = 'security_live_logs_cursor';
    const LS_RUNNING = 'security_live_logs_running';

    const tabs = useMemo(
        () => [
            { key: 'main', label: 'Main' },
            { key: 'activities', label: 'Activities' },
            { key: 'live_logs', label: 'Live Logs' },
        ],
        [],
    );

    const tabClass = (isActive) =>
        'inline-flex items-center border-b-2 px-4 py-3 text-[12px] font-semibold transition ' +
        (isActive ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-900');

    const StatusDot = ({ active }) => (
        <span
            className={
                'inline-flex h-2.5 w-2.5 rounded-full ' +
                (active ? 'bg-emerald-500' : 'bg-red-500')
            }
        />
    );

    const ConfirmModal = () => {
        if (!confirmOpen) return null;

        const title = confirmType === 'delete_one' ? 'Deactivate Session' : 'Clear Session';
        const body =
            confirmType === 'delete_one'
                ? 'This will deactivate this session token and log out that device.'
                : 'This will log out this user on all devices.';

        return (
            <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
                <div
                    className="absolute inset-0 bg-black/40"
                    onClick={() => {
                        setConfirmOpen(false);
                        setConfirmUser(null);
                        setConfirmType('clear_all');
                        setConfirmSessionId(null);
                    }}
                />

                <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
                    <div className="text-[12px] font-semibold text-slate-900">{title}</div>
                    <div className="mt-2 text-[12px] text-slate-600">
                        {body}{' '}
                        <span className="font-semibold text-slate-900">{confirmUser?.name}</span>
                    </div>

                    <div className="mt-5 flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setConfirmOpen(false);
                                setConfirmUser(null);
                                setConfirmType('clear_all');
                                setConfirmSessionId(null);
                            }}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                const u = confirmUser;
                                const sid = confirmSessionId;
                                const type = confirmType;
                                setConfirmOpen(false);
                                setConfirmUser(null);
                                setConfirmType('clear_all');
                                setConfirmSessionId(null);
                                if (!u) return;
                                if (type === 'delete_one' && sid) {
                                    deleteSession(u, sid);
                                    return;
                                }
                                if (type === 'clear_all') {
                                    clearSessions(u);
                                }
                            }}
                            className="rounded-xl bg-red-600 px-4 py-2 text-[12px] font-semibold text-white hover:bg-red-500"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    useEffect(() => {
        const onDoc = (e) => {
            const el = e.target;
            if (el?.closest?.('[data-security-menu]')) return;
            setOpenMenuUserId(null);
        };
        document.addEventListener('click', onDoc);
        return () => document.removeEventListener('click', onDoc);
    }, []);

    const getCookie = (name) => {
        try {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) {
                return parts.pop().split(';').shift();
            }
            return '';
        } catch (e) {
            return '';
        }
    };

    const xsrfToken = () => {
        const raw = getCookie('XSRF-TOKEN');
        return raw ? decodeURIComponent(raw) : '';
    };

    const readJson = async (r) => {
        const text = await r.text();
        try {
            return text ? JSON.parse(text) : {};
        } catch (e) {
            return {};
        }
    };

    const fetchMain = () => {
        setError('');
        setMainLoaded(false);
        fetch(route('admin.security.main'), { credentials: 'same-origin' })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed');
                if (json?.pyramid) {
                    setPyramid({
                        l1: !!json.pyramid.l1,
                        l2: !!json.pyramid.l2,
                        l3: !!json.pyramid.l3,
                        l4: !!json.pyramid.l4,
                        l5: !!json.pyramid.l5,
                        l6: !!json.pyramid.l6,
                        l7: !!json.pyramid.l7,
                    });
                }
                if (json?.maintenance) {
                    setMaintenance({
                        enabled: !!json.maintenance.enabled,
                        message: json.maintenance.message || '',
                    });
                }
            })
            .catch((e) => setError(e?.message || 'Failed to load security settings'))
            .finally(() => setMainLoaded(true));
    };

    const saveMain = () => {
        setMainSaving(true);
        setError('');

        fetch(route('admin.security.main.update'), {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                'X-XSRF-TOKEN': xsrfToken(),
                Accept: 'application/json',
            },
            body: JSON.stringify({ pyramid, maintenance }),
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) {
                    throw new Error(json?.message || 'Failed to save');
                }
            })
            .catch((e) => setError(e?.message || 'Failed to save'))
            .finally(() => setMainSaving(false));
    };

    const fetchUsers = () => {
        setBusy(true);
        setError('');
        fetch(route('admin.security.users'), { credentials: 'same-origin' })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed');
                setUsers(Array.isArray(json?.users) ? json.users : []);
            })
            .catch((e) => setError(e?.message || 'Failed to load users'))
            .finally(() => setBusy(false));
    };

    useEffect(() => {
        if (active !== 'main') return;
        if (mainLoaded) return;
        fetchMain();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active]);

    useEffect(() => {
        if (active !== 'activities') return;
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active]);

    const openSessions = (u) => {
        setDrawerMode('sessions');
        setDrawerUser(u);
        setDrawerOpen(true);
        setDrawerSessions([]);
        setDrawerLogs([]);
        setDrawerLogLimit(120);
        setBusy(true);
        setError('');
        fetchDrawerSessions(u);
    };

    const fetchDrawerSessions = (u) => {
        fetch(route('admin.security.users.sessions', u.id), { credentials: 'same-origin' })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed');
                setDrawerSessions(Array.isArray(json?.sessions) ? json.sessions : []);
            })
            .catch((e) => setError(e?.message || 'Failed to load sessions'))
            .finally(() => setBusy(false));
    };

    const requestClearSessions = (u) => {
        setConfirmUser(u);
        setConfirmType('clear_all');
        setConfirmSessionId(null);
        setConfirmOpen(true);
    };

    const requestDeleteSession = (u, sessionId) => {
        setConfirmUser(u);
        setConfirmType('delete_one');
        setConfirmSessionId(sessionId);
        setConfirmOpen(true);
    };

    const deleteSession = (u, sessionId) => {
        setBusy(true);
        setError('');
        fetch(route('admin.security.users.sessions.delete', { user: u.id, sessionId }), {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                'X-XSRF-TOKEN': xsrfToken(),
                Accept: 'application/json',
            },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed');
                fetchDrawerSessions(u);
                fetchUsers();
            })
            .catch((e) => setError(e?.message || 'Failed to delete session'))
            .finally(() => setBusy(false));
    };

    const clearSessions = (u) => {
        setBusy(true);
        setError('');
        fetch(route('admin.security.users.sessions.clear', u.id), {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                'X-XSRF-TOKEN': xsrfToken(),
                Accept: 'application/json',
            },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed');
                fetchUsers();
                if (drawerOpen && drawerUser?.id === u.id) {
                    openSessions(u);
                }
            })
            .catch((e) => setError(e?.message || 'Failed to clear sessions'))
            .finally(() => setBusy(false));
    };

    const openUserMenu = (u, btnEl) => {
        if (!btnEl) {
            setOpenMenuUserId(openMenuUserId === u.id ? null : u.id);
            return;
        }

        const rect = btnEl.getBoundingClientRect();
        const width = 208;
        const left = Math.max(12, Math.min(window.innerWidth - width - 12, rect.right - width));
        const top = rect.bottom + 8;

        setMenuPos({ top, left });
        setOpenMenuUserId(openMenuUserId === u.id ? null : u.id);
    };

    const openLogs = (u) => {
        setDrawerMode('logs');
        setDrawerUser(u);
        setDrawerOpen(true);
        setDrawerSessions([]);
        setDrawerLogs([]);
        setDrawerLogLimit(120);
        setBusy(true);
        setError('');

        fetchDrawerLogs(u, 120);
    };

    const fetchDrawerLogs = (u, limit) => {
        fetch(route('admin.security.users.logs', u.id) + `?limit=${encodeURIComponent(limit)}`, { credentials: 'same-origin' })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed');
                setDrawerLogs(Array.isArray(json?.logs) ? json.logs : []);
            })
            .catch((e) => setError(e?.message || 'Failed to load logs'))
            .finally(() => setBusy(false));
    };

    useEffect(() => {
        if (!drawerOpen) return;
        if (!drawerUser?.id) return;

        const u = drawerUser;

        const t = setInterval(() => {
            if (drawerMode === 'sessions') {
                setBusy(true);
                fetchDrawerSessions(u);
            }

            if (drawerMode === 'logs') {
                setBusy(true);
                fetchDrawerLogs(u, drawerLogLimit);
            }
        }, 1500);

        return () => clearInterval(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [drawerOpen, drawerMode, drawerUser?.id, drawerLogLimit]);

    const Toggle = ({ checked, onChange, disabled }) => (
        <button
            type="button"
            onClick={() => !disabled && onChange(!checked)}
            className={
                'relative inline-flex h-6 w-11 items-center rounded-full transition ' +
                (checked ? 'bg-slate-900' : 'bg-slate-200') +
                (disabled ? ' opacity-60' : '')
            }
            aria-pressed={checked}
        >
            <span
                className={
                    'inline-block h-5 w-5 transform rounded-full bg-white transition ' +
                    (checked ? 'translate-x-5' : 'translate-x-1')
                }
            />
        </button>
    );

    const pollLogs = () => {
        fetch(route('admin.security.logs.tail', { cursor: logCursor, lines: 400 }), { credentials: 'same-origin' })
            .then((r) => r.json())
            .then((json) => {
                const lines = Array.isArray(json?.lines) ? json.lines : [];
                const cursor = Number(json?.cursor ?? 0);
                setLogCursor(cursor);
                try {
                    localStorage.setItem(LS_CURSOR, String(cursor));
                } catch (e) {
                    // ignore
                }
                if (lines.length) {
                    setLogLines((prev) => {
                        const next = prev.concat(lines);
                        return next.slice(-3000);
                    });
                }
            })
            .catch(() => {
                // ignore
            });
    };

    useEffect(() => {
        if (active !== 'live_logs') return;
        setLogLines([]);

        let storedCursor = 0;
        let storedRunning = true;
        try {
            storedCursor = Number(localStorage.getItem(LS_CURSOR) || 0);
            storedRunning = localStorage.getItem(LS_RUNNING) !== '0';
        } catch (e) {
            storedCursor = 0;
            storedRunning = true;
        }

        setLogCursor(Number.isFinite(storedCursor) ? storedCursor : 0);
        setLogRunning(!!storedRunning);
        // initial fetch
        pollLogs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active]);

    useEffect(() => {
        if (active !== 'live_logs') return;
        if (!logRunning) return;
        const t = setInterval(() => pollLogs(), 1200);
        return () => clearInterval(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active, logRunning, logCursor]);

    useEffect(() => {
        try {
            localStorage.setItem(LS_RUNNING, logRunning ? '1' : '0');
        } catch (e) {
            // ignore
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [logRunning]);

    useEffect(() => {
        if (active !== 'live_logs') return;
        if (!autoScroll) return;
        const el = logBoxRef.current;
        if (!el) return;
        el.scrollTop = el.scrollHeight;
    }, [logLines, active, autoScroll]);

    const Chip = ({ children }) => (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
            {children}
        </span>
    );

    const Drawer = () => {
        if (!drawerOpen) return null;

        return (
            <div className="fixed inset-0 z-50">
                <div
                    className="absolute inset-0 bg-black/30"
                    onClick={() => {
                        setDrawerOpen(false);
                        setDrawerUser(null);
                        setDrawerSessions([]);
                        setDrawerLogs([]);
                    }}
                />
                <div className="absolute right-0 top-0 h-full w-full max-w-3xl bg-white shadow-2xl">
                    <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                        <div>
                            <div className="text-[12px] font-semibold text-slate-900">
                                {drawerMode === 'sessions' ? 'User Sessions' : 'User Logs'}
                            </div>
                            <div className="mt-1 text-[12px] text-slate-500">{drawerUser?.name || ''}</div>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setDrawerOpen(false);
                                setDrawerUser(null);
                                setDrawerSessions([]);
                                setDrawerLogs([]);
                            }}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Close
                        </button>
                    </div>

                    <div className="p-5">
                        {drawerMode === 'sessions' ? (
                            <div className="grid gap-3">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="text-[12px] font-semibold text-slate-900">Sessions</div>
                                    <button
                                        type="button"
                                        onClick={() => drawerUser && requestClearSessions(drawerUser)}
                                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-red-700 hover:bg-red-50"
                                    >
                                        Clear All
                                    </button>
                                </div>

                                {drawerSessions.length ? (
                                    drawerSessions.map((s) => (
                                        <div key={s.id} className="rounded-xl border border-slate-200 bg-white p-4">
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="text-[12px] font-semibold text-slate-900">{s.ip_address || 'Unknown IP'}</div>
                                                <span
                                                    className={
                                                        'rounded-full px-2.5 py-1 text-[10px] font-semibold ' +
                                                        (s.last_activity && Date.now() - new Date(s.last_activity).getTime() <= 15 * 60 * 1000
                                                            ? 'bg-emerald-50 text-emerald-700'
                                                            : 'bg-slate-100 text-slate-700')
                                                    }
                                                >
                                                    {s.last_activity && Date.now() - new Date(s.last_activity).getTime() <= 15 * 60 * 1000 ? 'Active' : 'Old'}
                                                </span>
                                            </div>

                                            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                                                <div className="text-[11px] font-semibold text-slate-700 break-all">Token: {s.id}</div>
                                                <button
                                                    type="button"
                                                    onClick={() => drawerUser && requestDeleteSession(drawerUser, s.id)}
                                                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-red-700 hover:bg-red-50"
                                                >
                                                    Deactivate
                                                </button>
                                            </div>
                                            <div className="mt-1 text-[11px] text-slate-500 break-words">{s.user_agent || ''}</div>
                                            <div className="mt-2 text-[11px] text-slate-500">{s.last_activity || ''}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-[12px] text-slate-500">No sessions found.</div>
                                )}
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="text-[12px] font-semibold text-slate-900">Requests</div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const next = Math.min(300, drawerLogLimit + 60);
                                            setDrawerLogLimit(next);
                                            if (drawerUser) {
                                                setBusy(true);
                                                fetchDrawerLogs(drawerUser, next);
                                            }
                                        }}
                                        disabled={drawerLogLimit >= 300}
                                        className={
                                            'rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold ' +
                                            (drawerLogLimit >= 300
                                                ? 'text-slate-400'
                                                : 'text-slate-700 hover:bg-slate-50')
                                        }
                                    >
                                        Load more
                                    </button>
                                </div>

                                {drawerLogs.length ? (
                                    drawerLogs
                                        .slice()
                                        .reverse()
                                        .map((l, idx) => (
                                            <div key={idx} className="rounded-xl border border-slate-200 bg-white p-4">
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <div className="inline-flex items-center gap-2">
                                                        <span className="rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white">
                                                            {l.method || '-'}
                                                        </span>
                                                        <span
                                                            className={
                                                                'rounded-md px-2 py-1 text-[10px] font-semibold ' +
                                                                ((Number(l.status) || 0) >= 400
                                                                    ? 'bg-red-50 text-red-700'
                                                                    : 'bg-emerald-50 text-emerald-700')
                                                            }
                                                        >
                                                            {l.status || '-'}
                                                        </span>
                                                        <span className="text-[11px] text-slate-500">{l.duration_ms ? `${l.duration_ms}ms` : ''}</span>
                                                    </div>
                                                    <div className="text-[11px] text-slate-500">{l.at || ''}</div>
                                                </div>

                                                <div className="mt-2 break-words text-[12px] font-semibold text-slate-900">{l.path || '-'}</div>
                                                <div className="mt-1 text-[11px] text-slate-500 break-words">{l.referer ? `From: ${l.referer}` : ''}</div>
                                                <div className="mt-1 text-[11px] text-slate-500">{l.ip ? `IP: ${l.ip}` : ''}</div>
                                            </div>
                                        ))
                                ) : (
                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-[12px] text-slate-600">
                                        No request logs yet. Browse the site using this user account, then refresh.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <SettingsSectionShell
            title=""
            description=""
        >
            <div className="-m-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6">
                    <div className="flex items-center">
                        {tabs.map((t) => (
                            <button
                                key={t.key}
                                type="button"
                                onClick={() => {
                                    setError('');
                                    setActive(t.key);
                                }}
                                className={tabClass(active === t.key)}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    <div className="my-3 text-[12px] text-slate-500">{busy ? 'Working…' : ''}</div>
                </div>

                {error ? (
                    <div className="border-b border-slate-200 bg-red-50 px-6 py-3 text-[12px] text-red-700">{error}</div>
                ) : null}

                <div className="p-6">
                    {active === 'main' ? (
                        <div className="grid gap-5">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-900">
                                    <ShieldCheckIcon className="h-4 w-4" />
                                    FORTCO Security Pyramid
                                </div>

                                <button
                                    type="button"
                                    onClick={saveMain}
                                    disabled={mainSaving}
                                    className={
                                        'rounded-xl px-4 py-2 text-[12px] font-semibold text-white ' +
                                        (mainSaving ? 'bg-slate-400' : 'bg-slate-900 hover:bg-slate-800')
                                    }
                                >
                                    {mainSaving ? 'Saving…' : 'Save'}
                                </button>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white">
                                <div className="border-b border-slate-200 px-5 py-4">
                                    <div className="text-[12px] font-semibold text-slate-900">Levels</div>
                                    <div className="mt-1 text-[12px] text-slate-500">Enable or disable security layers.</div>
                                </div>

                                <div className="divide-y divide-slate-200">
                                    {[
                                        {
                                            key: 'l7',
                                            label: 'L7 — Advanced Defense',
                                            meta: 'SIEM, SOAR, XDR, ZTNA',
                                        },
                                        {
                                            key: 'l6',
                                            label: 'L6 — Privileged Access Management',
                                            meta: 'PAM, JIT, Firefighter, Vault',
                                        },
                                        {
                                            key: 'l5',
                                            label: 'L5 — System Hardening & Audit',
                                            meta: 'CIS Benchmarks, Immutable Logs',
                                        },
                                        {
                                            key: 'l4',
                                            label: 'L4 — Application Security',
                                            meta: 'WAF, RASP, CSP, Anti-XSS/SQLi',
                                        },
                                        {
                                            key: 'l3',
                                            label: 'L3 — Identity & Access Governance',
                                            meta: 'IAM, RBAC, ABAC, SoD, MFA',
                                        },
                                        {
                                            key: 'l2',
                                            label: 'L2 — Code & Dependency',
                                            meta: 'SAST, DAST, SCA, Secure Coding',
                                        },
                                        {
                                            key: 'l1',
                                            label: 'L1 — Infrastructure Security',
                                            meta: 'Network, Server, Encryption',
                                        },
                                    ].map((l) => (
                                        <div key={l.key} className="flex items-center justify-between gap-4 px-5 py-4">
                                            <div className="min-w-0">
                                                <div className="text-[12px] font-semibold text-slate-900">{l.label}</div>
                                                <div className="mt-1 text-[12px] text-slate-500">{l.meta}</div>
                                            </div>

                                            <Toggle
                                                checked={!!pyramid[l.key]}
                                                onChange={(v) => setPyramid((p) => ({ ...p, [l.key]: v }))}
                                                disabled={!mainLoaded || mainSaving}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white">
                                <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
                                    <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-900">
                                        <WrenchScrewdriverIcon className="h-4 w-4" />
                                        Maintenance Mode
                                    </div>

                                    <Toggle
                                        checked={maintenance.enabled}
                                        onChange={(v) => setMaintenance((m) => ({ ...m, enabled: v }))}
                                        disabled={!mainLoaded || mainSaving}
                                    />
                                </div>

                                <div className="px-5 py-4">
                                    <label className="block text-[12px] font-semibold text-slate-700">Message</label>
                                    <input
                                        value={maintenance.message}
                                        onChange={(e) => setMaintenance((m) => ({ ...m, message: e.target.value }))}
                                        disabled={!mainLoaded || mainSaving}
                                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 outline-none ring-0 focus:border-slate-300"
                                        placeholder="Optional message shown to users"
                                    />
                                    <div className="mt-2 text-[12px] text-slate-500">
                                        This setting is stored in database. You can later connect it to Laravel maintenance mode.
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : active === 'activities' ? (
                        <div>
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="text-[12px] font-semibold text-slate-900">Users</div>
                                <button
                                    type="button"
                                    onClick={fetchUsers}
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    <ArrowPathIcon className="h-4 w-4" />
                                    Refresh
                                </button>
                            </div>

                            <div className="mt-4 rounded-xl border border-slate-200 bg-white">
                                <div className="max-h-[560px] overflow-auto">
                                    <table className="w-full table-auto">
                                        <thead className="sticky top-0 z-10 bg-slate-50">
                                        <tr className="text-left text-[12px] font-semibold text-slate-700">
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">User</th>
                                            <th className="px-4 py-3">Sessions</th>
                                            <th className="px-4 py-3">Last Activity</th>
                                            <th className="px-4 py-3 text-right">Action</th>
                                        </tr>
                                        </thead>

                                        <tbody className="divide-y divide-slate-200">
                                            {users.length ? (
                                                users.map((u) => (
                                                    <tr key={u.id} className="text-[12px] text-slate-700">
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-2">
                                                                <StatusDot active={!!u.active} />
                                                                <span className="text-[12px] font-semibold text-slate-700">
                                                                    {u.active ? 'Active' : 'Offline'}
                                                                </span>
                                                            </div>
                                                        </td>

                                                        <td className="px-4 py-3">
                                                            <div className="font-semibold text-slate-900">{u.name}</div>
                                                            <div className="text-slate-500">{u.email}</div>
                                                        </td>

                                                        <td className="px-4 py-3">
                                                            {u.sessions_count || 0}
                                                        </td>

                                                        <td className="px-4 py-3 text-slate-500">
                                                            {u.last_activity || '-'}
                                                        </td>

                                                        <td className="px-4 py-3 text-right">
                                                            <div className="inline-block" data-security-menu>
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => openUserMenu(u, e.currentTarget)}
                                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                                                >
                                                                    <EllipsisVerticalIcon className="h-5 w-5" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={5} className="px-4 py-6 text-[12px] text-slate-500">
                                                        No users found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {openMenuUserId ? (
                                <div
                                    data-security-menu
                                    className="fixed z-[60] w-52 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
                                    style={{ top: menuPos.top, left: menuPos.left }}
                                >
                                    {(() => {
                                        const u = users.find((x) => x.id === openMenuUserId);
                                        if (!u) return null;

                                        return (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setOpenMenuUserId(null);
                                                        openSessions(u);
                                                    }}
                                                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                                                >
                                                    <DocumentMagnifyingGlassIcon className="h-4 w-4" />
                                                    Sessions
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setOpenMenuUserId(null);
                                                        openLogs(u);
                                                    }}
                                                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                                                >
                                                    <DocumentMagnifyingGlassIcon className="h-4 w-4" />
                                                    Logs
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setOpenMenuUserId(null);
                                                        requestClearSessions(u);
                                                    }}
                                                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-[12px] font-semibold text-red-700 hover:bg-red-50"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                    Clear Session
                                                </button>
                                            </>
                                        );
                                    })()}
                                </div>
                            ) : null}

                            <ConfirmModal />
                            <Drawer />
                        </div>
                    ) : (
                        <div>
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="text-[12px] font-semibold text-slate-900">Live Logs</div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setLogLines([]);
                                            setLogCursor(0);
                                            try {
                                                localStorage.setItem(LS_CURSOR, '0');
                                            } catch (e) {
                                                // ignore
                                            }
                                        }}
                                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                                    >
                                        Clear
                                    </button>
                                    <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                            checked={autoScroll}
                                            onChange={(e) => setAutoScroll(e.target.checked)}
                                        />
                                        Auto-scroll
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setLogRunning((v) => !v)}
                                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                                    >
                                        {logRunning ? 'Pause' : 'Resume'}
                                    </button>
                                </div>
                            </div>

                            <div
                                ref={logBoxRef}
                                className="mt-4 h-[520px] overflow-auto rounded-xl border border-slate-200 bg-black p-4 font-mono text-[11px] text-slate-100"
                            >
                                {logLines.length ? (
                                    logLines.map((l, idx) => (
                                        <div key={idx} className="whitespace-pre-wrap break-words">
                                            {l}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-slate-400">Waiting for logs…</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </SettingsSectionShell>
    );
}
