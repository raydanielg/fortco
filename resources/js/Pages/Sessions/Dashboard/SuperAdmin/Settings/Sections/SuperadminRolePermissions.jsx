import SettingsSectionShell from './SettingsSectionShell';
import { router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function SuperadminRolePermissions() {
    const page = usePage();
    const rolePermissionSettings = page.props.rolePermissionSettings || {};
    const roles = Array.isArray(rolePermissionSettings.roles) ? rolePermissionSettings.roles : [];
    const permissions = Array.isArray(rolePermissionSettings.permissions) ? rolePermissionSettings.permissions : [];

    const [active, setActive] = useState('roles');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const [newRoleName, setNewRoleName] = useState('');
    const [newPermissionName, setNewPermissionName] = useState('');

    const [editingRoleId, setEditingRoleId] = useState(null);
    const [editingRoleName, setEditingRoleName] = useState('');

    const [manageRoleId, setManageRoleId] = useState(roles?.[0]?.id || null);
    const manageRole = useMemo(() => roles.find((r) => r.id === manageRoleId) || null, [roles, manageRoleId]);

    const [selectedPermissionNames, setSelectedPermissionNames] = useState(() => new Set());

    const inputClass =
        'w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20';

    const tabClass = (isActive) =>
        'inline-flex items-center border-b-2 px-4 py-3 text-[12px] font-semibold transition ' +
        (isActive ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-900');

    const refreshSettings = () => {
        router.get(route('admin.settings', { tab: 'superadmin_role_permissions' }), {}, { preserveScroll: true });
    };

    const setJsonError = (e) => {
        const msg =
            e?.errors?.name?.[0] ||
            e?.message ||
            'Request failed.';
        setError(String(msg));
    };

    const createRole = () => {
        setError('');
        const name = newRoleName.trim();
        if (!name) return;
        setBusy(true);
        router.post(
            route('admin.role-permission.roles.store'),
            { name },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setNewRoleName('');
                    refreshSettings();
                },
                onError: setJsonError,
                onFinish: () => setBusy(false),
            },
        );
    };

    const startEditRole = (r) => {
        setEditingRoleId(r.id);
        setEditingRoleName(r.name);
        setError('');
    };

    const saveEditRole = () => {
        setError('');
        const name = editingRoleName.trim();
        if (!editingRoleId || !name) return;
        setBusy(true);
        router.put(
            route('admin.role-permission.roles.update', editingRoleId),
            { name },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setEditingRoleId(null);
                    setEditingRoleName('');
                    refreshSettings();
                },
                onError: setJsonError,
                onFinish: () => setBusy(false),
            },
        );
    };

    const deleteRole = (roleId) => {
        setError('');
        if (!window.confirm('Delete this role?')) return;
        setBusy(true);
        router.delete(route('admin.role-permission.roles.destroy', roleId), {
            preserveScroll: true,
            onSuccess: () => {
                if (manageRoleId === roleId) {
                    setManageRoleId(null);
                }
                refreshSettings();
            },
            onError: setJsonError,
            onFinish: () => setBusy(false),
        });
    };

    const createPermission = () => {
        setError('');
        const name = newPermissionName.trim();
        if (!name) return;
        setBusy(true);
        router.post(
            route('admin.role-permission.permissions.store'),
            { name },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setNewPermissionName('');
                    refreshSettings();
                },
                onError: setJsonError,
                onFinish: () => setBusy(false),
            },
        );
    };

    const deletePermission = (permissionId) => {
        setError('');
        if (!window.confirm('Delete this permission?')) return;
        setBusy(true);
        router.delete(route('admin.role-permission.permissions.destroy', permissionId), {
            preserveScroll: true,
            onSuccess: () => refreshSettings(),
            onError: setJsonError,
            onFinish: () => setBusy(false),
        });
    };

    const syncPermissions = () => {
        setError('');
        if (!manageRoleId) return;
        setBusy(true);
        router.put(
            route('admin.role-permission.roles.permissions.sync', manageRoleId),
            { permissions: Array.from(selectedPermissionNames) },
            {
                preserveScroll: true,
                onSuccess: () => refreshSettings(),
                onError: setJsonError,
                onFinish: () => setBusy(false),
            },
        );
    };

    const openManageRole = (roleId) => {
        setManageRoleId(roleId);
        setError('');
        const r = roles.find((x) => x.id === roleId);
        const defaults = new Set(Array.isArray(r?.permission_names) ? r.permission_names : []);
        setSelectedPermissionNames(defaults);
    };

    const PermissionCheckbox = ({ name }) => {
        const checked = selectedPermissionNames.has(name);

        return (
            <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
                <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    checked={checked}
                    onChange={() => {
                        const next = new Set(selectedPermissionNames);
                        if (next.has(name)) next.delete(name);
                        else next.add(name);
                        setSelectedPermissionNames(next);
                    }}
                />
                <div>
                    <div className="text-[12px] font-semibold text-slate-900">{name}</div>
                </div>
            </label>
        );
    };

    return (
        <SettingsSectionShell
            title=""
            description=""
        >
            <div className="-m-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 bg-white">
                    <div className="flex flex-wrap items-center justify-between gap-3 px-6">
                        <div className="flex items-center">
                            <button type="button" onClick={() => setActive('roles')} className={tabClass(active === 'roles')}>
                                Roles
                            </button>
                            <button
                                type="button"
                                onClick={() => setActive('permissions')}
                                className={tabClass(active === 'permissions')}
                            >
                                Permissions
                            </button>
                            <button type="button" onClick={() => setActive('manage')} className={tabClass(active === 'manage')}>
                                Manage
                            </button>
                        </div>

                        <div className="my-3 text-[12px] text-slate-500">
                            {busy ? 'Working…' : ''}
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {error ? (
                        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">
                            {error}
                        </div>
                    ) : null}

                    {active === 'roles' ? (
                        <div className="grid gap-6 lg:grid-cols-3">
                            <div className="lg:col-span-1">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                    <div className="text-sm font-semibold text-slate-900">Add Role</div>

                                    <div className="mt-4">
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Role name</div>
                                        <div className="mt-2">
                                            <input
                                                value={newRoleName}
                                                onChange={(e) => setNewRoleName(e.target.value)}
                                                className={inputClass}
                                                placeholder="e.g. Manager"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={createRole}
                                        disabled={busy}
                                        className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-red-600 px-5 py-2.5 text-[12px] font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>

                            <div className="lg:col-span-2">
                                <div className="rounded-2xl border border-slate-200 bg-white">
                                    <div className="border-b border-slate-200 px-5 py-4">
                                        <div className="text-sm font-semibold text-slate-900">Roles</div>
                                        <div className="mt-1 text-[12px] text-slate-500">Create, update, and delete roles.</div>
                                    </div>

                                    <div className="divide-y divide-slate-200">
                                        {roles.length ? (
                                            roles.map((r) => (
                                                <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                                                    <div>
                                                        <div className="text-[13px] font-semibold text-slate-900">{r.name}</div>
                                                        <div className="mt-1 text-[12px] text-slate-500">
                                                            {(Array.isArray(r.permission_names) ? r.permission_names.length : 0) + ' permissions'}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setActive('manage');
                                                                openManageRole(r.id);
                                                            }}
                                                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                                                        >
                                                            Manage
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => startEditRole(r)}
                                                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteRole(r.id)}
                                                            className="rounded-xl border border-red-200 bg-white px-4 py-2 text-[12px] font-semibold text-red-700 hover:bg-red-50"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-5 py-6 text-[12px] text-slate-500">No roles found.</div>
                                        )}
                                    </div>
                                </div>

                                {editingRoleId ? (
                                    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                        <div className="text-sm font-semibold text-slate-900">Edit Role</div>
                                        <div className="mt-4 grid gap-4 md:grid-cols-3">
                                            <div className="md:col-span-2">
                                                <input
                                                    value={editingRoleName}
                                                    onChange={(e) => setEditingRoleName(e.target.value)}
                                                    className={inputClass}
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={saveEditRole}
                                                    disabled={busy}
                                                    className="inline-flex flex-1 items-center justify-center rounded-xl bg-red-600 px-5 py-2.5 text-[12px] font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingRoleId(null);
                                                        setEditingRoleName('');
                                                    }}
                                                    className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-[12px] font-bold text-slate-700 hover:bg-slate-50"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    ) : active === 'permissions' ? (
                        <div className="grid gap-6 lg:grid-cols-3">
                            <div className="lg:col-span-1">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                    <div className="text-sm font-semibold text-slate-900">Add Permission</div>

                                    <div className="mt-4">
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Permission name</div>
                                        <div className="mt-2">
                                            <input
                                                value={newPermissionName}
                                                onChange={(e) => setNewPermissionName(e.target.value)}
                                                className={inputClass}
                                                placeholder="e.g. view_users"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={createPermission}
                                        disabled={busy}
                                        className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-red-600 px-5 py-2.5 text-[12px] font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>

                            <div className="lg:col-span-2">
                                <div className="rounded-2xl border border-slate-200 bg-white">
                                    <div className="border-b border-slate-200 px-5 py-4">
                                        <div className="text-sm font-semibold text-slate-900">Permissions</div>
                                        <div className="mt-1 text-[12px] text-slate-500">Create and delete permissions.</div>
                                    </div>

                                    <div className="divide-y divide-slate-200">
                                        {permissions.length ? (
                                            permissions.map((p) => (
                                                <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                                                    <div className="font-mono text-[12px] font-semibold text-slate-900">{p.name}</div>
                                                    <button
                                                        type="button"
                                                        onClick={() => deletePermission(p.id)}
                                                        className="rounded-xl border border-red-200 bg-white px-4 py-2 text-[12px] font-semibold text-red-700 hover:bg-red-50"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-5 py-6 text-[12px] text-slate-500">No permissions found.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-6 lg:grid-cols-3">
                            <div className="lg:col-span-1">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                    <div className="text-sm font-semibold text-slate-900">Select Role</div>
                                    <div className="mt-4">
                                        <select
                                            value={manageRoleId || ''}
                                            onChange={(e) => openManageRole(Number(e.target.value))}
                                            className={inputClass}
                                        >
                                            <option value="" disabled>
                                                Choose role
                                            </option>
                                            {roles.map((r) => (
                                                <option key={r.id} value={r.id}>
                                                    {r.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={syncPermissions}
                                        disabled={busy || !manageRoleId}
                                        className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-red-600 px-5 py-2.5 text-[12px] font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                                    >
                                        Save
                                    </button>

                                    <div className="mt-4 text-[12px] text-slate-500">
                                        Role permissions will be updated based on your selection.
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-2">
                                <div className="rounded-2xl border border-slate-200 bg-white">
                                    <div className="border-b border-slate-200 px-5 py-4">
                                        <div className="text-sm font-semibold text-slate-900">Manage Permissions</div>
                                        <div className="mt-1 text-[12px] text-slate-500">
                                            {manageRole ? (
                                                <>
                                                    Editing role: <span className="font-semibold text-slate-900">{manageRole.name}</span>
                                                </>
                                            ) : (
                                                'Select a role to manage.'
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        {manageRoleId ? (
                                            <div className="grid gap-3 md:grid-cols-2">
                                                {permissions.map((p) => (
                                                    <PermissionCheckbox key={p.id} name={p.name} />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-[12px] text-slate-500">Choose a role to see permissions.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </SettingsSectionShell>
    );
}
