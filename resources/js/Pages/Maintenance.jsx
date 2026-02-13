import { Head, Link } from '@inertiajs/react';

export default function Maintenance({ message }) {
    const text = message && String(message).trim() !== '' ? message : 'We are performing scheduled maintenance. Please check back soon.';

    return (
        <>
            <Head title="Maintenance" />
            <div className="min-h-screen bg-slate-50 text-slate-900">
                <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-16">
                    <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                        <div className="text-[12px] font-semibold text-slate-600">FORTCO</div>
                        <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Maintenance Mode</div>
                        <div className="mt-3 text-[13px] leading-relaxed text-slate-600">{text}</div>

                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <Link
                                href={route('login')}
                                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-[12px] font-semibold text-white hover:bg-slate-800"
                            >
                                Admin Login
                            </Link>
                            <a
                                href="/"
                                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Refresh
                            </a>
                        </div>

                        <div className="mt-6 text-[12px] text-slate-500">
                            If you are an administrator, you can still access the dashboard and disable maintenance.
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
