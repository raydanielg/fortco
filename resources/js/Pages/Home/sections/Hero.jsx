import { Link } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import Container from '../components/Container';

export default function Hero() {
    const [slides, setSlides] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const timerRef = useRef(null);

    const sampleAvatars = useMemo(() => {
        const fromSlides = slides.slice(0, 4);
        if (fromSlides.length === 4) return fromSlides;
        return [];
    }, [slides]);

    const resolvedSlides = useMemo(() => {
        if (slides.length > 0) return slides;
        return [];
    }, [slides]);

    const [propertyWordIndex, setPropertyWordIndex] = useState(0);
    const [projectWordIndex, setProjectWordIndex] = useState(0);
    const [propertyVisible, setPropertyVisible] = useState(true);
    const [projectVisible, setProjectVisible] = useState(true);

    const propertyWords = useMemo(() => ['Properties', 'Houses', 'Apartments', 'Plots', 'Rentals'], []);
    const projectWords = useMemo(() => ['Projects', 'Construction', 'Designs', 'Plans', 'Sites'], []);

    useEffect(() => {
        const interval = setInterval(() => {
            setPropertyVisible(false);
            setProjectVisible(false);

            setTimeout(() => {
                setPropertyWordIndex((i) => (i + 1) % propertyWords.length);
                setProjectWordIndex((i) => (i + 1) % projectWords.length);
                setPropertyVisible(true);
                setProjectVisible(true);
            }, 450);
        }, 3000);

        return () => clearInterval(interval);
    }, [propertyWords.length, projectWords.length]);

    useEffect(() => {
        let canceled = false;

        fetch('/api/hero-slides')
            .then((r) => r.json())
            .then((data) => {
                if (canceled) return;
                if (Array.isArray(data)) setSlides(data);
            })
            .catch(() => {
                if (canceled) return;
                setSlides([]);
            });

        return () => {
            canceled = true;
        };
    }, []);

    useEffect(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        if (resolvedSlides.length < 2) return;

        timerRef.current = setInterval(() => {
            setActiveIndex((i) => (i + 1) % resolvedSlides.length);
        }, 6000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [resolvedSlides.length]);

    return (
        <section className="relative overflow-hidden bg-sand-50 pt-16 pb-20 sm:pt-24 sm:pb-32">
            <div className="absolute inset-0 z-0">
                {resolvedSlides.length > 0 ? (
                    <>
                        {resolvedSlides.map((src, idx) => (
                            <div
                                key={src}
                                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                                    idx === activeIndex ? 'opacity-100' : 'opacity-0'
                                }`}
                                style={{ backgroundImage: `url(${src})` }}
                                aria-hidden="true"
                            />
                        ))}

                        <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
                        <div
                            className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70"
                            aria-hidden="true"
                        />
                    </>
                ) : (
                    <div
                        className="absolute inset-0 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.sand.200),theme(colors.sand.50))]"
                        aria-hidden="true"
                    />
                )}
            </div>

            <Container className="relative z-10">
                <div className="max-w-3xl">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-extrabold tracking-wide text-white backdrop-blur">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-green-400/80" />
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-green-500" />
                            </span>
                            Built for Tanzania Real Estate & Construction
                        </div>
                        <h1 className="mt-8 text-4xl font-black tracking-tight text-white sm:text-6xl lg:leading-[1.1]">
                            Manage your{' '}
                            <span
                                className={`inline-block text-primary-300 drop-shadow-[0_2px_10px_rgba(147,197,253,0.35)] transition-all duration-500 ease-out ${
                                    propertyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                                }`}
                            >
                                {propertyWords[propertyWordIndex]}
                            </span>{' '}
                            and{' '}
                            <span
                                className={`inline-block text-red-300 drop-shadow-[0_2px_10px_rgba(252,165,165,0.35)] transition-all duration-500 ease-out ${
                                    projectVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                                }`}
                            >
                                {projectWords[projectWordIndex]}
                            </span>{' '}
                            with ease.
                        </h1>
                        <p className="mt-6 text-lg leading-relaxed text-white/85 max-w-xl font-medium">
                            Fortco Company Limited provides a unified platform for property management, construction tracking, and loan processing. Designed for modern teams in Tanzania.
                        </p>
                        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                            <Link
                                href={route('register')}
                                className="inline-flex justify-center items-center rounded-full bg-brand-green-500 px-8 py-4 text-base font-black tracking-wide text-white shadow-xl shadow-black/30 transition-all hover:bg-brand-green-600 hover:shadow-2xl hover:-translate-y-0.5 active:scale-95"
                            >
                                Get Started Now
                                <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            </Link>
                            <a
                                href="#features"
                                className="inline-flex justify-center items-center rounded-full border-2 border-white/20 bg-white/10 px-8 py-4 text-base font-black tracking-wide text-white backdrop-blur transition-all hover:bg-white/15 hover:border-white/30"
                            >
                                Explore Features
                            </a>
                        </div>
                        <div className="mt-10 flex items-center gap-4">
                            {sampleAvatars.length > 0 ? (
                                <div className="flex -space-x-3">
                                    {sampleAvatars.map((src, i) => (
                                        <img
                                            key={`${src}-${i}`}
                                            src={src}
                                            alt=""
                                            className="h-10 w-10 rounded-full border-2 border-white/40 object-cover"
                                            loading="lazy"
                                        />
                                    ))}
                                </div>
                            ) : null}
                            <div className="text-sm font-extrabold tracking-wide text-white/85">
                                Trusted by <span className="text-white">50+ Teams</span> across Tanzania
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
