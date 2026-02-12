export default function PressMedia() {
    const featured = {
        source: 'The Citizen',
        title: '"Fortco Completes Luxury Estate in Kigamboni"',
        excerpt:
            'A milestone delivery that highlights Fortco’s end-to-end capability—from design coordination to quality-controlled handover.',
        date: '2025',
        href: '#',
        tags: ['Project delivery', 'Residential'],
    };

    const items = [
        {
            source: 'Daily News',
            title: '"Mwanza Based Contractor Delivers Teachers Housing"',
            date: '2024',
            href: '#',
            tag: 'Public sector',
        },
        {
            source: 'Business Times',
            title: '"Fortco Expands to Commercial Development"',
            date: '2023',
            href: '#',
            tag: 'Growth',
        },
        {
            source: 'Mwananchi',
            title: '"Local Contractor Wins Government Tender"',
            date: '2022',
            href: '#',
            tag: 'Procurement',
        },
        {
            source: 'Industry Bulletin',
            title: '"Fortco Strengthens Safety Program Across Sites"',
            date: '2022',
            href: '#',
            tag: 'Safety',
        },
        {
            source: 'Construction Review',
            title: '"Fortco Introduces Quality-Control Checklist for Handover"',
            date: '2023',
            href: '#',
            tag: 'Quality',
        },
        {
            source: 'Regional Update',
            title: '"Fortco Partners with Financial Institutions to Support Homebuyers"',
            date: '2024',
            href: '#',
            tag: 'Partnerships',
        },
    ];

    return (
        <section id="press-media" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Press & media</div>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Featured coverage</h2>
            <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600">
                Selected mentions that highlight our growth and delivery record.
            </p>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-primary-900 p-6 text-white shadow-sm sm:p-8">
                    <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
                    <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

                    <div className="relative">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest">
                                {featured.source}
                            </span>
                            <span className="text-xs font-semibold text-white/80">{featured.date}</span>
                        </div>

                        <div className="mt-4 text-xl font-black leading-snug tracking-tight sm:text-2xl">{featured.title}</div>
                        <p className="mt-3 text-sm font-medium leading-relaxed text-white/80">{featured.excerpt}</p>

                        <div className="mt-5 flex flex-wrap gap-2">
                            {featured.tags.map((t) => (
                                <span key={t} className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/90">
                                    {t}
                                </span>
                            ))}
                        </div>

                        <div className="mt-7">
                            <a
                                href={featured.href}
                                className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-slate-900 shadow-sm transition hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/30"
                            >
                                View story
                            </a>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    {items.map((x) => (
                        <a
                            key={x.title}
                            href={x.href}
                            className="group rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">{x.source}</div>
                                <div className="rounded-full bg-white px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-slate-700 ring-1 ring-slate-200">
                                    {x.tag}
                                </div>
                            </div>
                            <div className="mt-3 text-sm font-black leading-snug text-slate-900 sm:text-base">{x.title}</div>
                            <div className="mt-3 flex items-center justify-between gap-3">
                                <div className="text-xs font-semibold text-slate-600">{x.date}</div>
                                <div className="text-xs font-extrabold uppercase tracking-widest text-primary-700 transition group-hover:text-primary-800">
                                    View
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
