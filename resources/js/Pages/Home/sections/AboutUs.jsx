import Container from '../components/Container';
import SectionTitle from '../components/SectionTitle';
import { motion } from 'framer-motion';
import { LightBulbIcon, ShieldCheckIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useEffect, useMemo, useState } from 'react';

export default function AboutUs() {
    const highlights = useMemo(
        () => [
            {
                stat: '100% ',
                statAccent: 'Digital',
                title: 'Digital Transformation',
                desc: 'Replace spreadsheets with one connected ERP built for real estate & construction.'
            },
            {
                stat: 'Real-time ',
                statAccent: 'Tracking',
                title: 'Project Visibility',
                desc: 'Monitor sites, tasks, and costs from one place — with full accountability.'
            },
            {
                stat: 'Smart ',
                statAccent: 'Operations',
                title: 'Team Efficiency',
                desc: 'Streamline approvals, communication, and reporting across departments.'
            }
        ],
        []
    );

    const [highlightIndex, setHighlightIndex] = useState(0);
    const [highlightVisible, setHighlightVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setHighlightVisible(false);

            setTimeout(() => {
                setHighlightIndex((i) => (i + 1) % highlights.length);
                setHighlightVisible(true);
            }, 450);
        }, 3200);

        return () => clearInterval(interval);
    }, [highlights.length]);

    const values = [
        {
            title: 'Transparency',
            desc: 'We believe in clear communication and honest operations across all modules.',
            Icon: ShieldCheckIcon
        },
        {
            title: 'Innovation',
            desc: 'Using modern technology to solve traditional real estate and construction challenges.',
            Icon: LightBulbIcon
        },
        {
            title: 'Reliability',
            desc: 'A system built to be secure, fast, and always available for your team.',
            Icon: SparklesIcon
        }
    ];

    return (
        <section id="about" className="py-20 bg-white dark:bg-gray-900 overflow-hidden">
            <Container>
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <div className="aspect-square rounded-3xl bg-slate-100 dark:bg-gray-800 overflow-hidden relative shadow-xl">
                            <img
                                src="/slides/close-up-hard-hat-holding-by-construction-worker_329181-2825.jpg"
                                alt="About Fortco"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/75 via-black/25 to-transparent">
                                <div
                                    className={`transition-all duration-500 ease-out ${
                                        highlightVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                                    }`}
                                >
                                    <p className="text-white font-black text-3xl sm:text-4xl leading-none">
                                        {highlights[highlightIndex].stat}
                                        <span className="text-primary-300">{highlights[highlightIndex].statAccent}</span>
                                    </p>
                                    <p className="mt-3 text-white font-extrabold text-lg">{highlights[highlightIndex].title}</p>
                                    <p className="mt-1 text-white/80 font-medium text-sm leading-relaxed max-w-sm">
                                        {highlights[highlightIndex].desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Stats overlap */}
                        <div className="absolute -right-8 top-1/4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-gray-700 hidden sm:block">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Experience</p>
                            <p className="text-3xl font-black text-slate-900 dark:text-white">Modern</p>
                        </div>
                    </div>

                    <div>
                        <SectionTitle
                            eyebrow="Who we are"
                            title="Transforming the Real Estate & Construction Industry"
                            description="Fortco Company Limited was built from the ground up to address the unique operational challenges faced by developers, contractors, and loan officers in Tanzania."
                        />

                        <div className="mt-10 space-y-8">
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                Our mission is to provide a unified digital ecosystem that empowers teams to manage properties, track complex construction projects, and process loans with zero friction and maximum accountability.
                            </p>

                            <div className="grid gap-6">
                                {values.map((v, idx) => (
                                    <div key={v.title} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors group border border-transparent hover:border-slate-100 dark:hover:border-gray-700">
                                        <motion.div
                                            animate={{ y: [0, -4, 0] }}
                                            transition={{ duration: 2.6, ease: 'easeInOut', repeat: Infinity, delay: idx * 0.12 }}
                                            whileHover={{ rotate: 8, scale: 1.08, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex-none"
                                        >
                                            <div className="h-12 w-12 rounded-2xl bg-primary-50 text-primary-700 ring-1 ring-primary-100 flex items-center justify-center transition-shadow group-hover:shadow-lg group-hover:shadow-primary-500/10 dark:bg-gray-800 dark:text-primary-400 dark:ring-gray-700">
                                                <v.Icon className="h-6 w-6" />
                                            </div>
                                        </motion.div>
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">{v.title}</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">{v.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
