import { useEffect, useMemo, useState } from 'react';

export default function PortfolioTestimonials() {
    const items = useMemo(
        () => [
            {
                quote:
                    '"Fortco didn\'t just build us a house; they built us a home. Every detail was carefully considered. The project manager visited us weekly and addressed all our concerns immediately."',
                by: 'Dr. Magoma, Mwanza',
            },
            {
                quote:
                    '"As a bank, we required strict timelines and premium quality. Fortco delivered our office tower 2 weeks early and under budget. We have since contracted them for 3 more projects."',
                by: 'Branch Manager, UBA Bank Mwanza',
            },
            {
                quote:
                    '"The teachers\' housing project has transformed our community. Our teachers no longer commute long distances. Fortco understood our social mission and delivered exceptional value."',
                by: 'District Education Officer, Mwanza',
            },
        ],
        []
    );

    const [activeIndex, setActiveIndex] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisible(false);

            setTimeout(() => {
                setActiveIndex((i) => (i + 1) % items.length);
                setVisible(true);
            }, 450);
        }, 5200);

        return () => clearInterval(interval);
    }, [items.length]);

    const getInitials = (value) => {
        const cleaned = String(value || '')
            .replace(/[^a-zA-Z0-9\s]/g, ' ')
            .split(' ')
            .map((x) => x.trim())
            .filter(Boolean);
        if (cleaned.length === 0) return '';
        if (cleaned.length === 1) return cleaned[0].slice(0, 2).toUpperCase();
        return (cleaned[0][0] + cleaned[1][0]).toUpperCase();
    };

    return (
        <section id="testimonials" className="rounded-3xl border border-slate-200 bg-slate-900 p-6 shadow-sm sm:p-8">
            <div className="text-xs font-extrabold uppercase tracking-wider text-white/70">Client testimonials</div>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">What partners say</h2>
            <p className="mt-4 text-sm font-medium leading-relaxed text-white/80">
                Long-term relationships are built on quality outcomes and consistent communication.
            </p>

            <div className="mt-8">
                <figure className="mx-auto max-w-3xl text-center">
                    <svg className="mx-auto mb-3 h-12 text-white/30" viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z"
                            fill="currentColor"
                        />
                    </svg>

                    <blockquote
                        className={`transition-all duration-500 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
                    >
                        <p className="text-xl font-semibold leading-relaxed text-white sm:text-2xl">{items[activeIndex].quote}</p>
                    </blockquote>

                    <figcaption
                        className={`mt-6 flex items-center justify-center gap-3 transition-all duration-500 ease-out ${
                            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                        }`}
                    >
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[11px] font-black tracking-widest text-white ring-1 ring-white/15">
                            {getInitials(items[activeIndex].by)}
                        </div>
                        <div className="flex items-center divide-x divide-white/20">
                            <div className="pr-3 text-sm font-semibold text-white">{items[activeIndex].by}</div>
                            <div className="pl-3 text-sm font-medium text-white/70">Testimonial</div>
                        </div>
                    </figcaption>
                </figure>
            </div>
        </section>
    );
}
