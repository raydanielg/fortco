import AdminPanelLayout from '@/Layouts/AdminPanelLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

export default function Permissions() {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const [permissions, setPermissions] = useState([]);
    const [q, setQ] = useState('');
    const [newPerm, setNewPerm] = useState('');

    const readJson = async (r) => {
        const text = await r.text();
        try {
            return text ? JSON.parse(text) : {};
        } catch (e) {
            return {};
        }
    };

    const refresh = () => {
        setBusy(true);
        setError('');
        fetch(route('admin.role-permission.data'), {
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to load permissions');
                setPermissions(Array.isArray(json?.permissions) ? json.permissions : []);
            })
            .catch((e) => setError(e?.message || 'Failed to load permissions'))
            .finally(() => setBusy(false));
    };

    useEffect(() => {
        refresh();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();
        if (!query) return permissions;
        return permissions.filter((p) => String(p?.name || '').toLowerCase().includes(query));
    }, [permissions, q]);

    const createPermission = () => {
        const name = newPerm.trim();
        if (!name) return;

        setBusy(true);
        setError('');

        fetch(route('admin.role-permission.permissions.store'), {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || json?.errors?.name?.[0] || 'Create permission failed');
                setNewPerm('');
                refresh();
            })
            .catch((e) => setError(e?.message || 'Create permission failed'))
            .finally(() => setBusy(false));
    };

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
            <Head title="Permissions" />

            <AdminPanelLayout title="User Management" active="permissions" items={items}>

            <div className="rounded-2xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-6 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <div className="text-sm font-semibold text-slate-900">Permissions</div>
                            <div className="mt-1 text-[12px] text-slate-500">Create and view permissions (Spatie).</div>
                        </div>
                        <div className="text-[12px] text-slate-500">{busy ? 'Working…' : ''}</div>
                    </div>

                    <div className="mt-4 grid gap-2 md:grid-cols-3">
                        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search permissions" className="md:col-span-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                        <div className="md:col-span-2 flex flex-wrap items-center gap-2">
                            <input value={newPerm} onChange={(e) => setNewPerm(e.target.value)} placeholder="e.g. view_users" className="flex-1 min-w-[220px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                            <button type="button" onClick={createPermission} disabled={busy} className="rounded-xl bg-slate-900 px-4 py-2 text-[12px] font-semibold text-white hover:bg-slate-800 disabled:opacity-50">
                                Add
                            </button>
                            <button type="button" onClick={refresh} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50">
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {error ? (
                        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">{error}</div>
                    ) : null}

                    <div className="grid gap-2 md:grid-cols-2">
                        {filtered.length ? (
                            filtered.map((p) => (
                                <div key={p.id} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                                    <div className="font-mono text-[12px] font-semibold text-slate-900">{p.name}</div>
                                </div>
                            ))
                        ) : (
                            <div className="text-[12px] text-slate-500">No permissions found.</div>
                        )}
                    </div>

                    <div className="mt-4 text-[12px] text-slate-500">
                        Delete actions can be added here next (we already have delete endpoint in backend).
                    </div>
                </div>
            </div>
            </AdminPanelLayout>
        </>
    );
}
