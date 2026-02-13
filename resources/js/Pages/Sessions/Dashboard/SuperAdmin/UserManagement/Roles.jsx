import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

export default function Roles() {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);

    const [newRole, setNewRole] = useState('');
    const [manageRoleId, setManageRoleId] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState(() => new Set());

    const inputClass =
        'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] text-slate-900 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20';

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
                if (!r.ok) throw new Error(json?.message || 'Failed to load roles');
                const rs = Array.isArray(json?.roles) ? json.roles : [];
                const ps = Array.isArray(json?.permissions) ? json.permissions : [];
                setRoles(rs);
                setPermissions(ps);

                if (!manageRoleId && rs[0]?.id) {
                    setManageRoleId(String(rs[0].id));
                }
            })
            .catch((e) => setError(e?.message || 'Failed to load roles'))
            .finally(() => setBusy(false));
    };

    useEffect(() => {
        refresh();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const manageRole = useMemo(() => roles.find((r) => String(r.id) === String(manageRoleId)) || null, [roles, manageRoleId]);

    useEffect(() => {
        const defaults = new Set(Array.isArray(manageRole?.permission_names) ? manageRole.permission_names : []);
        setSelectedPermissions(defaults);
    }, [manageRoleId, manageRole]);

    const createRole = () => {
        const name = newRole.trim();
        if (!name) return;

        setBusy(true);
        setError('');

        fetch(route('admin.role-permission.roles.store'), {
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
                if (!r.ok) throw new Error(json?.message || json?.errors?.name?.[0] || 'Create role failed');
                setNewRole('');
                refresh();
            })
            .catch((e) => setError(e?.message || 'Create role failed'))
            .finally(() => setBusy(false));
    };

    const savePermissions = () => {
        if (!manageRoleId) return;
        setBusy(true);
        setError('');

        fetch(route('admin.role-permission.roles.permissions.sync', { role: manageRoleId }), {
            method: 'PUT',
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ permissions: Array.from(selectedPermissions) }),
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Save failed');
                refresh();
            })
            .catch((e) => setError(e?.message || 'Save failed'))
            .finally(() => setBusy(false));
    };

    return (
        <DashboardLayout title="User Management" breadcrumbs={['Admin', 'User Management', 'Roles']}>
            <Head title="Roles" />

            <div className="rounded-2xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-6 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <div className="text-sm font-semibold text-slate-900">Roles</div>
                            <div className="mt-1 text-[12px] text-slate-500">Create roles and assign permissions.</div>
                        </div>
                        <div className="text-[12px] text-slate-500">{busy ? 'Working…' : ''}</div>
                    </div>
                </div>

                <div className="p-6">
                    {error ? (
                        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">{error}</div>
                    ) : null}

                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-1">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                <div className="text-sm font-semibold text-slate-900">Add Role</div>
                                <div className="mt-4">
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Role name</div>
                                    <div className="mt-2">
                                        <input value={newRole} onChange={(e) => setNewRole(e.target.value)} className={inputClass} placeholder="e.g. Manager" />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={createRole}
                                    disabled={busy}
                                    className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-[12px] font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                                >
                                    Add
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={refresh}
                                className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Refresh
                            </button>
                        </div>

                        <div className="lg:col-span-2">
                            <div className="rounded-2xl border border-slate-200 bg-white">
                                <div className="border-b border-slate-200 px-5 py-4">
                                    <div className="text-sm font-semibold text-slate-900">Manage Role</div>
                                    <div className="mt-1 text-[12px] text-slate-500">Select role and update permissions.</div>
                                </div>

                                <div className="p-5">
                                    <div className="grid gap-4 md:grid-cols-3">
                                        <div className="md:col-span-1">
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Role</div>
                                            <div className="mt-2">
                                                <select value={manageRoleId} onChange={(e) => setManageRoleId(e.target.value)} className={inputClass}>
                                                    {roles.map((r) => (
                                                        <option key={r.id} value={String(r.id)}>
                                                            {r.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Permissions</div>
                                            <div className="mt-2 grid gap-2 md:grid-cols-2">
                                                {permissions.map((p) => {
                                                    const name = String(p.name);
                                                    const checked = selectedPermissions.has(name);
                                                    return (
                                                        <label key={p.id} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
                                                            <input
                                                                type="checkbox"
                                                                className="mt-1 h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                                                checked={checked}
                                                                onChange={() => {
                                                                    const next = new Set(selectedPermissions);
                                                                    if (next.has(name)) next.delete(name);
                                                                    else next.add(name);
                                                                    setSelectedPermissions(next);
                                                                }}
                                                            />
                                                            <div className="font-mono text-[12px] font-semibold text-slate-900">{name}</div>
                                                        </label>
                                                    );
                                                })}
                                            </div>

                                            <div className="mt-4 flex items-center justify-end">
                                                <button
                                                    type="button"
                                                    onClick={savePermissions}
                                                    disabled={busy || !manageRoleId}
                                                    className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-[12px] font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
                                                >
                                                    Save Permissions
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 text-[12px] text-slate-500">
                                Tip: to delete roles/permissions, use the existing settings page or we can add delete actions here next.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
