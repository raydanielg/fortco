import { Head } from '@inertiajs/react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useMemo, useState } from 'react';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    MapPinIcon,
    Squares2X2Icon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

import Header from '../Home/sections/Header';
import Footer from '../Home/sections/Footer';
import Container from '../Home/components/Container';

export default function Index({ canLogin, canRegister }) {
    const categories = useMemo(
        () => [
            {
                key: 'residential',
                name: 'Residential',
                desc: 'Homes, villas, apartments and living spaces.',
            },
            {
                key: 'commercial',
                name: 'Commercial',
                desc: 'Offices, retail and large-scale business spaces.',
            },
            {
                key: 'progress',
                name: 'Construction Progress',
                desc: 'Foundation, structure, finishing stages.',
            },
        ],
        []
    );

    const images = useMemo(
        () => [
            {
                id: 1,
                category: 'residential',
                title: 'Edmark Estate — Exterior Views',
                subtitle: 'Kigamboni, Dar es Salaam',
                src: '/slides/building-new-concrete-houses_1398-3932.jpg',
            },
            {
                id: 2,
                category: 'residential',
                title: 'Mbuyuni Villas — Lake View Homes',
                subtitle: 'Mbuyuni, Mwanza',
                src: '/slides/beautiful-view-construction-site-city-sunset_181624-9347.jpg',
            },
            {
                id: 3,
                category: 'residential',
                title: 'Kilimanjaro Apartments — Modern Units',
                subtitle: 'Arusha',
                src: '/slides/young-black-race-man-with-blueprint-stading-near-glass-building_1157-50906.jpg',
            },
            {
                id: 4,
                category: 'commercial',
                title: 'Nyerere Commercial Plaza — Facade',
                subtitle: 'Nyerere Road, Mwanza',
                src: '/slides/construction-works-frankfurt-downtown-germany_1268-20907.jpg',
            },
            {
                id: 5,
                category: 'commercial',
                title: 'Victoria Office Tower — Interiors',
                subtitle: 'Mwanza',
                src: '/slides/professional-engineer-team-working-engineering-worker-safety-hardhat-architect-looking_38052-4318.jpg',
            },
            {
                id: 6,
                category: 'commercial',
                title: 'Warehouse & Office Space — Operations',
                subtitle: 'Mwanza',
                src: '/slides/warehouse-smiling-colleagues-scanning-cardboard-box-barcode-chatting_482257-77667.jpg',
            },
            {
                id: 7,
                category: 'progress',
                title: 'Foundation Works — Site Setup',
                subtitle: 'Project progress',
                src: '/slides/photo-construction-site-engineers-workers-labors_763111-52772.jpg',
            },
            {
                id: 8,
                category: 'progress',
                title: 'Structural Framing — Progress',
                subtitle: 'Project progress',
                src: '/slides/beautiful-view-construction-site-city-building_653669-11417.jpg',
            },
            {
                id: 9,
                category: 'progress',
                title: 'Finishing Stages — Detail Work',
                subtitle: 'Project progress',
                src: '/slides/close-up-hard-hat-holding-by-construction-worker_329181-2825.jpg',
            },
        ],
        []
    );

    const [activeCategory, setActiveCategory] = useState('residential');
    const [activeIndex, setActiveIndex] = useState(null);

    const filtered = useMemo(() => images.filter((x) => x.category === activeCategory), [images, activeCategory]);

    const activeImage = activeIndex === null ? null : filtered[activeIndex];

    const close = () => setActiveIndex(null);
    const next = () => setActiveIndex((i) => (i === null ? 0 : (i + 1) % filtered.length));
    const prev = () => setActiveIndex((i) => (i === null ? 0 : (i - 1 + filtered.length) % filtered.length));

    return (
        <>
            <Head title="Gallery" />
            <div className="min-h-screen bg-white text-slate-900">
                <Header canLogin={canLogin} canRegister={canRegister} />

                <main>
                    <section className="bg-sand-50 py-14">
                        <Container>
                            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                                <div className="max-w-2xl">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-black/70 backdrop-blur">
                                        <Squares2X2Icon className="h-4 w-4" />
                                        Gallery
                                    </div>
                                    <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">Project gallery</h1>
                                    <p className="mt-4 text-base font-medium leading-relaxed text-slate-600">
                                        Browse image collections by category. Tap any image to open a full-size carousel.
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {categories.map((c) => {
                                        const isActive = c.key === activeCategory;
                                        return (
                                            <button
                                                key={c.key}
                                                type="button"
                                                onClick={() => setActiveCategory(c.key)}
                                                className={`rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-widest transition ${
                                                    isActive
                                                        ? 'bg-slate-900 text-white'
                                                        : 'bg-white/70 text-slate-700 ring-1 ring-black/10 hover:bg-white'
                                                }`}
                                            >
                                                {c.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {filtered.map((img, idx) => (
                                    <button
                                        key={img.id}
                                        type="button"
                                        onClick={() => setActiveIndex(idx)}
                                        className="group overflow-hidden rounded-3xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                                    >
                                        <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                                            <img
                                                src={img.src}
                                                alt=""
                                                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                                        </div>

                                        <div className="p-5">
                                            <div className="text-sm font-black tracking-tight text-slate-900">{img.title}</div>
                                            <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-600">
                                                <MapPinIcon className="h-4 w-4" />
                                                {img.subtitle}
                                            </div>
                                            <div className="mt-4 text-xs font-extrabold uppercase tracking-widest text-primary-700">
                                                View full image <span className="ml-1 transition-transform group-hover:translate-x-0.5">→</span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </Container>
                    </section>
                </main>

                <Transition show={activeIndex !== null} as={Fragment}>
                    <Dialog as="div" className="relative z-50" onClose={close}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-150"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black/70" />
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-200"
                                    enterFrom="opacity-0 translate-y-4 sm:translate-y-2 sm:scale-95"
                                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                                    leave="ease-in duration-150"
                                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                    leaveTo="opacity-0 translate-y-4 sm:translate-y-2 sm:scale-95"
                                >
                                    <Dialog.Panel className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/10">
                                        {activeImage ? (
                                            <>
                                                <div className="relative bg-slate-950">
                                                    <img
                                                        src={activeImage.src}
                                                        alt=""
                                                        className="mx-auto max-h-[70vh] w-auto object-contain"
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={close}
                                                        className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
                                                        aria-label="Close"
                                                    >
                                                        <XMarkIcon className="h-6 w-6" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={prev}
                                                        className="absolute left-4 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
                                                        aria-label="Previous"
                                                    >
                                                        <ChevronLeftIcon className="h-6 w-6" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={next}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
                                                        aria-label="Next"
                                                    >
                                                        <ChevronRightIcon className="h-6 w-6" />
                                                    </button>
                                                </div>

                                                <div className="border-t border-slate-200 p-5 sm:p-6">
                                                    <Dialog.Title className="text-lg font-black tracking-tight text-slate-900">
                                                        {activeImage.title}
                                                    </Dialog.Title>
                                                    <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-600">
                                                        <MapPinIcon className="h-4 w-4" />
                                                        {activeImage.subtitle}
                                                    </p>

                                                    <div className="mt-4 text-xs font-extrabold uppercase tracking-widest text-slate-500">
                                                        Category: {categories.find((c) => c.key === activeCategory)?.name}
                                                    </div>
                                                </div>
                                            </>
                                        ) : null}
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>

                <Footer />
            </div>
        </>
    );
}
