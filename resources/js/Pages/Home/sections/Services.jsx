import Container from '../components/Container';
import SectionTitle from '../components/SectionTitle';
import AnimatedIcon from '../../../Components/AnimatedIcon';
import home from 'react-useanimations/lib/home';
import settings from 'react-useanimations/lib/settings';
import activity from 'react-useanimations/lib/activity';
import calendar from 'react-useanimations/lib/calendar';

export default function Services() {
    const services = [
        {
            title: 'Real Estate Services',
            desc: 'Manage listings, approvals, enquiries and client follow ups from one place.',
            animation: home,
        },
        {
            title: 'Construction Services',
            desc: 'Track projects, phases, materials, workers, expenses and progress reports with clarity.',
            animation: settings,
        },
        {
            title: 'Loan Management',
            desc: 'Receive applications, review, approve and follow repayments in a structured workflow.',
            animation: activity,
        },
        {
            title: 'Appointments',
            desc: 'Schedule visits, confirm bookings and manage service calendars for better conversion.',
            animation: calendar,
        },
    ];

    return (
        <section id="services" className="bg-sand-50 py-20">
            <Container>
                <div className="text-center mb-16">
                    <SectionTitle
                        align="center"
                        eyebrow="Services"
                        title="Services built for growth"
                        description="Simple tools for teams that sell, build and deliver."
                    />
                </div>

                <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {services.map((s) => (
                        <div
                            key={s.title}
                            className="group rounded-3xl border border-black/5 bg-white/70 p-6 shadow-sm backdrop-blur transition hover:bg-white hover:shadow-xl"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100">
                                    <AnimatedIcon
                                        animation={s.animation}
                                        size={26}
                                        strokeColor="#2563eb"
                                        autoplay
                                        loop
                                        speed={0.9}
                                    />
                                </div>
                                <span className="rounded-full border border-black/10 bg-white/80 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-black/60">
                                    Service
                                </span>
                            </div>

                            <h3 className="mt-5 text-lg font-extrabold tracking-tight text-slate-900">
                                {s.title}
                            </h3>
                            <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">{s.desc}</p>

                            <a
                                href="/services"
                                className="mt-6 inline-flex items-center text-xs font-extrabold uppercase tracking-widest text-primary-700 hover:text-primary-800"
                            >
                                Learn more
                                <span className="ml-2 transition-transform group-hover:translate-x-0.5">→</span>
                            </a>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
