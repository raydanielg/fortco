import { useMemo, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import AnimatedIcon from '../../../Components/AnimatedIcon';
import calendar from 'react-useanimations/lib/calendar';
import settings from 'react-useanimations/lib/settings';
import activity from 'react-useanimations/lib/activity';
import checkmark from 'react-useanimations/lib/checkmark';
import {
    BuildingOffice2Icon,
    CheckBadgeIcon,
    ArrowUpRightIcon,
    MapPinIcon,
    StarIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

export default function FeaturedProjects() {
    const projects = useMemo(
        () => [
            {
                id: 'edmark-estate',
                name: 'Edmark Residential Estate',
                location: 'Kigamboni, Dar es Salaam',
                year: '2025',
                category: 'Luxury Residential',
                value: 'TZS 4.5 Billion',
                desc: 'Edmark Estate is a gated community featuring 25 luxury villas with modern architectural design. Each villa offers 4 bedrooms, a private garden, swimming pool, and smart home technology. The estate includes a clubhouse, gymnasium, children\'s playground, and 24/7 security surveillance.',
                features: [
                    '25 Luxury Villas',
                    '4 Bedrooms each with ensuite',
                    'Smart home automation',
                    'Private swimming pools',
                    'Landscaped gardens',
                    'Solar power backup',
                    'Borehole water supply',
                    'Fiber optic internet ready',
                ],
                testimonial:
                    '"Fortco built our dream home exactly as we imagined. The quality is exceptional and they delivered on time. We couldn\'t be happier." — Mr. & Mrs. Edmark',
            },
            {
                id: 'nyerere-plaza',
                name: 'Nyerere Commercial Plaza',
                location: 'Nyerere Road, Mwanza',
                year: '2024',
                category: 'Commercial',
                value: 'TZS 8.2 Billion',
                desc: 'A 7-story modern commercial complex housing offices, retail spaces, and a food court. Located in the heart of Mwanza\'s business district, this landmark building features floor-to-ceiling glass facades, high-speed elevators, and premium finishes throughout.',
                features: [
                    '7 Floors (Ground + 6)',
                    '45 Office Spaces',
                    '12 Retail Shops',
                    'Food Court (5 outlets)',
                    'Basement parking (80 cars)',
                    '2 High-speed elevators',
                    'Backup generators (150 KVA)',
                    'CCTV surveillance & conference facilities',
                ],
                occupiedBy: ['UBA Bank (Ground Floor)', 'Vodacom Tanzania', 'Airtel Tanzania', 'Various law firms & consultants'],
            },
            {
                id: 'mbuyuni-villas',
                name: 'Mbuyuni Villas',
                location: 'Mbuyuni, Mwanza',
                year: '2023',
                category: 'Luxury Residential',
                value: 'TZS 2.8 Billion',
                desc: 'A boutique development of 12 premium villas overlooking Lake Victoria. Each villa offers contemporary African design with floor-to-ceiling windows capturing stunning lake views. These homes blend modern luxury with local craftsmanship.',
                features: [
                    '12 Villas (3 & 4 bedroom options)',
                    'Lake Victoria views',
                    'Private rooftop terraces',
                    'Modern African interiors',
                    'Solar water heating',
                    'Smart lighting systems',
                    'Electric gates',
                    'Landscaped compound',
                ],
            },
            {
                id: 'kilimanjaro-apartments',
                name: 'Kilimanjaro Apartments',
                location: 'Arusha',
                year: '2022',
                category: 'Residential (Mid-Range)',
                value: 'TZS 3.1 Billion',
                desc: 'A 6-story apartment building featuring 40 modern 2 and 3-bedroom units. Designed for middle-income families seeking quality housing in Arusha. The development includes retail spaces on the ground floor for convenience.',
                features: [
                    '40 Apartments (2 & 3 Bedroom)',
                    'Ground floor retail (6 shops)',
                    'Rooftop garden',
                    'Children\'s play area',
                    'Gymnasium',
                    '24/7 security',
                    'Backup water supply',
                ],
            },
            {
                id: 'kariakoo-warehouse',
                name: 'Kariakoo Industrial Warehouse',
                location: 'Kariakoo, Dar es Salaam',
                year: '2022',
                category: 'Industrial/Commercial',
                value: 'TZS 1.9 Billion',
                desc: 'A modern warehouse facility with 2,500 square meters of storage space, office mezzanine, and heavy-duty loading bays. Built to international standards for a leading logistics company.',
                features: [
                    '2,500 sqm warehouse space',
                    '8m ceiling height',
                    '4 Loading bays',
                    'Mezzanine offices',
                    'Truck parking (10 trucks)',
                    'Fire suppression system',
                    '24/7 CCTV',
                ],
            },
            {
                id: 'teachers-housing',
                name: "Mwanza Teachers' Housing Scheme",
                location: 'Mwanza City',
                year: '2021',
                category: 'Social Housing',
                value: 'TZS 2.2 Billion',
                desc: 'A government-partnered project delivering 60 affordable housing units for public school teachers. This project demonstrates our commitment to community development and social impact.',
                features: ['60 Housing Units', '2 & 3 Bedroom options', 'Community center', 'Solar street lighting', 'Water kiosk', 'Playground', 'Access roads'],
            },
            {
                id: 'beach-plaza',
                name: 'Beach Plaza Resort',
                location: 'Kunduchi, Dar es Salaam',
                year: '2020',
                category: 'Hospitality',
                value: 'TZS 5.7 Billion',
                desc: 'A 50-room beachfront resort with restaurant, bar, swimming pool, and conference facilities. Full design and construction delivered by Fortco.',
                features: ['50 Guest Rooms', '2 Restaurants', 'Infinity pool', 'Conference hall (200 pax)', 'Spa & wellness center', 'Beach access', 'Landscaped gardens'],
            },
            {
                id: 'victoria-tower',
                name: 'Victoria Office Tower',
                location: 'Mwanza',
                year: '2019',
                category: 'Commercial',
                value: 'TZS 4.3 Billion',
                desc: 'A 5-story modern office building in central Mwanza. Features premium office spaces designed for banks, telecommunications companies, and corporate headquarters.',
                features: ['5 Floors', '30 Office Suites', 'Boardroom facilities', 'Cafeteria', 'Basement parking', '2 Elevators', '100 KVA Generator'],
            },
        ],
        []
    );

    const [selected, setSelected] = useState(null);

    return (
        <section id="completed-projects" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Featured projects</div>
                    <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Signature delivery across Tanzania</h2>
                    <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">
                        A selection of completed projects demonstrating quality, scale, and attention to detail.
                    </p>
                </div>
                <a
                    href="#ongoing-projects"
                    className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-extrabold tracking-wide text-white shadow-sm transition hover:bg-black"
                >
                    View ongoing
                </a>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {projects.map((p) => (
                    <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelected(p)}
                        className="group text-left rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-slate-700">
                                    <BuildingOffice2Icon className="h-4 w-4" />
                                    {p.category}
                                </div>
                                <h3 className="mt-3 text-lg font-black tracking-tight text-slate-900 group-hover:text-primary-800">
                                    {p.name}
                                </h3>
                                <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-600">
                                    <MapPinIcon className="h-4 w-4" />
                                    {p.location}
                                </p>
                            </div>
                            <div className="shrink-0 text-right">
                                <div className="text-sm font-black text-slate-900">{p.value}</div>
                                <div className="mt-1 text-[11px] font-extrabold uppercase tracking-widest text-slate-500">{p.year}</div>
                            </div>
                        </div>
                        <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600 line-clamp-3">{p.desc}</p>
                        <div className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-primary-700">
                            View details
                            <StarIcon className="h-4 w-4" />
                        </div>
                    </button>
                ))}
            </div>

            <Transition show={!!selected} as="div">
                <Dialog as="div" className="relative z-50" onClose={() => setSelected(null)}>
                    <Transition.Child
                        as="div"
                        enter="ease-out duration-200"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-150"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        className="fixed inset-0 bg-black/60"
                    />
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
                            <Transition.Child
                                as="div"
                                enter="ease-out duration-200"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-2 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-2 sm:scale-95"
                                className="w-full max-w-3xl"
                            >
                                <Dialog.Panel className="overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5">
                                    {selected ? (
                                        <>
                                            <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-6">
                                                <div>
                                                    <Dialog.Title className="text-xl font-black tracking-tight text-slate-900">
                                                        {selected.name}
                                                    </Dialog.Title>
                                                    <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-600">
                                                        <MapPinIcon className="h-4 w-4" />
                                                        {selected.location}
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setSelected(null)}
                                                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                                                    aria-label="Close"
                                                >
                                                    <XMarkIcon className="h-6 w-6" />
                                                </button>
                                            </div>

                                            <div className="p-6">
                                                <div className="grid gap-3 sm:grid-cols-3">
                                                    {[
                                                        { label: 'Year', value: selected.year, icon: calendar },
                                                        { label: 'Category', value: selected.category, icon: settings },
                                                        { label: 'Value', value: selected.value, icon: activity },
                                                    ].map((x) => (
                                                        <div key={x.label} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                                                            <div className="flex items-start justify-between gap-4">
                                                                <div>
                                                                    <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">{x.label}</div>
                                                                    <div className="mt-1 text-sm font-black text-slate-900">{x.value}</div>
                                                                </div>
                                                                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                                                                    <AnimatedIcon
                                                                        animation={x.icon}
                                                                        size={22}
                                                                        strokeColor="#1d4ed8"
                                                                        className="text-primary-700"
                                                                        speed={0.65}
                                                                        loop
                                                                    />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <p className="mt-5 text-sm font-medium leading-relaxed text-slate-600">{selected.desc}</p>

                                                <div className="mt-6">
                                                    <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-slate-500">
                                                        <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-100 ring-1 ring-slate-200">
                                                            <AnimatedIcon animation={checkmark} size={18} strokeColor="#1d4ed8" speed={0.65} loop />
                                                        </span>
                                                        Key features
                                                    </div>
                                                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                                        {selected.features.map((f) => (
                                                            <div key={f} className="flex items-start gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                                                <CheckBadgeIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />
                                                                <div className="text-sm font-semibold text-slate-700">{f}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {selected.occupiedBy ? (
                                                    <div className="mt-6">
                                                        <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500">Occupied by</div>
                                                        <div className="mt-3 flex flex-wrap gap-2">
                                                            {selected.occupiedBy.map((x) => (
                                                                <span
                                                                    key={x}
                                                                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700"
                                                                >
                                                                    {x}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : null}

                                                {selected.testimonial ? (
                                                    <div className="mt-6 rounded-3xl bg-slate-900 p-6 text-white">
                                                        <div className="text-xs font-extrabold uppercase tracking-widest text-white/70">Client testimonial</div>
                                                        <p className="mt-3 text-sm font-semibold leading-relaxed text-white/90">{selected.testimonial}</p>
                                                    </div>
                                                ) : null}
                                            </div>

                                            <div className="border-t border-slate-200 p-6">
                                                <a
                                                    href="#portfolio-contact"
                                                    onClick={() => setSelected(null)}
                                                    className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-900 to-primary-900 px-6 py-3.5 text-sm font-extrabold tracking-wide text-white shadow-sm ring-1 ring-black/5 transition hover:from-black hover:to-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
                                                >
                                                    Request project information
                                                    <ArrowUpRightIcon className="h-5 w-5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                                </a>
                                            </div>
                                        </>
                                    ) : null}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </section>
    );
}
