import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head } from '@inertiajs/react';

export default function Index({ auth }) {
    return (
        <DashboardLayout
            title="Super Admin Dashboard"
            breadcrumbs={['Home', 'Super Admin Dashboard']}
        >
            <Head title="Super Admin Dashboard" />

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">
                    <div className="text-sm text-slate-600">Welcome back</div>
                    <div className="mt-1 text-lg font-semibold text-slate-900">
                        {auth.user.name}
                    </div>

                    <div className="mt-4 text-sm text-slate-700">
                        You are logged in as Super Admin.
                    </div>
                </div>

                <a
                    href={route('admin.settings')}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow"
                >
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Admin
                    </div>
                    <div className="mt-2 text-sm font-semibold text-slate-900">
                        Settings
                    </div>
                    <div className="mt-1 text-[12px] text-slate-600">
                        App configuration, security, backups and more.
                    </div>
                </a>

                <a
                    href={route('admin.front-settings')}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow"
                >
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Admin
                    </div>
                    <div className="mt-2 text-sm font-semibold text-slate-900">
                        Front Settings
                    </div>
                    <div className="mt-1 text-[12px] text-slate-600">
                        Header/footer, theme, SEO and social links.
                    </div>
                </a>

                <a
                    href={route('admin.faq')}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow"
                >
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Admin
                    </div>
                    <div className="mt-2 text-sm font-semibold text-slate-900">
                        Admin FAQ
                    </div>
                    <div className="mt-1 text-[12px] text-slate-600">
                        Manuals, tutorials, and support resources.
                    </div>
                </a>
            </div>
        </DashboardLayout>
    );
}
