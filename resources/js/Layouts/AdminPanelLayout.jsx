import DashboardLayout from '@/Layouts/DashboardLayout';
import { Link } from '@inertiajs/react';

export default function AdminPanelLayout({
    title,
    active,
    items,
    children,
}) {
    return (
        <DashboardLayout title={title}>
            <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
                <aside className="rounded-2xl border border-slate-200 bg-white">
                    <div className="border-b border-slate-200 p-4">
                        <div className="text-xs font-semibold text-slate-900">
                            {title}
                        </div>
                        <div className="mt-2">
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.3-4.3m1.8-4.7a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    placeholder="Search"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 pl-9 text-[12px] text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                />
                            </div>
                        </div>
                    </div>

                    <nav className="p-2">
                        {items.map((item) => {
                            const isActive = active === item.key;
                            return (
                                <Link
                                    key={item.key}
                                    href={item.href}
                                    className={
                                        'flex items-center justify-between rounded-xl px-3 py-2 text-[12px] font-semibold transition ' +
                                        (isActive
                                            ? 'bg-slate-100 text-slate-900'
                                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900')
                                    }
                                >
                                    <span>{item.label}</span>
                                    {isActive && (
                                        <span className="h-6 w-1 rounded-full bg-slate-900" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                <section className="rounded-2xl border border-slate-200 bg-white">
                    {children}
                </section>
            </div>
        </DashboardLayout>
    );
}
