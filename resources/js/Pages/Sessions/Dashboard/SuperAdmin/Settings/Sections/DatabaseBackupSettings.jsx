import SettingsSectionShell from './SettingsSectionShell';
import { CircleStackIcon, ArrowDownTrayIcon, TrashIcon, ArrowPathIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { useEffect, useMemo, useState } from 'react';

export default function DatabaseBackupSettings() {
    const [tab, setTab] = useState('backup');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [files, setFiles] = useState([]);
    const [driver, setDriver] = useState('');

    const [restoreFile, setRestoreFile] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, name: '' });

    const [exportOpen, setExportOpen] = useState(false);
    const [exportState, setExportState] = useState('idle');
    const [exportFile, setExportFile] = useState('');

    const restoreExt = driver === 'sqlite' ? '.sqlite' : '.sql';

    const tabClass = (isActive) =>
        'inline-flex items-center border-b-2 px-4 py-3 text-[12px] font-semibold transition ' +
        (isActive ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-900');

    const readJson = async (r) => {
        const text = await r.text();
        try {
            return text ? JSON.parse(text) : {};
        } catch (e) {
            return {};
        }
    };

    const ExportModal = () => {
        if (!exportOpen) return null;

        return (
            <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/40" onClick={() => exportState !== 'running' && setExportOpen(false)} />
                <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
                    <div className="text-[12px] font-semibold text-slate-900">Export Database</div>
                    <div className="mt-2 text-[12px] text-slate-600">
                        {exportState === 'running'
                            ? 'Execution running… exporting tables and data.'
                            : exportState === 'done'
                              ? 'Export completed.'
                              : 'Ready.'}
                    </div>

                    {exportState === 'running' ? (
                        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-[12px] text-slate-600">
                            Please wait…
                        </div>
                    ) : exportState === 'done' && exportFile ? (
                        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                            <div className="font-mono text-[11px] font-semibold text-slate-900 break-all">{exportFile}</div>
                            <a
                                href={route('admin.database-backups.download', { file: exportFile })}
                                className="mt-3 inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-[12px] font-semibold text-white hover:bg-slate-800"
                            >
                                Download backup
                            </a>
                        </div>
                    ) : null}

                    <div className="mt-5 flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setExportOpen(false)}
                            disabled={exportState === 'running'}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const DeleteConfirmModal = () => {
        if (!deleteConfirm.open) return null;
        return (
            <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
                <div
                    className="absolute inset-0 bg-black/40"
                    onClick={() => setDeleteConfirm({ open: false, name: '' })}
                />
                <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
                    <div className="text-[12px] font-semibold text-slate-900">Delete Backup</div>
                    <div className="mt-2 text-[12px] text-slate-600 break-all">
                        Delete <span className="font-semibold text-slate-900">{deleteConfirm.name}</span>?
                    </div>
                    <div className="mt-5 flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setDeleteConfirm({ open: false, name: '' })}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                const n = deleteConfirm.name;
                                setDeleteConfirm({ open: false, name: '' });
                                if (n) doDelete(n);
                            }}
                            className="rounded-xl bg-red-600 px-4 py-2 text-[12px] font-semibold text-white hover:bg-red-500"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const listBackups = () => {
        setBusy(true);
        setError('');
        fetch(route('admin.database-backups.index'), {
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to load backups');
                setDriver(String(json?.driver || ''));
                setFiles(Array.isArray(json?.files) ? json.files : []);
            })
            .catch((e) => setError(e?.message || 'Failed to load backups'))
            .finally(() => setBusy(false));
    };

    useEffect(() => {
        listBackups();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const generate = () => {
        setExportOpen(true);
        setExportState('running');
        setExportFile('');
        setBusy(true);
        setError('');
        fetch(route('admin.database-backups.generate'), {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                Accept: 'application/json',
            },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Generate failed');
                setExportState('done');
                setExportFile(String(json?.file || ''));
                listBackups();
            })
            .catch((e) => {
                setExportState('idle');
                setError(e?.message || 'Generate failed');
            })
            .finally(() => setBusy(false));
    };

    const destroy = (name) => {
        setDeleteConfirm({ open: true, name });
    };

    const doDelete = (name) => {
        setBusy(true);
        setError('');
        fetch(route('admin.database-backups.destroy', { file: name }), {
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
                if (!r.ok) throw new Error(json?.message || 'Delete failed');
                listBackups();
            })
            .catch((e) => setError(e?.message || 'Delete failed'))
            .finally(() => setBusy(false));
    };

    const restore = () => {
        if (!restoreFile) {
            setError('Please choose a .sql backup file');
            return;
        }
        setConfirmOpen(true);
    };

    const doRestore = () => {
        if (!restoreFile) return;
        setBusy(true);
        setError('');
        const fd = new FormData();
        fd.append('backup', restoreFile);

        fetch(route('admin.database-backups.restore'), {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                Accept: 'application/json',
            },
            body: fd,
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Restore failed');
                setRestoreFile(null);
                listBackups();
            })
            .catch((e) => setError(e?.message || 'Restore failed'))
            .finally(() => setBusy(false));
    };

    const pickRestoreFile = (file) => {
        if (!file) return;
        setError('');
        setRestoreFile(file);
        setTab('restore');
    };

    const fmtBytes = (b) => {
        const n = Number(b || 0);
        if (!n) return '0 B';
        const units = ['B', 'KB', 'MB', 'GB'];
        let v = n;
        let i = 0;
        while (v >= 1024 && i < units.length - 1) {
            v /= 1024;
            i++;
        }
        return `${v.toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
    };

    const ConfirmModal = () => {
        if (!confirmOpen) return null;
        return (
            <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmOpen(false)} />
                <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
                    <div className="text-[12px] font-semibold text-slate-900">Restore Database</div>
                    <div className="mt-2 text-[12px] text-slate-600">
                        This will overwrite current database data. Make sure you have a recent backup.
                    </div>
                    <div className="mt-5 flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setConfirmOpen(false)}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setConfirmOpen(false);
                                doRestore();
                            }}
                            className="rounded-xl bg-red-600 px-4 py-2 text-[12px] font-semibold text-white hover:bg-red-500"
                        >
                            Confirm Restore
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const rows = useMemo(() => files, [files]);

    return (
        <SettingsSectionShell title="" description="">
            <div className="-m-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 bg-white">
                    <div className="flex flex-wrap items-center justify-between gap-3 px-6">
                        <div className="my-3 inline-flex items-center gap-2 text-[12px] font-semibold text-slate-900">
                            <CircleStackIcon className="h-5 w-5" />
                            Database Backup
                        </div>
                        <div className="my-3 text-[12px] text-slate-500">
                            {busy ? 'Working…' : driver ? `Driver: ${driver}` : ''}
                        </div>
                    </div>

                    <div className="flex items-center gap-1 px-2">
                        <button type="button" onClick={() => setTab('backup')} className={tabClass(tab === 'backup')}>
                            Backup
                        </button>
                        <button type="button" onClick={() => setTab('restore')} className={tabClass(tab === 'restore')}>
                            Restore
                        </button>
                    </div>
                </div>

                {error ? <div className="border-b border-slate-200 bg-red-50 px-6 py-3 text-[12px] text-red-700">{error}</div> : null}

                <div className="p-6">
                    {tab === 'backup' ? (
                        <div>
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <button
                                    type="button"
                                    onClick={generate}
                                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-[12px] font-semibold text-white hover:bg-slate-800"
                                >
                                    <ArrowPathIcon className="h-4 w-4" />
                                    Export Database
                                </button>

                                <button
                                    type="button"
                                    onClick={listBackups}
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    <ArrowPathIcon className={`h-4 w-4 ${busy ? 'animate-spin' : ''}`} />
                                    Refresh
                                </button>
                            </div>

                            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
                                <table className="w-full table-auto">
                                    <thead className="bg-slate-50">
                                        <tr className="text-left text-[12px] font-semibold text-slate-700">
                                            <th className="px-4 py-3">File</th>
                                            <th className="px-4 py-3">Size</th>
                                            <th className="px-4 py-3">Modified</th>
                                            <th className="px-4 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {rows.length ? (
                                            rows.map((f) => (
                                                <tr key={f.name} className="text-[12px] text-slate-700">
                                                    <td className="px-4 py-3">
                                                        <div className="font-mono text-[11px] font-semibold text-slate-900 break-all">{f.name}</div>
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-500">{fmtBytes(f.size)}</td>
                                                    <td className="px-4 py-3 text-slate-500">{f.modified_at}</td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <a
                                                                href={route('admin.database-backups.download', { file: f.name })}
                                                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                                                            >
                                                                <ArrowDownTrayIcon className="h-4 w-4" />
                                                                Download
                                                            </a>
                                                            <button
                                                                type="button"
                                                                onClick={() => destroy(f.name)}
                                                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-red-700 hover:bg-red-50"
                                                            >
                                                                <TrashIcon className="h-4 w-4" />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="px-4 py-6 text-[12px] text-slate-500">
                                                    No backups yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-4 text-[12px] text-slate-500">
                                Backups are stored in <span className="font-semibold text-slate-700">storage/app/private/db_backups</span>.
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-[12px] text-slate-600">
                                Upload a <span className="font-semibold text-slate-900">{restoreExt}</span> backup file to restore. This will overwrite current data.
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Backup file (.sql)</div>
                                <div
                                    className="mt-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6"
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        pickRestoreFile(e.dataTransfer?.files?.[0] || null);
                                    }}
                                >
                                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                                        <CloudArrowUpIcon className="h-6 w-6 text-slate-500" />
                                        <div className="text-[12px] font-semibold text-slate-900">Drag & drop file here</div>
                                        <div className="text-[12px] text-slate-600">or choose a file</div>
                                        <input
                                            type="file"
                                            accept={restoreExt}
                                            onChange={(e) => pickRestoreFile(e.target.files?.[0] || null)}
                                            className="text-[12px]"
                                        />
                                    </div>
                                </div>

                                {restoreFile ? (
                                    <div className="mt-3 text-[12px] text-slate-600">
                                        Selected: <span className="font-semibold text-slate-900">{restoreFile.name}</span>
                                    </div>
                                ) : null}

                                <div className="mt-4 flex items-center justify-end">
                                    <button
                                        type="button"
                                        onClick={restore}
                                        disabled={!restoreFile}
                                        className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-[12px] font-semibold text-white hover:bg-red-500 disabled:opacity-50"
                                    >
                                        <CloudArrowUpIcon className="h-4 w-4" />
                                        Import Data
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <ConfirmModal />
                    <DeleteConfirmModal />
                    <ExportModal />
                </div>
            </div>
        </SettingsSectionShell>
    );
}
