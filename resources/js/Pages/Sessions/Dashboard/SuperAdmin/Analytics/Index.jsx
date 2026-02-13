import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    BarElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    BarElement,
    Tooltip,
    Legend
);

function KpiCard({ label, value }) {
    return (
        <div className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {label}
            </div>
            <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                {value}
            </div>
        </div>
    );
}

export default function Index() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const pollRef = useRef(null);

    const kpis = data?.kpis || {};
    const series = data?.series || {};
    const pies = data?.pies || {};

    const commonOptions = useMemo(
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
            labels: series.labels || [],
            datasets: [
                {
                    label: 'Users created',
                    data: series.users_created || [],
                    borderColor: '#0f172a',
                    backgroundColor: 'rgba(15, 23, 42, 0.10)',
                    tension: 0.35,
                    pointRadius: 2,
                },
            ],
        }),
        [series.labels, series.users_created]
    );

    const employeesBar = useMemo(
        () => ({
            labels: series.labels || [],
            datasets: [
                {
                    label: 'Employees created',
                    data: series.employees_created || [],
                    backgroundColor: 'rgba(14, 165, 233, 0.45)',
                    borderColor: '#0ea5e9',
                    borderWidth: 1,
                },
            ],
        }),
        [series.labels, series.employees_created]
    );

    const loginsLine = useMemo(
        () => ({
            labels: series.labels || [],
            datasets: [
                {
                    label: 'Logins',
                    data: series.logins || [],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.10)',
                    tension: 0.35,
                    pointRadius: 2,
                },
            ],
        }),
        [series.labels, series.logins]
    );

    const tasksPie = useMemo(
        () => ({
            labels: pies?.tasks?.labels || [],
            datasets: [
                {
                    data: pies?.tasks?.values || [],
                    backgroundColor: ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#64748b'],
                    borderWidth: 0,
                },
            ],
        }),
        [pies?.tasks?.labels, pies?.tasks?.values]
    );

    const messagesDoughnut = useMemo(
        () => ({
            labels: pies?.messages?.labels || ['Unread', 'Read'],
            datasets: [
                {
                    data: pies?.messages?.values || [0, 0],
                    backgroundColor: ['#ef4444', '#10b981'],
                    borderWidth: 0,
                },
            ],
        }),
        [pies?.messages?.labels, pies?.messages?.values]
    );

    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const resp = await fetch(route('admin.analytics.data'), {
                    headers: { Accept: 'application/json' },
                });
                if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                const json = await resp.json();
                if (mounted) setData(json);
            } catch (e) {
                if (mounted) setError(String(e?.message || e || 'Failed to load analytics'));
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchData();
        pollRef.current = setInterval(fetchData, 15000);

        return () => {
            mounted = false;
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, []);

    return (
        <DashboardLayout title="Admin Analytics" breadcrumbs={['Home', 'Analytics']}>
            <Head title="Admin Analytics" />

            <div className="grid gap-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <div className="text-lg font-semibold text-slate-900">Analytics</div>
                            <div className="mt-1 text-[12px] text-slate-600">
                                Overview charts and KPIs for the system.
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-[12px] font-semibold text-slate-900">
                                {loading ? 'Updating…' : error ? 'Offline' : 'Online'}
                            </div>
                            <div className="mt-1 text-[11px] text-slate-500">
                                Refresh interval: 15s
                            </div>
                        </div>
                    </div>
                    {error ? (
                        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[12px] text-rose-700">
                            {error}
                        </div>
                    ) : null}
                </div>

                <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <KpiCard label="Users" value={kpis.users ?? 0} />
                    <KpiCard label="Employees" value={kpis.employees ?? 0} />
                    <KpiCard label="Tasks" value={kpis.tasks ?? 0} />
                    <KpiCard label="Messages" value={kpis.messages ?? 0} />
                    <KpiCard label="Active sessions" value={kpis.active_sessions ?? 0} />
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                        <div className="text-sm font-semibold text-slate-900">Users created (14 days)</div>
                        <div className="mt-5 h-[320px]">
                            <Line data={usersLine} options={commonOptions} />
                        </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">Logins (14 days)</div>
                        <div className="mt-5 h-[320px]">
                            <Line data={loginsLine} options={commonOptions} />
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">Employees created (bar)</div>
                        <div className="mt-5 h-[320px]">
                            <Bar data={employeesBar} options={commonOptions} />
                        </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">Task status (pie)</div>
                        <div className="mt-5 h-[320px]">
                            <Pie data={tasksPie} options={pieOptions} />
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">Messages (doughnut)</div>
                        <div className="mt-5 h-[320px]">
                            <Doughnut data={messagesDoughnut} options={pieOptions} />
                        </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">Tasks (alternate view)</div>
                        <div className="mt-1 text-[12px] text-slate-600">
                            Same data as the pie, shown with another chart type.
                        </div>
                        <div className="mt-5 h-[320px]">
                            <Pie data={tasksPie} options={pieOptions} />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
