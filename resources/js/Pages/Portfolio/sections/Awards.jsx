import { TrophyIcon, ShieldCheckIcon, StarIcon } from '@heroicons/react/24/outline';

export default function Awards() {
    const awards = [
        {
            year: '2025',
            award: 'Tanzania Building Awards',
            category: 'Best Luxury Residential',
            icon: TrophyIcon,
            tone: 'from-amber-500 to-orange-500',
        },
        {
            year: '2024',
            award: 'Contractor of the Year',
            category: 'Mwanza Region',
            icon: StarIcon,
            tone: 'from-primary-700 to-primary-500',
        },
        {
            year: '2023',
            award: 'Excellence in Construction',
            category: 'Medium-Sized Contractor',
            icon: TrophyIcon,
            tone: 'from-slate-900 to-slate-700',
        },
        {
            year: '2022',
            award: 'Safety Award',
            category: 'Zero Lost Time Injury',
            icon: ShieldCheckIcon,
            tone: 'from-emerald-600 to-teal-500',
        },
        {
            year: '2021',
            award: 'CSR Award',
            category: 'Community Development',
            icon: StarIcon,
            tone: 'from-rose-600 to-red-500',
        },
    ];

    const featured = awards[0];

    return (
        <section id="awards" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Awards & recognition</div>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Achievement milestones</h2>
            <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600">
                Recognition that reflects our commitment to quality, safety, and responsible delivery.
            </p>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-sm sm:p-8">
                    <div className={`absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br ${featured.tone} opacity-25 blur-2xl`} />
                    <div className={`absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-gradient-to-br ${featured.tone} opacity-25 blur-2xl`} />

                    <div className="relative">
                        <div className="flex items-center justify-between gap-4">
                            <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest">
                                Featured award
                            </div>
                            <div className="text-xs font-extrabold uppercase tracking-widest text-white/70">{featured.year}</div>
                        </div>

                        <div className="mt-4 text-xl font-black leading-snug tracking-tight sm:text-2xl">{featured.award}</div>
                        <div className="mt-2 text-sm font-semibold text-white/80">{featured.category}</div>

                        <div className="mt-6 flex items-center gap-3">
                            <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${featured.tone} shadow-sm`}>
                                <featured.icon className="h-6 w-6 text-white" />
                            </span>
                            <div className="text-sm font-medium leading-relaxed text-white/80">
                                A highlight that showcases our focus on delivery excellence and premium build quality.
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    {awards.slice(1).map((a) => {
                        const Icon = a.icon;
                        return (
                            <div
                                key={a.year + a.award}
                                className="group rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500">{a.year}</div>
                                    <span className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${a.tone} shadow-sm`}>
                                        <Icon className="h-5 w-5 text-white" />
                                    </span>
                                </div>
                                <div className="mt-3 text-sm font-black leading-snug text-slate-900 sm:text-base">{a.award}</div>
                                <div className="mt-2 text-sm font-semibold text-slate-600">{a.category}</div>
                                <div className="mt-4 h-px w-full bg-slate-200" />
                                <div className="mt-4 text-xs font-extrabold uppercase tracking-widest text-primary-700 transition group-hover:text-primary-800">
                                    Recognition
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
