import { Head } from '@inertiajs/react';

import Header from './Home/sections/Header';
import Footer from './Home/sections/Footer';
import Container from './Home/components/Container';

import AnimatedIcon from '../Components/AnimatedIcon';
import settings from 'react-useanimations/lib/settings';
import home from 'react-useanimations/lib/home';
import explore from 'react-useanimations/lib/explore';
import activity from 'react-useanimations/lib/activity';
import calendar from 'react-useanimations/lib/calendar';
import checkmark from 'react-useanimations/lib/checkmark';

import {
    ArrowRightIcon,
    BuildingOffice2Icon,
    PaintBrushIcon,
    DocumentTextIcon,
    TruckIcon,
    ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

export default function Services({ canLogin, canRegister }) {
    const services = [
        {
            id: 'construction',
            title: 'Construction',
            desc: 'Residential, commercial, and institutional builds delivered with quality control, safety, and reliable timelines.',
            icon: BuildingOffice2Icon,
            animation: settings,
            bullets: ['Project planning & supervision', 'Materials & workforce management', 'Quality assurance & handover'],
        },
        {
            id: 'interior-design',
            title: 'Interior Design',
            desc: 'Functional, premium interiors designed to match the project’s purpose, brand, and lifestyle needs.',
            icon: PaintBrushIcon,
            animation: explore,
            bullets: ['Space planning & finishes', 'Fit-out coordination', 'Lighting & furniture guidance'],
        },
        {
            id: 'architectural-plans',
            title: 'Architectural Plans',
            desc: 'Professional drawings and documentation to support approvals, construction readiness, and design clarity.',
            icon: DocumentTextIcon,
            animation: home,
            bullets: ['Concept design', 'Working drawings', 'Approval-ready submissions'],
        },
        {
            id: 'general-supply',
            title: 'General Supply',
            desc: 'Reliable sourcing and supply support for construction and property operations with consistent standards.',
            icon: TruckIcon,
            animation: activity,
            bullets: ['Construction materials sourcing', 'Operational supplies', 'Delivery coordination'],
        },
        {
            id: 'consultation',
            title: 'Consultation',
            desc: 'Guidance on feasibility, budgeting, timelines, and delivery strategy—aligned to your goals and constraints.',
            icon: ChatBubbleLeftRightIcon,
            animation: calendar,
            bullets: ['Feasibility & budgeting', 'Timeline planning', 'Risk & delivery strategy'],
        },
    ];

    return (
        <>
            <Head title="Services" />
            <div className="min-h-screen bg-white text-slate-900">
                <Header canLogin={canLogin} canRegister={canRegister} />

                <main>
                    <section className="relative overflow-hidden bg-white">
                        <div className="absolute -right-40 -top-48 h-96 w-96 rounded-full bg-primary-200/60 blur-3xl" />
                        <div className="absolute -left-40 -bottom-56 h-96 w-96 rounded-full bg-slate-200/70 blur-3xl" />

                        <Container className="relative py-14 sm:py-20">
                            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                                <div>
                                    <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500">Services</div>
                                    <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
                                        Services that help you plan, build, and deliver
                                    </h1>
                                    <p className="mt-5 max-w-xl text-sm font-medium leading-relaxed text-slate-600 sm:text-lg">
                                        From architectural planning to construction delivery and supply support, Fortco provides a reliable, quality-focused service
                                        stack for projects across Tanzania.
                                    </p>

                                    <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                                        <a
                                            href="#services-list"
                                            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-extrabold tracking-wide text-white shadow-sm transition hover:bg-black"
                                        >
                                            Explore services
                                            <ArrowRightIcon className="ml-2 h-5 w-5" />
                                        </a>
                                        <a
                                            href="#portfolio-contact"
                                            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-extrabold tracking-wide text-slate-900 shadow-sm transition hover:bg-slate-50"
                                        >
                                            Request a quote
                                        </a>
                                    </div>

                                    <div className="mt-8 grid gap-3 sm:grid-cols-3">
                                        {[{ k: 'Quality', a: checkmark }, { k: 'Planning', a: calendar }, { k: 'Delivery', a: activity }].map((x) => (
                                            <div key={x.k} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-50 ring-1 ring-primary-100">
                                                        <AnimatedIcon animation={x.a} size={22} strokeColor="#1d4ed8" speed={0.65} loop />
                                                    </span>
                                                    <div className="text-sm font-black text-slate-900">{x.k}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500">Quick navigation</div>
                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                        {services.map((s) => (
                                            <a
                                                key={s.id}
                                                href={`#${s.id}`}
                                                className="group flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100 transition hover:bg-white"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                                                        <s.icon className="h-5 w-5 text-primary-700" />
                                                    </span>
                                                    <div className="text-sm font-extrabold text-slate-900">{s.title}</div>
                                                </div>
                                                <ArrowRightIcon className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5" />
                                            </a>
                                        ))}
                                    </div>

                                    <div className="mt-6 rounded-2xl bg-slate-900 p-5 text-white">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="text-xs font-extrabold uppercase tracking-widest text-white/70">Need a custom package?</div>
                                                <div className="mt-2 text-sm font-semibold text-white/90">
                                                    Tell us your scope and timeline—we’ll recommend the right service bundle.
                                                </div>
                                            </div>
                                            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                                                <AnimatedIcon animation={explore} size={22} strokeColor="#ffffff" speed={0.65} loop />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Container>
                    </section>

                    <section id="services-list" className="bg-white py-14">
                        <Container>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500">What we offer</div>
                                    <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Core services</h2>
                                    <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-slate-600">
                                        Clear scope, structured delivery, and quality checks at every stage.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 grid gap-6 lg:grid-cols-2">
                                {services.map((s) => (
                                    <article
                                        key={s.id}
                                        id={s.id}
                                        className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                                    >
                                        <div className="flex items-start justify-between gap-5">
                                            <div className="min-w-0">
                                                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-slate-700">
                                                    <s.icon className="h-4 w-4" />
                                                    Service
                                                </div>
                                                <h3 className="mt-3 text-xl font-black tracking-tight text-slate-900">{s.title}</h3>
                                                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">{s.desc}</p>
                                            </div>

                                            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 ring-1 ring-primary-100">
                                                <AnimatedIcon animation={s.animation} size={26} strokeColor="#1d4ed8" speed={0.65} loop />
                                            </span>
                                        </div>

                                        <div className="mt-5 grid gap-2">
                                            {s.bullets.map((b) => (
                                                <div key={b} className="flex items-start gap-2 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
                                                    <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                                                        <AnimatedIcon animation={checkmark} size={16} strokeColor="#1d4ed8" speed={0.65} loop />
                                                    </span>
                                                    <div className="text-sm font-semibold text-slate-700">{b}</div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-6">
                                            <a
                                                href="#portfolio-contact"
                                                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-2.5 text-xs font-extrabold uppercase tracking-widest text-white shadow-sm transition hover:bg-black"
                                            >
                                                Request project information
                                                <ArrowRightIcon className="h-4 w-4" />
                                            </a>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </Container>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
}
