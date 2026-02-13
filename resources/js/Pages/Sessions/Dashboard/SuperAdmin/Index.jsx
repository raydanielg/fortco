import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import {
    FiUsers,
    FiUserCheck,
    FiShield,
    FiKey,
    FiActivity,
    FiSlash,
    FiMail,
    FiCheckSquare,
    FiAlertTriangle,
} from 'react-icons/fi';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
    Legend
);

function StatCard({ label, value, href, tone = 'slate', icon: Icon, hint }) {
    void tone;

    const content = (
        <div
            className="group h-full min-h-[132px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow"
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        {label}
                    </div>
                    <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                        {value}
                    </div>
                    {hint ? (
                        <div className="mt-1 text-[12px] text-slate-500">{hint}</div>
                    ) : null}
                </div>

                {Icon ? (
                    <div
                        className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm transition group-hover:scale-[1.04]"
                    >
                        <Icon className="h-6 w-6" />
                    </div>
                ) : null}
            </div>
        </div>
    );

    if (!href) return content;

    return (
        <a href={href} className="block">
            {content}
        </a>
    );
}

function QuickLink({ title, description, href }) {
    return (
        <a
            href={href}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow"
        >
            <div className="text-sm font-semibold text-slate-900">{title}</div>
            <div className="mt-1 text-[12px] text-slate-600">{description}</div>
        </a>
    );
}

