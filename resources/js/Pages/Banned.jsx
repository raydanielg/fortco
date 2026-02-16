import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link } from '@inertiajs/react';

export default function Banned() {
    return (
        <GuestLayout
            subtitle="SECURITY"
            title="Account restricted"
            description="Your account has been temporarily restricted. If you believe this is a mistake, contact support and we will help you as soon as possible."
            footer={
                <div className="text-xs text-slate-500">
                    You can still open Helpdesk to send a message.
                </div>
            }
        >
            <Head title="Banned" />

            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
                <div className="font-bold">Banned Notice</div>
                <div className="mt-1 text-amber-800">
                    Access to the system is blocked for this account. Please contact support for assistance.
                </div>
            </div>

            <div className="mt-6 grid gap-3">
                <Link
                    href={route('helpdesk.chat')}
                    className="flex w-full items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-slate-800"
                >
                    Contact Me
                </Link>

                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="w-full rounded-xl border border-slate-200 bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-slate-700 transition hover:bg-slate-50"
                >
                    Log Out
                </Link>
            </div>
        </GuestLayout>
    );
}
