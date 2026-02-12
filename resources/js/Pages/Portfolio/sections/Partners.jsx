export default function Partners() {
    const partners = [
        { name: 'Partner 01', note: '', logoSrc: '/partners/0mBzG1PvTsagXdkBmRpa22it41vf1A13K9UCYeHH.jpg' },
        { name: 'Partner 02', note: '', logoSrc: '/partners/5DK1suU4Xy95T1BhJNRmrYauUSxK3XuHBjglxARr.jpg' },
        { name: 'Partner 03', note: '', logoSrc: '/partners/5ttelJVcCVEmJwiQu2EHw4p3PCO7BXn527S69pPJ.jpg' },
        { name: 'Partner 04', note: '', logoSrc: '/partners/9bDJal7GXCzSLz94lips5tKlQk54hcGr7E7ryOan.jpg' },
        { name: 'Partner 05', note: '', logoSrc: '/partners/9eMERfYikcxRZzRMW1u5WKrtbqmvBt6bA4Z5ZKIJ.jpg' },
        { name: 'Partner 06', note: '', logoSrc: '/partners/BNQwQA3xCeYi0p1WTAEEoAeczYBLGChpZe1IVI0P.jpg' },
        { name: 'Partner 07', note: '', logoSrc: '/partners/lbDeoe902ixKnAOjMRBJ5gOCMKE3yLgjinq5JuXa.jpg' },
        { name: 'Partner 08', note: '', logoSrc: '/partners/lyWjJvq56zaEP6ApNHveQARh8t8wMYdyjbQPf1VX.jpg' },
        { name: 'Partner 09', note: '', logoSrc: '/partners/uzothr2kzZkDBH3gTucaA9Q1Op7ObpWUweYiCBXj.jpg' },
        { name: 'Partner 10', note: '', logoSrc: '/partners/v8wrPYCM3gEXy7V6W8EcDQKAilKuYDu6TjKSge2q.jpg' },
        { name: 'Partner 11', note: '', logoSrc: '/partners/vlpIc1ZBtUvA1MIEtmWZ34dBNE4B3ZZnjvG0YWoA.jpg' },
        { name: 'Partner 12', note: '', logoSrc: '/partners/Yi3KW4uy7UPJdkImNzJqc9wWXYZmIRKq7bitRYA1.png' },
    ];

    const getInitials = (name) => {
        const parts = String(name)
            .replace(/[^a-zA-Z0-9\s]/g, ' ')
            .split(' ')
            .map((x) => x.trim())
            .filter(Boolean);

        if (parts.length === 0) return '';
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[1][0]).toUpperCase();
    };

    const LogoCard = ({ partner, className = '' }) => (
        <div
            className={
                'flex h-20 w-full items-center justify-center rounded-2xl bg-white px-5 shadow-sm ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10 ' +
                className
            }
            title={partner.name}
        >
            {partner.logoSrc ? (
                <img
                    src={partner.logoSrc}
                    alt={partner.name}
                    className="h-11 w-full object-contain opacity-95"
                    loading="lazy"
                />
            ) : (
                <div className="text-xs font-black tracking-widest text-slate-700 dark:text-white">{getInitials(partner.name)}</div>
            )}
        </div>
    );

    const sliderItems = [...partners, ...partners];

    return (
        <section id="partners" className="w-full bg-slate-100/80 py-12 dark:bg-gray-900">
            <div className="grid w-full items-center gap-10 px-5 sm:px-10 lg:grid-cols-2 lg:gap-16 lg:px-16">
                <div className="max-w-xl">
                    <div className="flex items-center gap-2">
                        <div className="h-0.5 w-8 rounded-full bg-red-500" />
                        <div className="h-0.5 w-14 rounded-full bg-red-500" />
                        <div className="h-0.5 w-10 rounded-full bg-red-500" />
                    </div>
                    <h2 className="mt-3 text-3xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                        Our members
                    </h2>
                    <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
                        Together we build stronger trade bridges between Tanzania, the UAE and the wider GCC region.
                    </p>
                    <div className="mt-6">
                        <a
                            href="#portfolio-contact"
                            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-xs font-extrabold uppercase tracking-widest text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400/30 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                        >
                            Learn more
                        </a>
                    </div>
                </div>

                <div className="w-full max-w-3xl">
                    <div className="relative overflow-hidden">
                        <div className="partners-marquee flex w-max items-center gap-4 py-1">
                            {sliderItems.map((p, idx) => (
                                <div key={(p.logoSrc || p.name) + '-' + idx} className="w-56 shrink-0">
                                    <LogoCard partner={p} />
                                </div>
                            ))}
                        </div>

                        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-slate-100/80 to-transparent dark:from-gray-900" />
                        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-slate-100/80 to-transparent dark:from-gray-900" />
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes partnersMarquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .partners-marquee {
                    animation: partnersMarquee 34s linear infinite;
                    will-change: transform;
                }
                @media (prefers-reduced-motion: reduce) {
                    .partners-marquee { animation: none; }
                }
            `}</style>
        </section>
    );
}
