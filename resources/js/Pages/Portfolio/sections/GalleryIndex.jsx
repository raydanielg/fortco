import AnimatedIcon from '../../../Components/AnimatedIcon';
import folder from 'react-useanimations/lib/folder';
import { router } from '@inertiajs/react';

export default function GalleryIndex() {
    const sections = [
        {
            title: 'Residential Gallery',
            items: [
                'Edmark Estate Exterior (12 images)',
                'Edmark Estate Interiors (18 images)',
                'Mbuyuni Villas Lake Views (15 images)',
                'Kilimanjaro Apartments (10 images)',
                'Teachers Housing Scheme (8 images)',
            ],
        },
        {
            title: 'Commercial Gallery',
            items: ['Nyerere Plaza Facade (6 images)', 'Victoria Tower Interiors (12 images)', 'Office Spaces (20 images)'],
        },
        {
            title: 'Construction Progress',
            items: ['Foundation works (25 images)', 'Structural framing (18 images)', 'Finishing stages (22 images)'],
        },
    ];

    return (
        <section id="gallery" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Project gallery index</div>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">A structured photo catalog</h2>
            <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600">
                This index outlines how our galleries are organized. Images can be added per project as the portfolio expands.
            </p>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
                {sections.map((s) => (
                    <div key={s.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-base font-black tracking-tight text-slate-900">{s.title}</h3>
                        <p className="mt-2 text-sm font-medium text-slate-600">Tap a folder to explore the gallery set.</p>

                        <div className="mt-5 grid gap-3">
                            {s.items.map((x) => (
                                <button
                                    key={x}
                                    type="button"
                                    onClick={() => router.visit('/gallery')}
                                    className="group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md active:translate-y-0"
                                >
                                    <span className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-white/25 blur-2xl" aria-hidden="true" />
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-50 ring-1 ring-amber-200">
                                        <AnimatedIcon
                                            animation={folder}
                                            size={18}
                                            strokeColor="#b45309"
                                            autoplay
                                            loop
                                            speed={0.65}
                                        />
                                    </span>

                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-sm font-extrabold text-slate-900">{x}</span>
                                        <span className="mt-0.5 block text-xs font-semibold text-slate-600">
                                            Gallery folder
                                        </span>
                                    </span>

                                    <span className="text-slate-500 transition-transform group-hover:translate-x-0.5">→</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
