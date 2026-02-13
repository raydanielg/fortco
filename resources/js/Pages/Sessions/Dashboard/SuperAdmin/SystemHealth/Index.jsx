import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function StatusPill({ ok, text }) {
    return (
        <div
            className={`inline-flex items-center rounded-full border px-2 py-1 text-[11px] font-semibold ${
                ok
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-rose-200 bg-rose-50 text-rose-700'
            }`}
        >
            {text}
        </div>
    );
}

function HealthCard({ title, ok, ms, message }) {
    return (
        <div className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="text-[12px] font-semibold text-slate-900">{title}</div>
                    <div className="mt-1 text-[11px] text-slate-500">{message || ''}</div>
                </div>
                <div className="text-right">
                    <StatusPill ok={ok} text={ok ? 'Healthy' : 'Fail'} />
                    <div className="mt-2 text-[11px] text-slate-500">{ms !== null ? `${ms}ms` : ''}</div>
                </div>
            </div>
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 py-2 last:border-b-0">
            <div className="text-[12px] text-slate-600">{label}</div>
            <div className="text-[12px] font-semibold text-slate-900">{value}</div>
        </div>
    );
}

export default function Index() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const pollRef = useRef(null);

    const checks = data?.checks || {};
    const queue = data?.queue || {};
    const sessions = data?.sessions || {};
    const runtime = data?.runtime || {};

    const barData = useMemo(
        () => ({
            labels: ['Jobs', 'Failed Jobs', 'Sessions', 'Active Sessions (15m)'],
            datasets: [
                {
                    label: 'Counts',
                    data: [
                        queue.jobs ?? 0,
                        queue.failed_jobs ?? 0,
                        sessions.total ?? 0,
                        sessions.active_15m ?? 0,
                    ],
                    backgroundColor: ['#0ea5e9', '#ef4444', '#64748b', '#10b981'],
                    borderWidth: 0,
                },
            ],
        }),
        [queue.jobs, queue.failed_jobs, sessions.total, sessions.active_15m]
    );

    const barOptions = useMemo(
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

    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                const resp = await fetch(route('admin.system-health.data'), {
                    headers: { Accept: 'application/json' },
                });
                if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                const json = await resp.json();
                if (mounted) setData(json);
            } catch (e) {
                if (mounted) setError(String(e?.message || e || 'Failed to load system health'));
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchData();
        pollRef.current = setInterval(fetchData, 10000);

        return () => {
            mounted = false;
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, []);

    return (
        <DashboardLayout title="System Health" breadcrumbs={['Home', 'System Health']}>
            <Head title="System Health" />

            <div className="grid gap-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <div className="text-lg font-semibold text-slate-900">System Health</div>
                            <div className="mt-1 text-[12px] text-slate-600">
                                Live health checks for database, cache, queue and sessions.
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-[12px] font-semibold text-slate-900">
                                {loading ? 'Updating…' : error ? 'Offline' : 'Online'}
                            </div>
                            <div className="mt-1 text-[11px] text-slate-500">Refresh interval: 10s</div>
                        </div>
                    </div>

                    {error ? (
                        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[12px] text-rose-700">
                            {error}
                        </div>
                    ) : null}
                </div>

                <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <HealthCard
                        title="Database"
                        ok={!!checks.db?.ok}
                        ms={checks.db?.ms ?? null}
                        message={checks.db?.message || ''}
                    />
                    <HealthCard
                        title="Cache"
                        ok={!!checks.cache?.ok}
                        ms={checks.cache?.ms ?? null}
                        message={checks.cache?.message || ''}
                    />
                    <HealthCard
                        title="Queue"
                        ok={!!checks.queue?.ok}
                        ms={null}
                        message={checks.queue?.message || `Driver: ${queue.driver || '-'}`}
                    />
                    <HealthCard
                        title="Sessions"
                        ok={!!checks.sessions?.ok}
                        ms={null}
                        message={checks.sessions?.message || `Driver: ${sessions.driver || '-'}`}
                    />
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                        <div className="text-sm font-semibold text-slate-900">Operational counters</div>
                        <div className="mt-1 text-[12px] text-slate-600">
                            Queue and session counters.
                        </div>
                        <div className="mt-5 h-[320px]">
                            <Bar data={barData} options={barOptions} />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">Runtime</div>
                        <div className="mt-4">
                            <InfoRow label="PHP" value={runtime.php_version || '-'} />
                            <InfoRow label="Laravel" value={runtime.laravel_version || '-'} />
                            <InfoRow label="Env" value={runtime.app_env || '-'} />
                            <InfoRow label="Debug" value={runtime.app_debug ? 'true' : 'false'} />
                            <InfoRow label="Timezone" value={runtime.timezone || '-'} />
                            <InfoRow label="Memory usage" value={`${runtime.memory_usage_mb ?? 0} MB`} />
                            <InfoRow label="Memory peak" value={`${runtime.memory_peak_mb ?? 0} MB`} />
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">Queue details</div>
                        <div className="mt-4">
                            <InfoRow label="Driver" value={queue.driver || '-'} />
                            <InfoRow label="Jobs" value={queue.jobs ?? 0} />
                            <InfoRow label="Failed jobs" value={queue.failed_jobs ?? 0} />
                        </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">Sessions details</div>
                        <div className="mt-4">
                            <InfoRow label="Driver" value={sessions.driver || '-'} />
                            <InfoRow label="Total" value={sessions.total ?? 0} />
                            <InfoRow label="Active (15m)" value={sessions.active_15m ?? 0} />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
