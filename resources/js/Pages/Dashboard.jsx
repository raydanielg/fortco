import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    const user = auth.user;
    const isSuperAdmin = user.roles?.some(r => r.name === 'Super Admin') || user.is_super_admin;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        {isSuperAdmin ? 'Admin Dashboard' : 'User Dashboard'}
                    </h2>
                    {isSuperAdmin && (
                        <Link
                            href="#"
                            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-700 transition"
                        >
                            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Check for Updates
                        </Link>
                    )}
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {isSuperAdmin ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {/* Quick Action Cards for Admin */}
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-xl border border-gray-100 p-6">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900 uppercase tracking-tight">System Settings</div>
                                        <div className="text-xs text-gray-500">Configure core ERP modules</div>
                                    </div>
                                </div>
                                <Link href={route('admin.settings')} className="mt-4 block text-center rounded-lg border border-gray-200 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 uppercase tracking-wider">Configure</Link>
                            </div>

                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-xl border border-gray-100 p-6">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-lg bg-purple-50 p-3 text-purple-600">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900 uppercase tracking-tight">Front Settings</div>
                                        <div className="text-xs text-gray-500">Manage website appearance</div>
                                    </div>
                                </div>
                                <Link href={route('admin.front-settings')} className="mt-4 block text-center rounded-lg border border-gray-200 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 uppercase tracking-wider">Customize</Link>
                            </div>

                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-xl border border-gray-100 p-6">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900 uppercase tracking-tight">Updates</div>
                                        <div className="text-xs text-gray-500">Check for system core updates</div>
                                    </div>
                                </div>
                                <button className="mt-4 w-full block text-center rounded-lg border border-gray-200 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 uppercase tracking-wider">Check Now</button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {/* Simple Cards for Regular User */}
                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-xl border border-gray-100 p-6">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900 uppercase tracking-tight">My Profile</div>
                                        <div className="text-xs text-gray-500">View and edit your personal details</div>
                                    </div>
                                </div>
                                <Link href={route('profile.edit')} className="mt-4 block text-center rounded-lg border border-gray-200 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 uppercase tracking-wider">View Profile</Link>
                            </div>

                            <div className="overflow-hidden bg-white shadow-sm sm:rounded-xl border border-gray-100 p-6">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-lg bg-orange-50 p-3 text-orange-600">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900 uppercase tracking-tight">Support Tickets</div>
                                        <div className="text-xs text-gray-500">Need help? Open a support ticket</div>
                                    </div>
                                </div>
                                <Link href={route('support.tickets')} className="mt-4 block text-center rounded-lg border border-gray-200 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 uppercase tracking-wider">Get Support</Link>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 overflow-hidden bg-white shadow-sm sm:rounded-xl border border-gray-100">
                        <div className="p-6 text-gray-900">
                            <div className="text-lg font-bold">
                                {isSuperAdmin ? 'Welcome back, Super Admin!' : `Welcome back, ${user.name}!`}
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                                {isSuperAdmin 
                                    ? 'Everything is running smoothly. Your ERP system is up to date.' 
                                    : 'Explore your dashboard and manage your account settings.'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
