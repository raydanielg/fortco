import Container from '../components/Container';
import { useEffect, useMemo, useState } from 'react';

export default function Testimonials() {
    const items = useMemo(
        () => [
            {
                name: 'Operations Manager',
                role: 'Real Estate Team',
                quote: 'The dashboard and permissions made it easy to control access and speed up decisions.',
                avatar: '/slides/young-black-race-man-with-blueprint-stading-near-glass-building_1157-50906.jpg'
            },
            {
                name: 'Construction Lead',
                role: 'Site Management',
                quote: 'Tracking materials, workers and expenses is now structured and clear for the entire team.',
                avatar: '/slides/construction-site-silhouettes_1127-3253.jpg'
            },
            {
                name: 'Sales Agent',
                role: 'Customer Success',
                quote: 'Leads and bookings flow is simple. I can focus on clients instead of spreadsheets.',
                avatar: '/slides/building-new-concrete-houses_1398-3932.jpg'
            }
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
        }, 4200);

        return () => clearInterval(interval);
    }, [items.length]);

    return (
        <section id="testimonials" className="bg-white dark:bg-gray-900">
            <Container className="py-16 text-center sm:py-20">
                <figure className="mx-auto max-w-screen-md">
                    <svg
                        className="mx-auto mb-3 h-12 text-gray-400 dark:text-gray-600"
                        viewBox="0 0 24 27"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z"
                            fill="currentColor"
                        />
                    </svg>

                    <blockquote
                        className={`transition-all duration-500 ease-out ${
                            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                        }`}
                    >
                        <p className="text-2xl font-medium text-gray-900 dark:text-white">“{items[activeIndex].quote}”</p>
                    </blockquote>

                    <figcaption
                        className={`mt-6 flex items-center justify-center space-x-3 transition-all duration-500 ease-out ${
                            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                        }`}
                    >
                        <img className="h-6 w-6 rounded-full object-cover" src={items[activeIndex].avatar} alt="" loading="lazy" />
                        <div className="flex items-center divide-x-2 divide-gray-500 dark:divide-gray-700">
                            <div className="pr-3 font-medium text-gray-900 dark:text-white">{items[activeIndex].name}</div>
                            <div className="pl-3 text-sm font-light text-gray-500 dark:text-gray-400">{items[activeIndex].role}</div>
                        </div>
                    </figcaption>
                </figure>
            </Container>
        </section>
    );
}
