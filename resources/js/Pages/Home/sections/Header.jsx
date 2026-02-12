import { Link } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

export default function Header({ canLogin, canRegister }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        if (!mobileOpen) return;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') setMobileOpen(false);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [mobileOpen]);

    const navigation = [
        { name: 'Home', href: '/' },
        {
            name: 'About',
            href: '/about',
            children: [
                { name: 'Company Profile', href: '/about' },
                { name: 'Mission & Vision', href: '/about#mission-vision' },
                { name: 'Team', href: '/about#team' },
                { name: 'Partners', href: '/about#partners' },
            ],
        },
        {
            name: 'Services',
            href: '/services',
            children: [
                { name: 'Construction', href: '/services#construction' },
                { name: 'Interior Design', href: '/services#interior-design' },
                { name: 'Architectural Plans', href: '/services#architectural-plans' },
                { name: 'General Supply', href: '/services#general-supply' },
                { name: 'Consultation', href: '/services#consultation' },
            ],
        },
        {
            name: 'Properties',
            href: '/properties',
            children: [
                { name: 'Houses for Sale', href: '/properties#houses-for-sale' },
                { name: 'Apartments', href: '/properties#apartments' },
                { name: 'Plots/Land', href: '/properties#plots-land' },
                { name: 'Commercial', href: '/properties#commercial' },
                { name: 'Rentals', href: '/properties#rentals' },
            ],
        },
        {
            name: 'Portfolio',
            href: '/portfolio',
            children: [
                { name: 'Completed Projects', href: '/portfolio#completed-projects' },
                { name: 'Ongoing Projects', href: '/portfolio#ongoing-projects' },
                { name: 'Gallery', href: '/portfolio#gallery' },
                { name: 'Testimonials', href: '/portfolio#testimonials' },
            ],
        },
        {
            name: 'Contact',
            href: '/contact',
            children: [
                { name: 'Office Location', href: '/contact#office-location' },
                { name: 'Email', href: '/contact#email' },
                { name: 'Phone', href: '/contact#phone' },
                { name: 'Social Media', href: '/contact#social-media' },
            ],
        },
        {
            name: 'Blog',
            href: '/blog',
            children: [
                { name: 'News', href: '/blog#news' },
                { name: 'Articles', href: '/blog#articles' },
                { name: 'Tips', href: '/blog#tips' },
            ],
        },
        { name: 'FAQ', href: '/faq' },
        { name: 'Login', href: '/login' },
    ];

    return (
        <header className="sticky top-0 z-50">
            <nav className="bg-sand-200/90 border-b border-black/5 px-4 lg:px-6 py-3 backdrop-blur-md">
                <div className="flex flex-wrap items-center justify-between mx-auto max-w-screen-xl">
                    <Link href="/" className="flex items-center">
                        <img src="/logo.png" className="h-9 w-auto" alt="Fortco Logo" />
                    </Link>

                    <div className="flex items-center gap-3 lg:order-3">
                        <Link
                            href="/book"
                            className="hidden lg:inline-flex items-center justify-center rounded-lg bg-brand-green-500 px-4 py-2 text-xs font-extrabold tracking-wider text-white hover:bg-brand-green-600"
                        >
                            BOOK ONLINE
                        </Link>

                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            type="button"
                            className="inline-flex items-center rounded-lg p-2 text-sm text-black/60 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-black/10 lg:hidden"
                            aria-controls="mobile-menu-2"
                            aria-expanded={mobileOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {!mobileOpen ? (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                </svg>
                            )}
                        </button>
                    </div>

                    <div
                        className={`${mobileOpen ? 'block' : 'hidden'} w-full lg:order-2 lg:flex lg:w-auto lg:items-center lg:justify-center`}
                        id="mobile-menu-2"
                    >
                        <ul className="flex flex-col gap-1 mt-4 font-extrabold tracking-wider text-[11px] uppercase lg:flex-row lg:gap-7 lg:mt-0">
                            {navigation.map((item) => (
                                <li key={item.name} className={item.children ? 'relative lg:group' : undefined}>
                                    <a
                                        href={item.href}
                                        className="flex items-center rounded-lg px-3 py-2 text-black/70 hover:text-black hover:bg-black/5 lg:hover:bg-transparent lg:px-0"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        {item.name}
                                    </a>

                                    {item.children ? (
                                        <>
                                            <div className="hidden lg:block lg:invisible lg:absolute lg:left-0 lg:top-full lg:z-50 lg:mt-3 lg:w-64 lg:rounded-xl lg:border lg:border-black/10 lg:bg-white/90 lg:p-2 lg:opacity-0 lg:shadow-xl lg:backdrop-blur lg:transition lg:group-hover:visible lg:group-hover:opacity-100">
                                                {item.children.map((child) => (
                                                    <a
                                                        key={child.name}
                                                        href={child.href}
                                                        className="block rounded-lg px-3 py-2 text-[11px] font-extrabold tracking-wider uppercase text-black/70 hover:bg-black/5 hover:text-black"
                                                    >
                                                        {child.name}
                                                    </a>
                                                ))}
                                            </div>

                                            <div className="lg:hidden -mt-1 mb-2">
                                                <div className="grid gap-1 px-3">
                                                    {item.children.map((child) => (
                                                        <a
                                                            key={child.name}
                                                            href={child.href}
                                                            className="rounded-lg px-3 py-2 text-[11px] font-extrabold tracking-wider uppercase text-black/60 hover:bg-black/5 hover:text-black"
                                                            onClick={() => setMobileOpen(false)}
                                                        >
                                                            {child.name}
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    ) : null}
                                </li>
                            ))}
                            <li className="lg:hidden">
                                <Link
                                    href="/book"
                                    className="mt-1 inline-flex w-full items-center justify-center rounded-lg bg-brand-green-500 px-4 py-2 text-xs font-extrabold tracking-wider text-white hover:bg-brand-green-600"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    BOOK ONLINE
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}
