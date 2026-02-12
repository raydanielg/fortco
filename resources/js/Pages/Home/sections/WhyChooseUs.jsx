import Container from '../components/Container';
import SectionTitle from '../components/SectionTitle';
import AnimatedIcon from '../../../Components/AnimatedIcon';
import lock from 'react-useanimations/lib/lock';
import activity from 'react-useanimations/lib/activity';
import settings from 'react-useanimations/lib/settings';
import explore from 'react-useanimations/lib/explore';
import { useEffect, useMemo, useState } from 'react';

export default function WhyChooseUs() {
    const [wordIndex, setWordIndex] = useState(0);
    const [wordVisible, setWordVisible] = useState(true);

    const accentWords = useMemo(
        () => ['Speed', 'Innovation', 'Quality', 'Excellence', 'Results'],
        [],
    );

    const accentColorClass = useMemo(() => {
        return wordIndex % 2 === 0
            ? 'text-primary-700 drop-shadow-[0_2px_10px_rgba(29,78,216,0.18)]'
            : 'text-red-700 drop-shadow-[0_2px_10px_rgba(185,28,28,0.18)]';
    }, [wordIndex]);

    useEffect(() => {
        const interval = setInterval(() => {
            setWordVisible(false);
            setTimeout(() => {
                setWordIndex((i) => (i + 1) % accentWords.length);
                setWordVisible(true);
            }, 450);
        }, 3000);

        return () => clearInterval(interval);
    }, [accentWords.length]);

    const points = [
        {
            title: 'Secure Access Control',
            desc: 'Roles, permissions and audit-ready accountability for teams of any size.',
            animation: lock,
        },
        {
            title: 'Fast Daily Workflows',
            desc: 'A smooth UI designed for the tasks your staff does every day.',
            animation: activity,
        },
        {
            title: 'Scalable Modules',
            desc: 'Start with what you need and expand services as your business grows.',
            animation: settings,
        },
        {
            title: 'Built for Local Operations',
            desc: 'Designed to match Tanzania workflows and operational needs.',
            animation: explore,
        },
    ];

    const marqueeImages = [
        '/slides/close-up-hard-hat-holding-by-construction-worker_329181-2825.jpg',
        '/slides/construction-silhouette_1127-2991.jpg',
        '/slides/construction-silhouette_1127-3246.jpg',
        '/slides/construction-silhouette_1150-8336.jpg',
        '/slides/construction-site-silhouettes_1127-3253.jpg',
        '/slides/construction-works-frankfurt-downtown-germany_1268-20907.jpg',
        '/slides/excavator-action_1112-1598.jpg',
        '/slides/heavy-machines-construction-workers-working-building_181624-8234.jpg',
    ];

    return (
        <section id="why" className="bg-white dark:bg-gray-900 py-24 overflow-hidden">
            <Container>
                <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
                    <div className="relative">
                        <SectionTitle
                            eyebrow="Why choose us"
                            title="A modern platform for modern teams"
                            description="Built to help teams move faster with clear workflows and strong accountability."
                        />

                        <div className="mt-12 space-y-8">
                            {points.map((p) => (
                                <div key={p.title} className="flex gap-6">
                                    <div className="flex-none flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100">
                                        <AnimatedIcon
                                            animation={p.animation}
                                            size={26}
                                            strokeColor="#2563eb"
                                            autoplay
                                            loop
                                            speed={0.9}
                                        />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-slate-900 mb-1">{p.title}</h4>
                                        <p className="text-slate-600 font-medium leading-relaxed">{p.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative z-10 rounded-[3rem] border border-black/5 bg-sand-50/70 p-8 shadow-sm backdrop-blur sm:p-12">
                            <div className="absolute top-0 right-0 p-8">
                                <div className="text-6xl opacity-10 font-black italic select-none">FORTCO</div>
                            </div>

                            <div className="space-y-6">
                                <div className="inline-flex rounded-2xl bg-primary-600 px-4 py-2 text-sm font-black text-white shadow-lg">
                                    Why We Win
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 leading-tight">
                                    Designed for{' '}
                                    <span
                                        className={`inline-block ${accentColorClass} transition-all duration-500 ease-out ${
                                            wordVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                                        }`}
                                    >
                                        {accentWords[wordIndex]}
                                    </span>{' '}
                                    and built for reliability.
                                </h3>
                                <p className="text-lg text-slate-600 font-medium">
                                    A clean user experience, consistent workflows and reporting you can trust.
                                </p>

                                <div className="pt-6 grid grid-cols-2 gap-4">
                                    {[
                                        {
                                            img: '/construction-site-architecture-black-woman-with-smartphone-typing-connection-african-person-engineering-inspector-with-cellphone-safety-online-reading-with-digital-app-internet_590464-510750.jpg',
                                            title: 'On-site Execution',
                                            desc: 'Real time updates and field reporting.'
                                        },
                                        {
                                            img: '/october-2018-building-construction-skyscrapers-dubai_231208-7619.jpg',
                                            title: 'Project Visibility',
                                            desc: 'Dashboards that keep teams aligned.'
                                        }
                                    ].map((item, idx) => (
                                        <div key={idx} className="group relative overflow-hidden rounded-3xl bg-white/80 shadow-sm border border-black/5 h-40 cursor-pointer">
                                            <img
                                                src={item.img}
                                                alt=""
                                                className="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:-translate-y-2"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                                            
                                            <div className="absolute inset-0 p-4 flex flex-col justify-end translate-y-4 transition-transform duration-500 ease-out group-hover:translate-y-0">
                                                <p className="text-sm font-black tracking-wide text-white drop-shadow-md">{item.title}</p>
                                                <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500">
                                                    <p className="mt-1 text-[10px] font-bold text-white/90 leading-tight opacity-0 transition-all duration-500 delay-100 group-hover:opacity-100">
                                                        {item.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-5 fortco-marquee">
                                    <div className="fortco-marquee-track gap-3">
                                        {[...marqueeImages, ...marqueeImages].map((src, i) => (
                                            <div
                                                key={`${src}-${i}`}
                                                className="relative h-16 w-24 overflow-hidden rounded-2xl border border-black/5 bg-white/70 shadow-sm"
                                            >
                                                <img
                                                    src={src}
                                                    alt=""
                                                    className="h-full w-full object-cover"
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[120%] w-[120%] bg-primary-100/20 rounded-full blur-3xl" />
                    </div>
                </div>
            </Container>
        </section>
    );
}
