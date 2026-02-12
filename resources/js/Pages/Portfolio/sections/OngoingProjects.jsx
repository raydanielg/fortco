import { useMemo } from 'react';
import { BuildingOffice2Icon, CalendarDaysIcon, ChartBarIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function OngoingProjects() {
    const projects = useMemo(
        () => [
            {
                name: 'Fortco Lakeview Estate',
                location: 'Ilemela, Mwanza',
                expected: 'December 2026',
                category: 'Luxury Residential',
                progress: '65% Complete',
                desc: 'Our flagship development featuring 50 luxury villas on the shores of Lake Victoria. The largest residential project in Mwanza\'s history.',
                status: [
                    { label: 'Site clearing', value: '100%' },
                    { label: 'Foundation works', value: '100%' },
                    { label: 'Structural framing', value: '80%' },
                    { label: 'Roofing', value: '60%' },
                    { label: 'Finishes', value: '40%' },
                    { label: 'Landscaping', value: '20%' },
                ],
            },
            {
                name: 'Dodoma Parliamentary Housing',
                location: 'Dodoma',
                expected: 'March 2027',
                category: 'Government/Residential',
                progress: '45% Complete',
                desc: '120 housing units for Members of Parliament and government officials near the new parliament buildings.',
            },
            {
                name: 'Zanzibar Tourist Village',
                location: 'Nungwi, Zanzibar',
                expected: 'August 2027',
                category: 'Hospitality',
                progress: '30% Complete',
                desc: '80-room eco-luxury resort with traditional Swahili architecture and modern amenities.',
            },
        ],
        []
    );

    return (
        <section id="ongoing-projects" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Ongoing projects</div>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">What we’re building now</h2>
            <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600">
                Live progress updates for select projects currently under construction.
            </p>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
                {projects.map((p) => (
                    <article key={p.name} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-slate-700">
                            <BuildingOffice2Icon className="h-4 w-4" />
                            {p.category}
                        </div>
                        <h3 className="mt-3 text-lg font-black tracking-tight text-slate-900">{p.name}</h3>
                        <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-600">
                            <MapPinIcon className="h-4 w-4" />
                            {p.location}
                        </p>

                        <div className="mt-4 grid gap-2">
                            <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
                                <div className="inline-flex items-center gap-2 text-sm font-extrabold text-slate-600">
                                    <CalendarDaysIcon className="h-5 w-5 text-primary-700" />
                                    Expected completion
                                </div>
                                <div className="text-sm font-black text-slate-900">{p.expected}</div>
                            </div>
                            <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
                                <div className="inline-flex items-center gap-2 text-sm font-extrabold text-slate-600">
                                    <ChartBarIcon className="h-5 w-5 text-primary-700" />
                                    Progress
                                </div>
                                <div className="text-sm font-black text-slate-900">{p.progress}</div>
                            </div>
                        </div>

                        <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600">{p.desc}</p>

                        {p.status ? (
                            <div className="mt-5">
                                <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Status update</div>
                                <div className="mt-3 grid gap-2">
                                    {p.status.map((x) => (
                                        <div key={x.label} className="flex items-center justify-between gap-4">
                                            <div className="text-sm font-semibold text-slate-600">{x.label}</div>
                                            <div className="text-sm font-black text-slate-900">{x.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </article>
                ))}
            </div>
        </section>
    );
}
