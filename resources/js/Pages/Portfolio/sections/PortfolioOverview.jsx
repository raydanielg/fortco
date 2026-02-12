import { motion } from 'framer-motion';

export default function PortfolioOverview() {
    return (
        <section id="portfolio-overview" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Portfolio overview</div>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">A record of delivery since 2012</h2>
            <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600">
                Welcome to Fortco Company Limited&apos;s official project portfolio. Since 2012, we have successfully delivered
                over 500 residential and commercial properties across Tanzania. Each project represents our commitment to
                quality, innovation, and customer satisfaction. From luxury homes to commercial complexes, we turn dreams into reality.
            </p>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-50 via-white to-sand-50 p-6 ring-1 ring-black/5"
                >
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(30rem_25rem_at_top,theme(colors.primary.100),transparent)]" />
                    <div className="relative">
                    <div className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">Mission</div>
                    <h3 className="mt-2 text-lg font-black tracking-tight text-slate-900">Build with integrity. Deliver with excellence.</h3>
                    <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">
                        To deliver high-quality construction and real estate solutions that are safe, reliable, and built to last—while maintaining transparent communication, disciplined project management, and client-first service.
                    </p>
                    <ul className="mt-5 grid gap-2">
                        {[
                            'Quality workmanship and verified materials',
                            'On-time and on-budget delivery',
                            'Safety-first execution and compliance',
                            'Clear reporting and strong after-sales support',
                        ].map((x) => (
                            <li key={x} className="text-sm font-semibold text-slate-700">
                                {x}
                            </li>
                        ))}
                    </ul>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.45, ease: 'easeOut', delay: 0.05 }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-primary-950 p-6 text-white shadow-sm ring-1 ring-black/10"
                >
                    <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(35rem_30rem_at_top,theme(colors.primary.600),transparent)]" />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent" />
                    <div className="relative">
                    <div className="text-[11px] font-extrabold uppercase tracking-widest text-white/70">Vision</div>
                    <h3 className="mt-2 text-lg font-black tracking-tight text-white">A trusted builder shaping Tanzania’s future.</h3>
                    <p className="mt-3 text-sm font-medium leading-relaxed text-white/85">
                        To be one of Tanzania’s most trusted construction and real estate brands—recognized for modern design, consistent quality, community impact, and projects that create long-term value for families, businesses, and institutions.
                    </p>
                    <div className="mt-5 grid gap-2">
                        {[
                            { title: 'Innovation', desc: 'Modern methods, smart planning, better outcomes.' },
                            { title: 'Sustainability', desc: 'Responsible materials and efficient resource use.' },
                            { title: 'Impact', desc: 'Projects that strengthen communities and opportunity.' },
                        ].map((x) => (
                            <div key={x.title} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur">
                                <div className="text-xs font-extrabold uppercase tracking-widest text-white/70">{x.title}</div>
                                <div className="mt-1 text-sm font-semibold text-white/90">{x.desc}</div>
                            </div>
                        ))}
                    </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
