<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionController extends Controller
{
    public function data(Request $request)
    {
        $guard = 'web';

        $roles = Role::query()
            ->where('guard_name', $guard)
            ->orderBy('name')
            ->get()
            ->map(fn (Role $r) => [
                'id' => $r->id,
                'name' => $r->name,
                'permission_names' => $r->permissions->pluck('name')->values(),
            ])
            ->values();

        $permissions = Permission::query()
            ->where('guard_name', $guard)
            ->orderBy('name')
            ->get()
            ->map(fn (Permission $p) => [
                'id' => $p->id,
                'name' => $p->name,
            ])
            ->values();

        return response()->json([
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }

    public function index(Request $request): Response
    {
        $guard = 'web';

        $roles = Role::query()
            ->where('guard_name', $guard)
            ->orderBy('name')
            ->get()
            ->map(fn (Role $r) => [
                'id' => $r->id,
                'name' => $r->name,
                'permissions_count' => $r->permissions()->count(),
            ])
            ->values();

        $permissions = Permission::query()
            ->where('guard_name', $guard)
            ->orderBy('name')
            ->get()
            ->map(fn (Permission $p) => [
                'id' => $p->id,
                'name' => $p->name,
            ])
            ->values();

        return Inertia::render('Sessions/Dashboard/SuperAdmin/Settings/RolePermission', [
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }

    public function storeRole(Request $request)
    {
        $guard = 'web';

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120', Rule::unique('roles', 'name')->where('guard_name', $guard)],
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'guard_name' => $guard,
        ]);

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        return back()->with('status', 'Role created');
    }

    public function updateRole(Request $request, Role $role)
    {
        $guard = 'web';

        if ($role->guard_name !== $guard) {
            abort(404);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120', Rule::unique('roles', 'name')->where('guard_name', $guard)->ignore($role->id)],
        ]);

        $role->name = $validated['name'];
        $role->save();

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        return back()->with('status', 'Role updated');
    }

    public function destroyRole(Request $request, Role $role)
    {
        $guard = 'web';

        if ($role->guard_name !== $guard) {
            abort(404);
        }

        if ($role->name === 'Super Admin') {
            return back()->withErrors(['message' => 'Super Admin role cannot be deleted']);
        }

        $role->delete();

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        return back()->with('status', 'Role deleted');
    }

    public function storePermission(Request $request)
    {
        $guard = 'web';

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120', Rule::unique('permissions', 'name')->where('guard_name', $guard)],
        ]);

        $permission = Permission::create([
            'name' => $validated['name'],
            'guard_name' => $guard,
        ]);

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        return back()->with('status', 'Permission created');
    }

    public function destroyPermission(Request $request, Permission $permission)
    {
        $guard = 'web';

        if ($permission->guard_name !== $guard) {
            abort(404);
        }

        $permission->delete();

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        return back()->with('status', 'Permission deleted');
    }

    public function syncRolePermissions(Request $request, Role $role)
    {
        $guard = 'web';

        if ($role->guard_name !== $guard) {
            abort(404);
        }

        $validated = $request->validate([
            'permissions' => ['required', 'array'],
            'permissions.*' => ['string', 'max:120'],
        ]);

        $names = array_values(array_unique($validated['permissions']));
        $permissions = Permission::query()->where('guard_name', $guard)->whereIn('name', $names)->get();

        $role->syncPermissions($permissions);

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        return back()->with('status', 'Role permissions updated');
    }
}
