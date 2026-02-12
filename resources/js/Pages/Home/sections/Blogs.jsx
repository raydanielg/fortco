import Container from '../components/Container';
import SectionTitle from '../components/SectionTitle';
import { ArrowUpRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

export default function Blogs() {
    const posts = [
        {
            title: 'How to streamline property approvals',
            date: 'Feb 2026',
            readTime: '6 min read',
            tag: 'Article',
            excerpt: 'A simple checklist to cut delays and keep approvals moving between teams and stakeholders.',
            image: '/slides/beautiful-view-construction-site-city-building_653669-11417.jpg',
            author: {
                name: 'Fortco Team',
                avatar: '/slides/young-black-race-man-with-blueprint-stading-near-glass-building_1157-50906.jpg'
            }
        },
        {
            title: 'Construction expenses tracking made simple',
            date: 'Feb 2026',
            readTime: '8 min read',
            tag: 'Article',
            excerpt: 'Track site spend in real-time, reduce leakage, and keep every cost accountable from day one.',
            image: '/slides/construction-site-silhouettes_1127-3253.jpg',
            author: {
                name: 'Project Desk',
                avatar: '/slides/building-new-concrete-houses_1398-3932.jpg'
            }
        },
        {
            title: 'Loan application workflow checklist',
            date: 'Feb 2026',
            readTime: '5 min read',
            tag: 'Article',
            excerpt: 'From document capture to approvals, here’s a workflow your loan team can run consistently.',
            image: '/slides/beautiful-view-construction-site-city-sunset_181624-9347.jpg',
            author: {
                name: 'Operations',
                avatar: '/slides/beautiful-view-construction-site-city-building_653669-11417.jpg'
            }
        },
        {
            title: 'Weekly reporting that stakeholders actually read',
            date: 'Feb 2026',
            readTime: '7 min read',
            tag: 'Article',
            excerpt: 'A simple reporting format for progress, risks, and spend — without long meetings.',
            image: '/slides/young-black-race-man-with-blueprint-stading-near-glass-building_1157-50906.jpg',
            author: {
                name: 'Insights',
                avatar: '/slides/construction-site-silhouettes_1127-3253.jpg'
            }
        }
    ];

    return (
        <section id="blogs" className="bg-slate-50 py-16 sm:py-20">
            <Container>
                <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
                    <SectionTitle
                        eyebrow="Blogs"
                        title="Updates and guides"
                        description="Short reads to help your team work better."
                    />
                    <a
                        href="/blog"
                        className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition-all hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-md"
                    >
                        View all
                        <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                </div>

                <div className="relative mt-10">
                    <button
                        type="button"
                        className="blog-prev absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 p-2 text-slate-700 shadow-sm backdrop-blur transition hover:bg-white hover:shadow-md md:flex"
                        aria-label="Previous"
                    >
                        <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        className="blog-next absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 p-2 text-slate-700 shadow-sm backdrop-blur transition hover:bg-white hover:shadow-md md:flex"
                        aria-label="Next"
                    >
                        <ChevronRightIcon className="h-5 w-5" />
                    </button>

                    <Swiper
                        modules={[Autoplay, Navigation]}
                        navigation={{ prevEl: '.blog-prev', nextEl: '.blog-next' }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        speed={700}
                        spaceBetween={24}
                        slidesPerView={1}
                        className="[&_.swiper-wrapper]:items-stretch"
                        breakpoints={{
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 }
                        }}
                    >
                        {posts.map((p) => (
                            <SwiperSlide key={p.title} className="h-auto">
                                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                                    <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                                        <img
                                            src={p.image}
                                            alt=""
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    </div>

                                    <div className="flex flex-1 flex-col p-6">
                                        <div className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                                            {p.tag}
                                        </div>

                                        <h3 className="mt-4 text-lg font-black tracking-tight text-slate-900">{p.title}</h3>
                                        <p className="mt-3 flex-1 text-sm font-medium leading-relaxed text-slate-600">{p.excerpt}</p>

                                        <div className="mt-6 flex items-center gap-3">
                                            <img
                                                src={p.author.avatar}
                                                alt=""
                                                className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
                                                loading="lazy"
                                            />
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-bold text-slate-900">{p.author.name}</p>
                                                <p className="text-xs font-semibold text-slate-500">
                                                    {p.date} · {p.readTime}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </Container>
        </section>
    );
}
