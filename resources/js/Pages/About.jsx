import { Head } from '@inertiajs/react';

import Header from './Home/sections/Header';
import Footer from './Home/sections/Footer';
import Container from './Home/components/Container';

import AnimatedIcon from '../Components/AnimatedIcon';
import activity from 'react-useanimations/lib/activity';
import lock from 'react-useanimations/lib/lock';
import settings from 'react-useanimations/lib/settings';

import {
    ArrowRightIcon,
    ShieldCheckIcon,
    SparklesIcon,
    UsersIcon,
} from '@heroicons/react/24/outline';

export default function About({ canLogin, canRegister }) {
    const values = [
        {
            title: 'Quality-first delivery',
            desc: 'We plan, build, and handover with clear checks at every stage—so projects stay consistent and predictable.',
            Icon: ShieldCheckIcon,
            animation: lock,
        },
        {
            title: 'Transparent communication',
            desc: 'Weekly updates, clear scope, and documented decisions that keep stakeholders aligned.',
            Icon: UsersIcon,
            animation: activity,
        },
        {
            title: 'Modern execution',
            desc: 'We combine experience with modern tools and structured processes to deliver on time.',
            Icon: SparklesIcon,
            animation: settings,
        },
    ];

    const milestones = [
        { year: '2016', title: 'Foundation', desc: 'Fortco established with a focus on reliable residential delivery.' },
        { year: '2019', title: 'Expansion', desc: 'Commercial and institutional projects added to the portfolio.' },
        { year: '2022', title: 'Quality systems', desc: 'Stronger safety and QA checklists rolled out across sites.' },
        { year: '2025', title: 'Premium delivery', desc: 'More signature developments and expanded partner network.' },
    ];

    const leadership = [
        { name: 'Project Director', role: 'Delivery & Quality', desc: 'Oversees execution standards and project governance.' },
        { name: 'Operations Lead', role: 'Procurement & Supply', desc: 'Ensures materials, logistics, and site readiness stay on track.' },
        { name: 'Client Success', role: 'Communication', desc: 'Keeps stakeholders informed with structured reporting.' },
        { name: 'Safety Officer', role: 'HSE', desc: 'Maintains site compliance and safety systems.' },
    ];

    return (
        <>
            <Head title="About" />
            <div className="min-h-screen bg-white text-slate-900">
                <Header canLogin={canLogin} canRegister={canRegister} />

                <main>
                    <section className="relative overflow-hidden bg-white">
                        <div className="absolute -right-40 -top-48 h-96 w-96 rounded-full bg-primary-200/60 blur-3xl" />
                        <div className="absolute -left-40 -bottom-56 h-96 w-96 rounded-full bg-slate-200/70 blur-3xl" />

                        <Container className="relative py-14 sm:py-20">
                            <div className="max-w-3xl">
                                <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                                    We build with clarity, quality, and accountability
                                </h1>
                                <p className="mt-5 text-sm font-medium leading-relaxed text-slate-600 sm:text-lg">
                                    Fortco Company Limited delivers residential, commercial, and institutional projects across Tanzania—supported by structured
                                    planning, safety systems, and transparent communication.
                                </p>

                                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <a
                                        href="#mission-vision"
                                        className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-extrabold tracking-wide text-white shadow-sm transition hover:bg-black"
                                    >
                                        Mission & vision
                                        <ArrowRightIcon className="ml-2 h-5 w-5" />
                                    </a>
                                    <a
                                        href="#contact-cta"
                                        className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-extrabold tracking-wide text-slate-900 shadow-sm transition hover:bg-slate-50"
                                    >
                                        Talk to us
                                    </a>
                                </div>
                            </div>
                        </Container>
                    </section>

                    <section id="company-profile" className="bg-white py-14">
                        <Container>
                            <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
                                <div className="max-w-xl">
                                    <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500">Company profile</div>
                                    <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Who we are</h2>
                                    <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600">
                                        We are a Tanzanian construction and real estate delivery company focused on building outcomes that last.
                                    </p>
                                    <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600">
                                        Our work is guided by structured planning, clear stakeholder communication, and quality checks throughout execution.
                                    </p>

                                    <div className="mt-7 grid gap-3 sm:grid-cols-3">
                                        {[
                                            { label: 'Planning', value: 'Structured' },
                                            { label: 'Quality', value: 'Checklist-led' },
                                            { label: 'Reporting', value: 'Consistent' },
                                        ].map((x) => (
                                            <div key={x.label} className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
                                                <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">{x.label}</div>
                                                <div className="mt-1 text-sm font-black text-slate-900">{x.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-end justify-between gap-4">
                                        <div>
                                            <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500">Our values</div>
                                            <div className="mt-2 text-sm font-semibold text-slate-600">What guides our delivery every day</div>
                                        </div>
                                    </div>

                                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                        {values.map((v) => (
                                            <div
                                                key={v.title}
                                                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <div className="text-base font-black text-slate-900">{v.title}</div>
                                                        <div className="mt-2 text-sm font-medium leading-relaxed text-slate-600">{v.desc}</div>
                                                    </div>
                                                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-50 to-white ring-1 ring-primary-100 shadow-sm">
                                                        <AnimatedIcon
                                                            animation={v.animation}
                                                            size={26}
                                                            strokeColor="#1d4ed8"
                                                            speed={0.65}
                                                            loop
                                                        />
                                                    </span>
                                                </div>
                                                <div className="mt-5 h-px w-full bg-slate-200" />
                                                <div className="mt-4 text-xs font-extrabold uppercase tracking-widest text-primary-700 transition group-hover:text-primary-800">
                                                    Learn more
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Container>
                    </section>

                    <section id="mission-vision" className="bg-slate-50 py-14">
                        <Container>
                            <div className="grid gap-6 lg:grid-cols-2">
                                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                                    <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500">Mission</div>
                                    <div className="mt-2 text-xl font-black tracking-tight text-slate-900">Build with clarity and quality</div>
                                    <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600">
                                        Deliver projects through structured planning, safe execution, and consistent quality checks—so clients get predictable outcomes.
                                    </p>
                                </div>
                                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                                    <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500">Vision</div>
                                    <div className="mt-2 text-xl font-black tracking-tight text-slate-900">Be a trusted delivery partner across the region</div>
                                    <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600">
                                        Grow a partner network and delivery capability that raises construction standards and expands access to quality development.
                                    </p>
                                </div>
                            </div>
                        </Container>
                    </section>

                    <section id="milestones" className="bg-white py-14">
                        <Container>
                            <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500">Milestones</div>
                            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Progress over time</h2>
                            <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-slate-600">
                                A systematic approach to growth—built around delivery, quality systems, and stronger partnerships.
                            </p>

                            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {milestones.map((m) => (
                                    <div key={m.year} className="rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-100">
                                        <div className="text-xs font-extrabold uppercase tracking-widest text-primary-700">{m.year}</div>
                                        <div className="mt-2 text-base font-black text-slate-900">{m.title}</div>
                                        <div className="mt-2 text-sm font-medium leading-relaxed text-slate-600">{m.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </Container>
                    </section>

                    <section id="team" className="bg-white py-14">
                        <Container>
                            <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
                                <div>
                                    <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500">Team</div>
                                    <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Leadership & delivery roles</h2>
                                    <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600">
                                        A clear structure that supports planning, execution, quality control, and communication.
                                    </p>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    {leadership.map((p) => (
                                        <div key={p.name} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                            <div className="text-sm font-black text-slate-900">{p.name}</div>
                                            <div className="mt-1 text-xs font-extrabold uppercase tracking-widest text-primary-700">{p.role}</div>
                                            <div className="mt-3 text-sm font-medium leading-relaxed text-slate-600">{p.desc}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Container>
                    </section>

                    <section id="contact-cta" className="bg-slate-900 py-14 text-white">
                        <Container>
                            <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
                                <div>
                                    <div className="text-xs font-extrabold uppercase tracking-widest text-white/70">Let’s talk</div>
                                    <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">Ready to start your next project?</h2>
                                    <p className="mt-4 text-sm font-medium leading-relaxed text-white/80">
                                        Tell us your scope and timeline—we’ll help structure a delivery plan and provide a clear next step.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                                    <a
                                        href="/#contact"
                                        className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-extrabold tracking-wide text-slate-900 shadow-sm transition hover:bg-white/90"
                                    >
                                        Contact us
                                        <ArrowRightIcon className="ml-2 h-5 w-5" />
                                    </a>
                                    <a
                                        href="/services"
                                        className="inline-flex items-center justify-center rounded-2xl bg-white/10 px-6 py-3 text-sm font-extrabold tracking-wide text-white shadow-sm ring-1 ring-white/15 transition hover:bg-white/15"
                                    >
                                        View services
                                    </a>
                                </div>
                            </div>
                        </Container>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
}
