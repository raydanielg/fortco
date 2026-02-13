import SettingsSectionShell from './SettingsSectionShell';

function formatBytes(bytes) {
    const n = Number(bytes) || 0;
    if (n < 1024) return `${n} B`;
    const kb = n / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    const mb = kb / 1024;
    if (mb < 1024) return `${mb.toFixed(2)} MB`;
    const gb = mb / 1024;
    return `${gb.toFixed(2)} GB`;
}

export default function StorageSettings({ stats, data, setData, submit, processing, errors }) {
    const usedPercent = Math.max(0, Math.min(100, Number(stats?.used_percent ?? 0)));
    const totalBytes = Number(stats?.total_bytes ?? 0);
    const quotaBytes = Number(stats?.quota_bytes ?? 0);
    const publicFiles = Number(stats?.public?.files ?? 0);
    const publicBytes = Number(stats?.public?.bytes ?? 0);
    const privateFiles = Number(stats?.private?.files ?? 0);
    const privateBytes = Number(stats?.private?.bytes ?? 0);
    const mediaCount = Number(stats?.media?.count ?? 0);
    const mediaBytes = Number(stats?.media?.bytes ?? 0);

    const inputClass =
        'w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20';

    return (
        <SettingsSectionShell
            title=""
            description=""
        >
            <div className="-m-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 bg-white">
                    <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3">
                        <div className="text-[12px] font-semibold text-slate-900">Storage Overview</div>
                        <button
                            type="button"
                            onClick={submit}
                            disabled={processing}
                            className="inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-2.5 text-[12px] font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                        >
                            Save
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid gap-5 lg:grid-cols-4">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total used</div>
                            <div className="mt-2 text-xl font-black text-slate-900">{formatBytes(totalBytes)}</div>
                            <div className="mt-1 text-[12px] text-slate-500">Across public + private</div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Public</div>
                            <div className="mt-2 text-xl font-black text-slate-900">{publicFiles}</div>
                            <div className="mt-1 text-[12px] text-slate-500">{formatBytes(publicBytes)}</div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Private</div>
                            <div className="mt-2 text-xl font-black text-slate-900">{privateFiles}</div>
                            <div className="mt-1 text-[12px] text-slate-500">{formatBytes(privateBytes)}</div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Media library</div>
                            <div className="mt-2 text-xl font-black text-slate-900">{mediaCount}</div>
                            <div className="mt-1 text-[12px] text-slate-500">{formatBytes(mediaBytes)}</div>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <div className="text-sm font-semibold text-slate-900">Quota Usage</div>
                                        <div className="mt-1 text-[12px] text-slate-500">
                                            {quotaBytes > 0 ? (
                                                <>
                                                    {formatBytes(totalBytes)} of {formatBytes(quotaBytes)} used
                                                </>
                                            ) : (
                                                'Quota is not set'
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-[12px] font-bold text-slate-900">{usedPercent}%</div>
                                </div>
                                <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-200">
                                    <div
                                        className="h-full rounded-full bg-red-600 transition"
                                        style={{ width: `${usedPercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                <div className="text-sm font-semibold text-slate-900">Configuration</div>
                                <div className="mt-1 text-[12px] text-slate-500">
                                    Defaults used by uploads and generated assets.
                                </div>

                                <div className="mt-5 grid gap-4">
                                    <div>
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Default disk</div>
                                        <div className="mt-2">
                                            <select
                                                value={data.storage_default_disk || 'public'}
                                                onChange={(e) => setData('storage_default_disk', e.target.value)}
                                                className={inputClass}
                                            >
                                                <option value="public">Public</option>
                                                <option value="local">Private</option>
                                            </select>
                                        </div>
                                        {errors.storage_default_disk ? (
                                            <div className="mt-1 text-[12px] text-red-600">{errors.storage_default_disk}</div>
                                        ) : null}
                                    </div>

                                    <div>
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Quota (MB)</div>
                                        <div className="mt-2">
                                            <input
                                                type="number"
                                                value={data.storage_quota_mb ?? 0}
                                                onChange={(e) => setData('storage_quota_mb', e.target.value)}
                                                className={inputClass}
                                                min={0}
                                            />
                                        </div>
                                        {errors.storage_quota_mb ? (
                                            <div className="mt-1 text-[12px] text-red-600">{errors.storage_quota_mb}</div>
                                        ) : null}
                                        <div className="mt-1 text-[11px] text-slate-500">Set 0 to disable quota.</div>
                                    </div>

                                    <div>
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Retention days</div>
                                        <div className="mt-2">
                                            <input
                                                type="number"
                                                value={data.storage_retention_days ?? 0}
                                                onChange={(e) => setData('storage_retention_days', e.target.value)}
                                                className={inputClass}
                                                min={0}
                                            />
                                        </div>
                                        {errors.storage_retention_days ? (
                                            <div className="mt-1 text-[12px] text-red-600">{errors.storage_retention_days}</div>
                                        ) : null}
                                        <div className="mt-1 text-[11px] text-slate-500">Set 0 to keep forever.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SettingsSectionShell>
    );
}
