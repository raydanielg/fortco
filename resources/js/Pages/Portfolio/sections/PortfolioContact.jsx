import { EnvelopeIcon, MapPinIcon, PhoneIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function PortfolioContact() {
    return (
        <section id="portfolio-contact" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Request project information</div>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Talk to our portfolio team</h2>
            <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600">
                For detailed project portfolios, technical specifications, or site visits, contact our project management office.
            </p>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
                <div className="rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-100">
                    <div className="flex items-start gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                            <EnvelopeIcon className="h-6 w-6 text-primary-700" />
                        </span>
                        <div>
                            <div className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">Email</div>
                            <div className="mt-1 text-sm font-black text-slate-900">projects@fortco.co.tz</div>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-100">
                    <div className="flex items-start gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                            <PhoneIcon className="h-6 w-6 text-primary-700" />
                        </span>
                        <div>
                            <div className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">Phone</div>
                            <div className="mt-1 text-sm font-black text-slate-900">+255 746 423 472</div>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-100">
                    <div className="flex items-start gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                            <MapPinIcon className="h-6 w-6 text-primary-700" />
                        </span>
                        <div>
                            <div className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">Office</div>
                            <div className="mt-1 text-sm font-black text-slate-900">Nyerere Road, UBA Building 1st Floor, Mwanza</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 rounded-3xl bg-slate-900 p-6 text-white sm:p-8">
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
                        <div className="flex items-start gap-3">
                            <UserCircleIcon className="mt-0.5 h-6 w-6 text-white/80" />
                            <div>
                                <div className="text-xs font-extrabold uppercase tracking-widest text-white/70">Head of Projects</div>
                                <div className="mt-1 text-sm font-black text-white">Eng. James Mwakyembe</div>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
                        <div className="flex items-start gap-3">
                            <UserCircleIcon className="mt-0.5 h-6 w-6 text-white/80" />
                            <div>
                                <div className="text-xs font-extrabold uppercase tracking-widest text-white/70">Portfolio Manager</div>
                                <div className="mt-1 text-sm font-black text-white">Ms. Grace William</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <a
                        href="mailto:technical@fortco.co.tz"
                        className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-extrabold tracking-wide text-slate-900 shadow-sm transition hover:bg-slate-100"
                    >
                        Technical inquiries → technical@fortco.co.tz
                    </a>
                    <a
                        href="mailto:visits@fortco.co.tz"
                        className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-extrabold tracking-wide text-slate-900 shadow-sm transition hover:bg-slate-100"
                    >
                        Site visits → visits@fortco.co.tz
                    </a>
                </div>

                <p className="mt-6 text-sm font-semibold leading-relaxed text-white/85">
                    Fortco Company Limited does not just build structures. We build legacies, communities, and dreams.
                    Every project in our portfolio represents a promise kept, a vision realized, and a relationship built to last.
                </p>

                <div className="mt-4 text-xs font-extrabold uppercase tracking-widest text-white/60">
                    © 2026 Fortco Company Limited. All Rights Reserved. — Last Updated: February 2026
                </div>
            </div>
        </section>
    );
}
