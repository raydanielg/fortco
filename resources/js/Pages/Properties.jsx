import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
    AdjustmentsHorizontalIcon,
    BuildingOffice2Icon,
    CheckBadgeIcon,
    ChevronRightIcon,
    ChatBubbleLeftRightIcon,
    ClipboardDocumentCheckIcon,
    PhoneIcon,
    XMarkIcon,
    HomeIcon,
    KeyIcon,
    MapPinIcon,
    MagnifyingGlassIcon,
    RectangleGroupIcon,
    Squares2X2Icon,
    TagIcon,
} from '@heroicons/react/24/outline';
import { FaWhatsapp } from 'react-icons/fa';

import Header from './Home/sections/Header';
import Footer from './Home/sections/Footer';
import Container from './Home/components/Container';

export default function Properties({ canLogin, canRegister }) {
    const [query, setQuery] = useState('');
    const [type, setType] = useState('All');
    const [selected, setSelected] = useState(null);

    const contactPhone = '+255 700 000 000';
    const contactPhoneDigits = '255700000000';

    const propertyTypes = useMemo(() => ['All', 'House', 'Apartment', 'Plot/Land', 'Commercial', 'Rental'], []);

    const properties = useMemo(
        () => [
            {
                id: 1,
                title: 'Modern Family House in Mikocheni',
                type: 'House',
                status: 'For Sale',
                location: 'Dar es Salaam',
                price: 'TZS 480,000,000',
                beds: 4,
                baths: 3,
                size: '320 m²',
                image: '/slides/building-new-concrete-houses_1398-3932.jpg',
                featured: true,
                desc: 'Spacious modern family home with bright living areas, secure parking, and a quiet neighborhood close to key amenities.'
            },
            {
                id: 2,
                title: 'Serviced Apartment near City Center',
                type: 'Apartment',
                status: 'For Rent',
                location: 'Dar es Salaam',
                price: 'TZS 2,500,000 / month',
                beds: 2,
                baths: 2,
                size: '110 m²',
                image: '/slides/beautiful-view-construction-site-city-sunset_181624-9347.jpg',
                featured: false,
                desc: 'Fully serviced apartment with reliable utilities, modern finishes, and quick access to business and shopping areas.'
            },
            {
                id: 3,
                title: 'Prime Plot for Development',
                type: 'Plot/Land',
                status: 'For Sale',
                location: 'Dodoma',
                price: 'TZS 85,000,000',
                beds: null,
                baths: null,
                size: '900 m²',
                image: '/slides/beautiful-view-construction-site-city-building_653669-11417.jpg',
                featured: false,
                desc: 'Well-positioned plot suitable for residential or mixed-use development, with good road access and growth potential.'
            },
            {
                id: 4,
                title: 'Warehouse & Office Space',
                type: 'Commercial',
                status: 'For Lease',
                location: 'Mwanza',
                price: 'TZS 6,000,000 / month',
                beds: null,
                baths: 2,
                size: '520 m²',
                image: '/slides/warehouse-smiling-colleagues-scanning-cardboard-box-barcode-chatting_482257-77667.jpg',
                featured: true,
                desc: 'Flexible warehouse space with office suites, ideal for distribution teams and growing businesses needing reliable access.'
            },
            {
                id: 5,
                title: 'Newly Built Townhouse',
                type: 'Rental',
                status: 'For Rent',
                location: 'Arusha',
                price: 'TZS 1,800,000 / month',
                beds: 3,
                baths: 2,
                size: '180 m²',
                image: '/slides/close-up-hard-hat-holding-by-construction-worker_329181-2825.jpg',
                featured: false,
                desc: 'New townhouse with modern kitchen, private yard, and secure neighborhood — ideal for professionals and families.'
            },
            {
                id: 6,
                title: 'Luxury Apartment with Balcony Views',
                type: 'Apartment',
                status: 'For Sale',
                location: 'Dar es Salaam',
                price: 'TZS 350,000,000',
                beds: 3,
                baths: 2,
                size: '165 m²',
                image: '/slides/young-black-race-man-with-blueprint-stading-near-glass-building_1157-50906.jpg',
                featured: false,
                desc: 'Premium apartment with balcony views, high-quality finishes, and easy access to main roads and city conveniences.'
            },
            {
                id: 7,
                title: 'Commercial Plot on Main Road',
                type: 'Plot/Land',
                status: 'For Sale',
                location: 'Morogoro',
                price: 'TZS 120,000,000',
                beds: null,
                baths: null,
                size: '1,200 m²',
                image: '/slides/construction-works-frankfurt-downtown-germany_1268-20907.jpg',
                featured: false,
                desc: 'Main-road frontage plot ideal for commercial development with strong visibility and long-term value.'
            },
            {
                id: 8,
                title: 'Office Suites for Growing Teams',
                type: 'Commercial',
                status: 'For Lease',
                location: 'Dar es Salaam',
                price: 'TZS 3,200,000 / month',
                beds: null,
                baths: 1,
                size: '140 m²',
                image: '/slides/professional-engineer-team-working-engineering-worker-safety-hardhat-architect-looking_38052-4318.jpg',
                featured: false,
                desc: 'Professional office suites with meeting space options, strong connectivity, and a clean environment for client visits.'
            },
        ],
        []
    );

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return properties.filter((p) => {
            const matchesType = type === 'All' ? true : p.type === type;
            const matchesQuery = !q
                ? true
                : `${p.title} ${p.type} ${p.location} ${p.status}`.toLowerCase().includes(q);
            return matchesType && matchesQuery;
        });
    }, [properties, query, type]);

    const openDetails = (property) => setSelected(property);
    const closeDetails = () => setSelected(null);

    return (
        <>
            <Head title="Properties" />
            <div className="min-h-screen bg-white text-slate-900">
                <Header canLogin={canLogin} canRegister={canRegister} />

                <main>
                    <section className="relative overflow-hidden bg-sand-50 pt-14 pb-10 sm:pt-18">
                        <Container>
                            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                                <div>
                                    <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-black/70 backdrop-blur">
                                        <Squares2X2Icon className="h-4 w-4" />
                                        Properties
                                    </div>

                                    <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                                        Find a place you’ll love.
                                    </h1>
                                    <p className="mt-4 max-w-xl text-base font-medium leading-relaxed text-slate-600">
                                        Browse houses, apartments, plots, rentals and commercial spaces. Use filters to
                                        narrow down options and book a visit in minutes.
                                    </p>

                                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                        <Link
                                            href="#list"
                                            className="inline-flex items-center justify-center rounded-2xl bg-black px-6 py-3 text-sm font-extrabold tracking-wide text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                                        >
                                            Explore Listings
                                        </Link>
                                        <Link
                                            href="/book"
                                            className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white/70 px-6 py-3 text-sm font-extrabold tracking-wide text-slate-900 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                                        >
                                            Book Online
                                        </Link>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="relative overflow-hidden rounded-[2.5rem] border border-black/5 bg-white/70 shadow-sm backdrop-blur">
                                        <div className="absolute inset-0">
                                            <img
                                                src="/slides/beautiful-view-construction-site-city-building_653669-11417.jpg"
                                                alt=""
                                                className="h-full w-full object-cover"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/25 to-transparent" />
                                        </div>

                                        <div className="relative p-6 sm:p-8">
                                            <div className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2 text-xs font-extrabold uppercase tracking-widest text-white backdrop-blur">
                                                <MapPinIcon className="h-4 w-4" />
                                                Tanzania listings
                                            </div>

                                            <div className="mt-5 rounded-3xl bg-white/95 p-4 shadow-xl ring-1 ring-black/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 ring-1 ring-primary-100">
                                                        <MagnifyingGlassIcon className="h-6 w-6" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
                                                            Search
                                                        </p>
                                                        <input
                                                            value={query}
                                                            onChange={(e) => setQuery(e.target.value)}
                                                            placeholder="Search by location, type, status..."
                                                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-primary-300 focus:ring-2 focus:ring-primary-200"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex flex-wrap items-center gap-2">
                                                    {propertyTypes.map((t) => (
                                                        <button
                                                            key={t}
                                                            type="button"
                                                            onClick={() => setType(t)}
                                                            className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-widest transition ${
                                                                type === t
                                                                    ? 'bg-slate-900 text-white'
                                                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                            }`}
                                                        >
                                                            {t}
                                                        </button>
                                                    ))}

                                                    <div className="ml-auto inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-slate-700">
                                                        <AdjustmentsHorizontalIcon className="h-4 w-4" />
                                                        Filters
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                                {[{ label: 'Houses', Icon: HomeIcon }, { label: 'Commercial', Icon: BuildingOffice2Icon }].map((x) => (
                                                    <div
                                                        key={x.label}
                                                        className="rounded-2xl border border-white/15 bg-white/10 p-4 text-white backdrop-blur"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                                                                <x.Icon className="h-5 w-5" />
                                                            </span>
                                                            <div>
                                                                <p className="text-sm font-black tracking-wide">{x.label}</p>
                                                                <p className="text-xs font-semibold text-white/80">Popular category</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Container>
                    </section>

                    <section id="list" className="bg-white py-14">
                        <Container>
                            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Listings</div>
                                    <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                                        Browse properties
                                    </h2>
                                    <p className="mt-2 text-sm font-medium text-slate-600">
                                        Showing <span className="font-extrabold text-slate-900">{filtered.length}</span> results
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <a
                                        href="#contact"
                                        className="inline-flex items-center justify-center rounded-2xl bg-primary-600 px-5 py-2.5 text-sm font-extrabold tracking-wide text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-md"
                                    >
                                        Book a visit
                                    </a>
                                    <a
                                        href="#"
                                        className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-extrabold tracking-wide text-slate-900 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md"
                                    >
                                        Contact agent
                                    </a>
                                </div>
                            </div>

                            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {filtered.map((p) => (
                                    <article
                                        key={p.id}
                                        className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                                    >
                                        <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                                            <img
                                                src={p.image}
                                                alt=""
                                                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                                            <div className="absolute left-4 top-4 flex items-center gap-2">
                                                <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-slate-900">
                                                    {p.status}
                                                </span>
                                                {p.featured ? (
                                                    <span className="rounded-full bg-primary-600 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white shadow">
                                                        Featured
                                                    </span>
                                                ) : null}
                                            </div>

                                            <div className="absolute bottom-4 left-4 right-4">
                                                <div className="flex items-end justify-between gap-3">
                                                    <p className="text-white text-sm font-extrabold uppercase tracking-widest">{p.type}</p>
                                                    <p className="text-white text-base font-black drop-shadow">{p.price}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-1 flex-col p-6">
                                            <h3 className="text-lg font-black tracking-tight text-slate-900">{p.title}</h3>
                                            <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-600">
                                                <MapPinIcon className="h-4 w-4" />
                                                {p.location}
                                            </p>

                                            <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600 line-clamp-2">
                                                {p.desc}
                                            </p>

                                            <div className="mt-5">
                                                <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                                                    Specifications
                                                </div>
                                                <div className="mt-3 grid gap-y-2">
                                                    <div className="flex items-center justify-between gap-4">
                                                        <div className="inline-flex items-center gap-2 text-sm font-bold text-slate-600">
                                                            <HomeIcon className="h-4 w-4 text-primary-700" />
                                                            <span>Beds</span>
                                                        </div>
                                                        <div className="text-sm font-black text-slate-900">{p.beds ?? '—'}</div>
                                                    </div>
                                                    <div className="flex items-center justify-between gap-4">
                                                        <div className="inline-flex items-center gap-2 text-sm font-bold text-slate-600">
                                                            <KeyIcon className="h-4 w-4 text-primary-700" />
                                                            <span>Baths</span>
                                                        </div>
                                                        <div className="text-sm font-black text-slate-900">{p.baths ?? '—'}</div>
                                                    </div>
                                                    <div className="flex items-center justify-between gap-4">
                                                        <div className="inline-flex items-center gap-2 text-sm font-bold text-slate-600">
                                                            <RectangleGroupIcon className="h-4 w-4 text-primary-700" />
                                                            <span>Area</span>
                                                        </div>
                                                        <div className="text-sm font-black text-slate-900">{p.size}</div>
                                                    </div>
                                                    <div className="flex items-center justify-between gap-4">
                                                        <div className="inline-flex items-center gap-2 text-sm font-bold text-slate-600">
                                                            <CheckBadgeIcon className="h-4 w-4 text-primary-700" />
                                                            <span>Status</span>
                                                        </div>
                                                        <div className="text-sm font-black text-slate-900">{p.status}</div>
                                                    </div>
                                                    <div className="flex items-center justify-between gap-4">
                                                        <div className="inline-flex items-center gap-2 text-sm font-bold text-slate-600">
                                                            <TagIcon className="h-4 w-4 text-primary-700" />
                                                            <span>Type</span>
                                                        </div>
                                                        <div className="text-sm font-black text-slate-900">{p.type}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-6 flex items-center gap-3">
                                                <a
                                                    href="#contact"
                                                    className="inline-flex flex-1 items-center justify-center rounded-2xl bg-black px-4 py-2.5 text-sm font-extrabold tracking-wide text-white shadow-sm transition-all hover:bg-slate-900"
                                                >
                                                    Book viewing
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={() => openDetails(p)}
                                                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold tracking-wide text-slate-900 shadow-sm transition-all hover:bg-slate-50"
                                                >
                                                    Details
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </Container>
                    </section>
                </main>

                <Transition show={!!selected} as="div">
                    <Dialog as="div" className="relative z-50" onClose={closeDetails}>
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
                                    className="w-full max-w-4xl"
                                >
                                    <Dialog.Panel className="overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5">
                                        {selected ? (
                                            <>
                                                <div className="grid lg:grid-cols-2">
                                                    <div className="relative">
                                                        <div className="relative h-64 w-full overflow-hidden bg-slate-100 sm:h-80 lg:h-full">
                                                            <img
                                                                src={selected.image}
                                                                alt=""
                                                                className="h-full w-full object-cover"
                                                                loading="lazy"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/25 to-transparent" />
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={closeDetails}
                                                            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
                                                            aria-label="Close"
                                                        >
                                                            <XMarkIcon className="h-6 w-6" />
                                                        </button>

                                                        <div className="absolute left-4 top-4 flex items-center gap-2">
                                                            <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-slate-900">
                                                                {selected.status}
                                                            </span>
                                                            {selected.featured ? (
                                                                <span className="rounded-full bg-primary-600 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white shadow">
                                                                    Featured
                                                                </span>
                                                            ) : null}
                                                        </div>

                                                        <div className="absolute bottom-4 left-4 right-4">
                                                            <p className="text-white text-lg font-black drop-shadow">{selected.price}</p>
                                                            <p className="mt-1 text-white/85 text-sm font-semibold inline-flex items-center gap-2">
                                                                <MapPinIcon className="h-4 w-4" />
                                                                {selected.location}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="p-6 sm:p-8">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div>
                                                                <Dialog.Title className="text-2xl font-black tracking-tight text-slate-900">
                                                                    {selected.title}
                                                                </Dialog.Title>
                                                                <p className="mt-2 text-sm font-semibold text-slate-600">{selected.type}</p>
                                                            </div>
                                                            <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-extrabold uppercase tracking-widest text-slate-700">
                                                                <ClipboardDocumentCheckIcon className="h-4 w-4" />
                                                                Verified
                                                            </div>
                                                        </div>

                                                        <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600">
                                                            {selected.desc}
                                                        </p>

                                                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                                            {[
                                                                { label: 'Beds', value: selected.beds ?? '—', Icon: HomeIcon },
                                                                { label: 'Baths', value: selected.baths ?? '—', Icon: KeyIcon },
                                                                { label: 'Area', value: selected.size, Icon: RectangleGroupIcon },
                                                                { label: 'Status', value: selected.status, Icon: CheckBadgeIcon },
                                                            ].map((item) => (
                                                                <div
                                                                    key={item.label}
                                                                    className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                                                                >
                                                                    <div className="inline-flex items-center gap-2 text-sm font-extrabold text-slate-600">
                                                                        <item.Icon className="h-5 w-5 text-primary-700" />
                                                                        {item.label}
                                                                    </div>
                                                                    <div className="text-sm font-black text-slate-900">{item.value}</div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                                            <div className="flex items-center justify-between gap-4">
                                                                <div>
                                                                    <p className="text-sm font-black text-slate-900">Contact agent</p>
                                                                    <p className="mt-1 text-sm font-semibold text-slate-600">{contactPhone}</p>
                                                                </div>
                                                                <div className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-sm ring-1 ring-slate-100">
                                                                    <PhoneIcon className="h-5 w-5 text-primary-700" />
                                                                    <span className="text-xs font-extrabold uppercase tracking-widest text-slate-700">Fast reply</span>
                                                                </div>
                                                            </div>

                                                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                                                <a
                                                                    href={`tel:${contactPhoneDigits}`}
                                                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-extrabold tracking-wide text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-900 hover:shadow-md"
                                                                >
                                                                    <PhoneIcon className="h-5 w-5" />
                                                                    Call now
                                                                </a>
                                                                <a
                                                                    href={`https://wa.me/${contactPhoneDigits}?text=${encodeURIComponent(
                                                                        `Hello Fortco, I'm interested in: ${selected.title} (${selected.location}). Please share more details.`
                                                                    )}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-green-500 px-5 py-3 text-sm font-extrabold tracking-wide text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-green-600 hover:shadow-md"
                                                                >
                                                                    <FaWhatsapp className="h-5 w-5" />
                                                                    WhatsApp
                                                                </a>
                                                            </div>

                                                            <div className="mt-4 flex items-center justify-between gap-3">
                                                                <button
                                                                    type="button"
                                                                    onClick={closeDetails}
                                                                    className="text-xs font-extrabold uppercase tracking-widest text-slate-500 hover:text-slate-700"
                                                                >
                                                                    Not today
                                                                </button>
                                                                <a
                                                                    href="#contact"
                                                                    onClick={closeDetails}
                                                                    className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-primary-700 hover:text-primary-800"
                                                                >
                                                                    Send a message
                                                                    <ChatBubbleLeftRightIcon className="h-4 w-4" />
                                                                </a>
                                                            </div>
                                                        </div>
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