export default function Index({ auth, stats, calendarEvents }) {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState('');
    const [tick, setTick] = useState(0);
    const pollingRef = useRef(null);

    const totals = metrics?.totals || stats?.totals || {};
    const trends = metrics?.trends || stats?.trends || {};
    const pie = metrics?.pie || {};
    const recent = metrics?.recent || {};
    const events = metrics?.calendarEvents || calendarEvents || [];
    const generatedAt = metrics?.generated_at || '';

    const secondsSinceRefresh = useMemo(() => {
        if (!generatedAt) return null;
        const ms = Date.now() - Date.parse(generatedAt);
        if (!Number.isFinite(ms) || ms < 0) return null;
        return Math.floor(ms / 1000);
    }, [generatedAt, tick]);

    const clockText = useMemo(() => {
        try {
            return new Date().toLocaleTimeString();
        } catch (e) {
            return '';
        }
    }, [tick]);

    const lineOptions = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
            },
            scales: {
                x: { grid: { display: false } },
                y: { beginAtZero: true, ticks: { precision: 0 } },
            },
        }),
        []
    );

    const pieOptions = useMemo(
        () => ({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
            },
        }),
        []
    );

    const usersLine = useMemo(
        () => ({
            labels: trends.labels || [],
            datasets: [
                {
                    label: 'Users created',
                    data: trends.users_created || [],
                    borderColor: '#0f172a',
                    backgroundColor: 'rgba(15, 23, 42, 0.08)',
                    tension: 0.35,
                    pointRadius: 2,
                },
            ],
        }),
        [trends.labels, trends.users_created]
    );

    const employeesLine = useMemo(
        () => ({
            labels: trends.labels || [],
            datasets: [
                {
                    label: 'Employees created',
                    data: trends.employees_created || [],
                    borderColor: '#0ea5e9',
                    backgroundColor: 'rgba(14, 165, 233, 0.10)',
                    tension: 0.35,
                    pointRadius: 2,
                },
            ],
        }),
        [trends.labels, trends.employees_created]
    );

    const loginsLine = useMemo(
        () => ({
            labels: trends.labels || [],
            datasets: [
                {
                    label: 'Logins',
                    data: trends.logins || [],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.10)',
                    tension: 0.35,
                    pointRadius: 2,
                },
            ],
        }),
        [trends.labels, trends.logins]
    );

    const taskPie = useMemo(
        () => ({
            labels: pie?.task_status?.labels || [],
            datasets: [
                {
                    data: pie?.task_status?.values || [],
                    backgroundColor: ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#64748b'],
                    borderWidth: 0,
                },
            ],
        }),
        [pie?.task_status?.labels, pie?.task_status?.values]
    );

    const messagesPie = useMemo(
        () => ({
            labels: pie?.messages?.labels || ['Unread', 'Read'],
            datasets: [
                {
                    data: pie?.messages?.values || [0, 0],
                    backgroundColor: ['#ef4444', '#10b981'],
                    borderWidth: 0,
                },
            ],
        }),
        [pie?.messages?.labels, pie?.messages?.values]
    );

    const upcomingTasks = useMemo(() => {
        if (!Array.isArray(events)) return [];
        return [...events]
            .filter((e) => e?.extendedProps?.kind === 'task')
            .filter((e) => typeof e?.start === 'string' && e.start)
            .sort((a, b) => String(a.start).localeCompare(String(b.start)))
            .slice(0, 10);
    }, [events]);

    useEffect(() => {
        let mounted = true;

        const ticker = setInterval(() => {
            setTick((x) => x + 1);
        }, 1000);

        const fetchMetrics = async () => {
            setLoading(true);
            setLoadError('');
            try {
                const resp = await fetch(route('admin.dashboard.metrics'), {
                    headers: { Accept: 'application/json' },
                });
                if (!resp.ok) {
                    throw new Error(`HTTP ${resp.status}`);
                }
                const json = await resp.json();
                if (mounted) {
                    setMetrics(json);
                }
            } catch (e) {
                if (mounted) {
                    setLoadError(String(e?.message || e || 'Failed to load metrics'));
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchMetrics();

        const intervalMs = 5000;
        pollingRef.current = setInterval(fetchMetrics, intervalMs);

        return () => {
            mounted = false;
            clearInterval(ticker);
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
            }
        };
    }, []);

    return (
        <DashboardLayout
            title="Super Admin Dashboard"
            breadcrumbs={['Home', 'Super Admin Dashboard']}
        >
            <Head title="Super Admin Dashboard" />

            <div className="grid gap-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <div className="text-sm text-slate-600">Hello 👋</div>
                            <div className="mt-1 text-xl font-semibold text-slate-900">
                                Mr. {auth.user.name}
                            </div>
                            <div className="mt-4 text-sm text-slate-700">
                                System overview, analytics, security and operations.
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                Live status
                            </div>
                            <div className="mt-1 text-[12px] text-slate-700">
                                {loading ? 'Updating…' : loadError ? 'Offline' : 'Online'}
                            </div>
                            <div className="mt-1 text-[11px] text-slate-500">
                                {clockText ? `Time: ${clockText}` : null}
                                {secondsSinceRefresh !== null ? ` • Updated ${secondsSinceRefresh}s ago` : null}
                            </div>
                        </div>
                    </div>

                    {loadError ? (
                        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[12px] text-rose-700">
                            {loadError}
                        </div>
                    ) : null}
                </div>

                <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        label="Users"
                        value={totals.users ?? 0}
                        href={route('admin.user-management.users')}
                        tone="slate"
                        icon={FiUsers}
                    />
                    <StatCard
                        label="Employees"
                        value={totals.employees ?? 0}
                        href={route('admin.user-management.employees')}
                        tone="blue"
                        icon={FiUserCheck}
                    />
                    <StatCard
                        label="Roles"
                        value={totals.roles ?? 0}
                        href={route('admin.user-management.roles')}
                        tone="emerald"
                        icon={FiShield}
                    />
                    <StatCard
                        label="Permissions"
                        value={totals.permissions ?? 0}
                        href={route('admin.user-management.permissions')}
                        tone="amber"
                        icon={FiKey}
                    />
                </div>

                <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        label="Active sessions"
                        value={totals.active_sessions ?? 0}
                        href={route('admin.user-management.sessions-logs')}
                        tone="slate"
                        icon={FiActivity}
                        hint="Last 15 minutes"
                    />
                    <StatCard
                        label="Banned users"
                        value={totals.banned_users ?? 0}
                        href={route('admin.user-management.users')}
                        tone="rose"
                        icon={FiSlash}
                    />
                    <StatCard
                        label="Tasks open"
                        value={totals.tasks_open ?? 0}
                        href={route('dashboard')}
                        tone="blue"
                        icon={FiCheckSquare}
                        hint={`Overdue: ${totals.tasks_overdue ?? 0}`}
                    />
                    <StatCard
                        label="Unread messages"
                        value={totals.messages_unread ?? 0}
                        href={route('dashboard')}
                        tone="amber"
                        icon={FiMail}
                        hint={`Total: ${totals.messages_total ?? 0}`}
                    />
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">Users trend</div>
                        <div className="mt-1 text-[12px] text-slate-600">New users created (7 days).</div>
                        <div className="mt-5 h-[220px]">
                            <Line data={usersLine} options={lineOptions} />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">Employees trend</div>
                        <div className="mt-1 text-[12px] text-slate-600">New employees created (7 days).</div>
                        <div className="mt-5 h-[220px]">
                            <Line data={employeesLine} options={lineOptions} />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">Login activity</div>
                        <div className="mt-1 text-[12px] text-slate-600">Successful logins (7 days).</div>
                        <div className="mt-5 h-[220px]">
                            <Line data={loginsLine} options={lineOptions} />
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <div className="text-sm font-semibold text-slate-900">System analytics</div>
                                <div className="mt-1 text-[12px] text-slate-600">
                                    Quick breakdown of tasks and messages.
                                </div>
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] font-semibold text-slate-800">
                                <FiAlertTriangle className="h-4 w-4" />
                                Overdue: {totals.tasks_overdue ?? 0}
                            </div>
                        </div>

                        <div className="mt-6 grid gap-6 sm:grid-cols-2">
                            <div className="h-[260px]">
                                <Pie data={taskPie} options={pieOptions} />
                            </div>
                            <div className="h-[260px]">
                                <Pie data={messagesPie} options={pieOptions} />
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="text-sm font-semibold text-slate-900">Recent login activity</div>
                            <div className="mt-1 text-[12px] text-slate-600">
                                Last 10 login records.
                            </div>

                            <div className="mt-4 divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200">
                                {(recent.login_activities || []).map((row) => (
                                    <div key={row.id} className="grid gap-1 px-4 py-3">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="truncate text-[12px] font-semibold text-slate-900">
                                                {row.user?.name || 'Unknown user'}
                                            </div>
                                            <div className="text-[11px] text-slate-500">
                                                {row.logged_in_at}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="truncate text-[11px] text-slate-600">
                                                {row.user?.email || ''}
                                            </div>
                                            <div className="text-[11px] text-slate-500">{row.ip || ''}</div>
                                        </div>
                                    </div>
                                ))}

                                {(recent.login_activities || []).length === 0 ? (
                                    <div className="px-4 py-4 text-[12px] text-slate-500">No records yet.</div>
                                ) : null}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="text-sm font-semibold text-slate-900">Last user logins</div>
                            <div className="mt-1 text-[12px] text-slate-600">
                                Who logged in most recently.
                            </div>

                            <div className="mt-4 divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200">
                                {(recent.last_user_logins || []).map((row) => (
                                    <div key={row.id} className="grid gap-1 px-4 py-3">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="truncate text-[12px] font-semibold text-slate-900">
                                                {row.name}
                                            </div>
                                            <div className="text-[11px] text-slate-500">
                                                {row.last_login_at}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="truncate text-[11px] text-slate-600">{row.email}</div>
                                            <div className="text-[11px] text-slate-500">{row.last_login_ip || ''}</div>
                                        </div>
                                    </div>
                                ))}

                                {(recent.last_user_logins || []).length === 0 ? (
                                    <div className="px-4 py-4 text-[12px] text-slate-500">No logins yet.</div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <div className="text-sm font-semibold text-slate-900">Calendar (Tasks)</div>
                            <div className="mt-1 text-[12px] text-slate-600">
                                Large calendar view. Tasks with due dates appear here.
                            </div>
                        </div>

                        <div className="min-w-[220px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                Next tasks
                            </div>
                            <div className="mt-2 grid gap-2">
                                {upcomingTasks.length ? (
                                    upcomingTasks.map((t) => (
                                        <div key={t.id} className="grid gap-0.5">
                                            <div className="truncate text-[12px] font-semibold text-slate-900">
                                                {t.title}
                                            </div>
                                            <div className="text-[11px] text-slate-500">{t.start}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-[12px] text-slate-500">No due tasks.</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
                        <FullCalendar
                            plugins={[dayGridPlugin]}
                            initialView="dayGridMonth"
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: '',
                            }}
                            height={720}
                            events={Array.isArray(events) ? events : []}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
