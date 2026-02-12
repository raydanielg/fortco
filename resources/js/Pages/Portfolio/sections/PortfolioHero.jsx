import Container from '../../Home/components/Container';
import AnimatedIcon from '../../../Components/AnimatedIcon';
import explore from 'react-useanimations/lib/explore';
import activity from 'react-useanimations/lib/activity';
import { CalendarDaysIcon, GlobeAltIcon, SparklesIcon, TrophyIcon } from '@heroicons/react/24/outline';

export default function PortfolioHero() {
    return (
        <section className="relative overflow-hidden bg-sand-50 pt-16 pb-14 sm:pt-20">
            <div className="absolute inset-0" aria-hidden="true">
                <div className="absolute inset-0 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.sand.200),theme(colors.sand.50))]" />
            </div>

            <Container className="relative">
                <div className="mx-auto max-w-3xl text-center">
                    <div className="inline-flex items-center rounded-full border border-black/10 bg-white/60 px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-black/70 backdrop-blur">
                        Our Portfolio
                    </div>

                    <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 sm:text-6xl">
                        Celebrating 12+ Years of Excellence in Construction & Real Estate
                    </h1>

                    <p className="mt-6 text-base font-medium leading-relaxed text-slate-600">
                        Since 2012, Fortco Company Limited has delivered residential and commercial projects across Tanzania.
                        Each project reflects quality, innovation, and long-term value.
                    </p>

                    <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <a
                            href="#completed-projects"
                            className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-black px-7 py-3 text-sm font-extrabold tracking-wide text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-900 hover:shadow-md"
                        >
                            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10">
                                <AnimatedIcon
                                    animation={explore}
                                    size={22}
                                    strokeColor="#ffffff"
                                    autoplay
                                    loop
                                    speed={0.9}
                                />
                            </span>
                            <span>View Featured Projects</span>
                            <span className="text-white/70 transition-transform group-hover:translate-x-0.5">→</span>
                        </a>
                        <a
                            href="#portfolio-contact"
                            className="group inline-flex items-center justify-center gap-3 rounded-2xl border border-black/10 bg-white/70 px-7 py-3 text-sm font-extrabold tracking-wide text-slate-900 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                        >
                            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-black/5">
                                <AnimatedIcon
                                    animation={activity}
                                    size={22}
                                    strokeColor="#0f172a"
                                    autoplay
                                    loop
                                    speed={0.9}
                                />
                            </span>
                            <span>Request Information</span>
                            <span className="text-slate-500 transition-transform group-hover:translate-x-0.5">→</span>
                        </a>
                    </div>
                </div>
            </Container>
        </section>
    );
}
