import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function AdminProfileIndex({ user, roles = [], permissions = [] }) {
    const page = usePage();
    const avatarUrl = page.props?.auth?.avatar_url || '';

    const avatarForm = useForm({
        avatar: null,
    });

    const submitAvatar = (e) => {
        e.preventDefault();
        avatarForm.post(route('admin.settings.profile.avatar'), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <DashboardLayout title="Profile" breadcrumbs={['Admin', 'Profile']}>
            <Head title="Admin Profile" />

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-1">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 px-5 py-4">
                            <div className="text-[13px] font-bold text-slate-900">Profile Picture</div>
                            <div className="mt-1 text-[12px] text-slate-500">Upload a square image for best results</div>
                        </div>

                        <div className="p-5">
                            <div className="flex items-center justify-center">
                                <div className="h-28 w-28 overflow-hidden rounded-full border border-slate-200 bg-slate-50">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-[32px] text-slate-400">
                                            {(user?.name || 'U').trim().slice(0, 1).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <form onSubmit={submitAvatar} className="mt-5 grid gap-3">
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                    onChange={(e) => avatarForm.setData('avatar', e.target.files?.[0] || null)}
                                    className="block w-full text-[12px] text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2 file:text-[12px] file:font-semibold file:text-slate-700 hover:file:bg-slate-100"
                                />
                                {avatarForm.errors.avatar && (
                                    <div className="text-[12px] text-red-600">{avatarForm.errors.avatar}</div>
                                )}

                                <button
                                    type="submit"
                                    disabled={avatarForm.processing}
                                    className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-[12px] font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
                                >
                                    {avatarForm.processing ? 'Uploading…' : 'Upload Avatar'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 grid gap-6">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 px-5 py-4">
                            <div className="text-[13px] font-bold text-slate-900">Account</div>
                            <div className="mt-1 text-[12px] text-slate-500">Your login details and role access</div>
                        </div>

                        <div className="p-5">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Full Name</div>
                                    <div className="mt-1 truncate text-[13px] font-semibold text-slate-900">{user?.name}</div>
                                </div>
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Email</div>
                                    <div className="mt-1 truncate text-[13px] font-semibold text-slate-900">{user?.email}</div>
                                </div>
                            </div>

                            <div className="mt-5 grid gap-4 lg:grid-cols-2">
                                <div className="rounded-xl border border-slate-200 p-4">
                                    <div className="text-[12px] font-bold text-slate-900">Roles</div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {(roles || []).length ? (
                                            roles.map((r) => (
                                                <span
                                                    key={r}
                                                    className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700"
                                                >
                                                    {r}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-[12px] text-slate-500">No roles</span>
                                        )}
                                    </div>
                                </div>

                                <div className="rounded-xl border border-slate-200 p-4">
                                    <div className="text-[12px] font-bold text-slate-900">Permissions</div>
                                    <div className="mt-2 max-h-28 overflow-auto pr-1">
                                        {(permissions || []).length ? (
                                            <div className="flex flex-wrap gap-2">
                                                {permissions.map((p) => (
                                                    <span
                                                        key={p}
                                                        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700"
                                                    >
                                                        {p}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-[12px] text-slate-500">No permissions</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-200 px-5 py-4">
                            <div className="text-[13px] font-bold text-slate-900">Quick Actions</div>
                            <div className="mt-1 text-[12px] text-slate-500">Manage your account faster</div>
                        </div>

                        <div className="p-5 grid gap-3 sm:grid-cols-2">
                            <a
                                href={route('admin.settings')}
                                className="rounded-xl border border-slate-200 bg-slate-50 p-4 hover:bg-slate-100"
                            >
                                <div className="text-[12px] font-bold text-slate-900">Go to Settings</div>
                                <div className="mt-1 text-[12px] text-slate-500">Update system and profile settings</div>
                            </a>

                            <a
                                href={route('dashboard')}
                                className="rounded-xl border border-slate-200 bg-slate-50 p-4 hover:bg-slate-100"
                            >
                                <div className="text-[12px] font-bold text-slate-900">Back to Dashboard</div>
                                <div className="mt-1 text-[12px] text-slate-500">View your overview and modules</div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
