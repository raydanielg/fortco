import { Link, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import Sidebar from '@/Components/Sidebar';

function IconBell(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0m6 0H9"
            />
        </svg>
    );
}

function IconCog(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35.9-.218 1.397-1.185 1.065-2.573-.94-1.543.826-3.31 2.37-2.37.996.607 2.296.07 2.573-1.065z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
        </svg>
    );
}

function IconLogout(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
            />
        </svg>
    );
}

export default function DashboardLayout({ title, breadcrumbs = [], children }) {
    const page = usePage();
    const user = page.props.auth?.user;

    const roles = page.props.auth?.roles || [];
    const isSuperAdmin = roles.includes('Super Admin');

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const crumbText = useMemo(() => {
        if (!breadcrumbs || breadcrumbs.length === 0) return null;
        return breadcrumbs.join('  •  ');
    }, [breadcrumbs]);

    return (
        <div className="min-h-screen bg-slate-50">
            <button
                data-drawer-target="default-sidebar"
                data-drawer-toggle="default-sidebar"
                aria-controls="default-sidebar"
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="fixed left-3 top-3 z-50 inline-flex items-center rounded-lg bg-white/80 p-2 text-sm text-gray-500 shadow-sm backdrop-blur hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 sm:hidden"
            >
                <span className="sr-only">Open sidebar</span>
                <svg
                    className="h-6 w-6"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                    />
                </svg>
            </button>

            {sidebarOpen && (
                <button
                    type="button"
                    className="fixed inset-0 z-30 bg-black/30 sm:hidden"
                    aria-label="Close sidebar"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <Sidebar
                title={title}
                userName={user?.name || 'Account'}
                isSuperAdmin={isSuperAdmin}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur sm:pl-64">
                <div className="mx-auto grid h-12 max-w-screen-2xl grid-cols-[1fr,auto] items-center px-3 sm:px-4">
                    <div />

                    <div className="flex items-center gap-1.5 justify-self-end">
                        <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            aria-label="Notifications"
                        >
                            <IconBell className="h-4 w-4" />
                        </button>

                        <button
                            type="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            aria-label="Settings"
                        >
                            <IconCog className="h-4 w-4" />
                        </button>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            aria-label="Logout"
                        >
                            <IconLogout className="h-4 w-4" />
                        </Link>

                        <div className="ml-2 hidden min-w-0 items-center gap-2 sm:flex">
                            <div className="text-right">
                                <div className="truncate text-[11px] font-semibold leading-4 text-slate-900">
                                    Workspace
                                </div>
                                <div className="truncate text-[11px] leading-4 text-slate-500">
                                    {user?.name || 'Account'}
                                </div>
                            </div>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-[11px] font-bold text-white">
                                {(user?.name || 'U')
                                    .trim()
                                    .slice(0, 1)
                                    .toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mx-auto block max-w-screen-2xl px-3 pb-2 md:hidden">
                    <div className="truncate text-[11px] font-semibold leading-4 text-slate-900" />
                </div>
            </header>

            <main className="mx-auto max-w-screen-2xl px-4 py-6 sm:ml-64 sm:px-6">
                {children}
            </main>
        </div>
    );
}
