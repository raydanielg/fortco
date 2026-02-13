import SettingsSectionShell from './SettingsSectionShell';
import { CubeIcon, MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useMemo, useState } from 'react';

export default function ModuleSettings({ data, setData, submit, processing, errors, moduleSettings }) {
    const [query, setQuery] = useState('');

    const modules = Array.isArray(moduleSettings?.modules) ? moduleSettings.modules : [];
    const map = data.modules || {};

    const filtered = useMemo(() => {
        const q = String(query || '').trim().toLowerCase();
        if (!q) return modules;
        return modules.filter((m) => String(m.name || '').toLowerCase().includes(q));
    }, [modules, query]);

    const setEnabled = (name, enabled) => {
        setData('modules', {
            ...(data.modules || {}),
            [name]: !!enabled,
        });
    };

    const bulk = (enabled) => {
        const next = { ...(data.modules || {}) };
        for (const m of modules) {
            if (m?.name) next[m.name] = !!enabled;
        }
        setData('modules', next);
    };

    const Toggle = ({ checked, onChange }) => (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={
                'relative inline-flex h-6 w-11 items-center rounded-full transition ' +
                (checked ? 'bg-slate-900' : 'bg-slate-200')
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

    const Badge = ({ enabled }) => (
        <span
            className={
                'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ' +
                (enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700')
            }
        >
            {enabled ? 'Enabled' : 'Disabled'}
        </span>
    );

    return (
        <SettingsSectionShell title="" description="">
            <div className="-m-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 bg-white">
                    <div className="flex flex-wrap items-center justify-between gap-3 px-6">
                        <div className="my-3 inline-flex items-center gap-2 text-[12px] font-semibold text-slate-900">
                            <CubeIcon className="h-5 w-5" />
                            Modules
                        </div>

                        <button
                            type="button"
                            onClick={submit}
                            disabled={processing}
                            className="my-3 inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-2.5 text-[12px] font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                        >
                            Save
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="relative w-full max-w-sm">
                            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-[12px] text-slate-900 focus:border-slate-300 focus:outline-none"
                                placeholder="Search module…"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={() => bulk(true)}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Enable all
                            </button>
                            <button
                                type="button"
                                onClick={() => bulk(false)}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Disable all
                            </button>
                            <button
                                type="button"
                                onClick={() => window.location.reload()}
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                <ArrowPathIcon className="h-4 w-4" />
                                Refresh
                            </button>
                        </div>
                    </div>

                    {errors.modules ? <div className="mt-3 text-[12px] text-red-600">{errors.modules}</div> : null}

                    <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
                        <table className="w-full table-auto">
                            <thead className="bg-slate-50">
                                <tr className="text-left text-[12px] font-semibold text-slate-700">
                                    <th className="px-4 py-3">Module</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Enabled</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filtered.length ? (
                                    filtered.map((m) => {
                                        const name = m.name;
                                        const enabled = map[name] ?? !!m.enabled;
                                        return (
                                            <tr key={name} className="text-[12px] text-slate-700">
                                                <td className="px-4 py-3">
                                                    <div className="font-semibold text-slate-900">{name}</div>
                                                    <div className="mt-1 text-[11px] text-slate-500">Controls features and routes for this module.</div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge enabled={!!enabled} />
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <Toggle checked={!!enabled} onChange={(v) => setEnabled(name, v)} />
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-6 text-[12px] text-slate-500">
                                            No modules found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 text-[12px] text-slate-500">
                        Disabling a module may require a page refresh and can affect routes and menu visibility.
                    </div>
                </div>
            </div>
        </SettingsSectionShell>
    );
}
