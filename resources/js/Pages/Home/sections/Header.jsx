import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

export default function Header({ canLogin, canRegister }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [frontLogo, setFrontLogo] = useState('');
    const [frontMenus, setFrontMenus] = useState([]);
    const page = usePage();
    const i18n = page.props.i18n || {};
    const locale = i18n.locale || 'en';
    const available = Array.isArray(i18n.available_languages) ? i18n.available_languages : ['en', 'sw'];
    const translations = i18n.translations || {};

    const t = (key, fallback) => {
        const v = translations?.[key];
        if (typeof v === 'string' && v.trim()) return v;
        return fallback ?? key;
    };

    useEffect(() => {
        if (!mobileOpen) return;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') setMobileOpen(false);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [mobileOpen]);

    useEffect(() => {
        let canceled = false;
        fetch('/api/front-settings/header')
            .then((r) => r)
            .then((r) => r)
            .catch(() => {})
        return () => {
            canceled = true;
        };
    }, []);

    useEffect(() => {
        let canceled = false;
        fetch('/api/front-settings/header', { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } })
            .then((r) => r.json())
            .then((data) => {
                if (canceled) return;
                const s = data?.settings || {};
                if (typeof s.logo_url === 'string') setFrontLogo(s.logo_url);
                if (Array.isArray(s.menu_items)) setFrontMenus(s.menu_items);
            })
            .catch(() => {
            });

        return () => {
            canceled = true;
        };
    }, []);

    const defaultNavigation = [
        { name: t('nav.home', 'Home'), href: '/' },
        {
            name: t('nav.about', 'About'),
            href: '/about',
            children: [
                { name: t('nav.about.company_profile', 'Company Profile'), href: '/about#company-profile' },
                { name: t('nav.about.mission_vision', 'Mission & Vision'), href: '/about#mission-vision' },
                { name: t('nav.about.team', 'Team'), href: '/about#team' },
                { name: t('nav.about.partners', 'Partners'), href: '/portfolio#partners' },
            ],
        },
        {
            name: t('nav.services', 'Services'),
            href: '/services',
            children: [
                { name: t('nav.services.construction', 'Construction'), href: '/services#construction' },
                { name: t('nav.services.interior_design', 'Interior Design'), href: '/services#interior-design' },
                { name: t('nav.services.architectural_plans', 'Architectural Plans'), href: '/services#architectural-plans' },
                { name: t('nav.services.general_supply', 'General Supply'), href: '/services#general-supply' },
                { name: t('nav.services.consultation', 'Consultation'), href: '/services#consultation' },
            ],
        },
        {
            name: t('nav.properties', 'Properties'),
            href: '/properties',
            children: [
                { name: t('nav.properties.houses_for_sale', 'Houses for Sale'), href: '/properties#houses-for-sale' },
                { name: t('nav.properties.apartments', 'Apartments'), href: '/properties#apartments' },
                { name: t('nav.properties.plots_land', 'Plots/Land'), href: '/properties#plots-land' },
                { name: t('nav.properties.commercial', 'Commercial'), href: '/properties#commercial' },
                { name: t('nav.properties.rentals', 'Rentals'), href: '/properties#rentals' },
            ],
        },
        {
            name: t('nav.portfolio', 'Portfolio'),
            href: '/portfolio',
            children: [
                { name: t('nav.portfolio.completed_projects', 'Completed Projects'), href: '/portfolio#completed-projects' },
                { name: t('nav.portfolio.ongoing_projects', 'Ongoing Projects'), href: '/portfolio#ongoing-projects' },
                { name: t('nav.portfolio.gallery', 'Gallery'), href: '/portfolio#gallery' },
                { name: t('nav.portfolio.testimonials', 'Testimonials'), href: '/portfolio#testimonials' },
            ],
        },
        {
            name: t('nav.contact', 'Contact'),
            href: '/#contact',
            children: [
                { name: t('nav.contact.office_location', 'Office Location'), href: '/#contact' },
                { name: t('nav.contact.email', 'Email'), href: '/#contact' },
                { name: t('nav.contact.phone', 'Phone'), href: '/#contact' },
                { name: t('nav.contact.social_media', 'Social Media'), href: '/#contact' },
            ],
        },
        {
            name: t('nav.blog', 'Blog'),
            href: '/#blogs',
            children: [
                { name: t('nav.blog.news', 'News'), href: '/#blogs' },
                { name: t('nav.blog.articles', 'Articles'), href: '/#blogs' },
                { name: t('nav.blog.tips', 'Tips'), href: '/#blogs' },
            ],
        },
        { name: t('nav.faq', 'FAQ'), href: '/#contact' },
        { name: t('nav.login', 'Login'), href: route('login') },
    ];

    const navigation = useMemo(() => {
        if (!Array.isArray(frontMenus) || frontMenus.length === 0) return defaultNavigation;
        return frontMenus
            .filter((x) => x && String(x.label || '').trim() && String(x.href || '').trim())
            .map((x) => ({ name: String(x.label), href: String(x.href) }));
    }, [frontMenus, defaultNavigation]);

    return (
        <header className="sticky top-0 z-50">
            <nav className="bg-sand-200/90 border-b border-black/5 px-4 lg:px-6 py-3 backdrop-blur-md">
                <div className="flex flex-wrap items-center justify-between mx-auto max-w-screen-xl">
                    <Link href="/" className="flex items-center">
                        <img src={frontLogo || '/logo.png'} className="h-9 w-auto" alt="Fortco Logo" />
                    </Link>

                    <div className="flex items-center gap-3 lg:order-3">
                        <div className="hidden lg:block">
                            <div className="relative">
                                <select
                                    value={locale}
                                    onChange={(e) => {
                                        const next = e.target.value;
                                        router.post(
                                            route('locale.set'),
                                            { locale: next },
                                            { preserveScroll: true, preserveState: true },
                                        );
                                    }}
                                    className="rounded-lg border border-black/10 bg-white/70 px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-black/70 backdrop-blur hover:bg-white"
                                >
                                    {available.map((code) => (
                                        <option key={code} value={code}>
                                            {code.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <Link
                            href="/#contact"
                            className="hidden lg:inline-flex items-center justify-center rounded-lg bg-brand-green-500 px-4 py-2 text-xs font-extrabold tracking-wider text-white hover:bg-brand-green-600"
                        >
                            {t('nav.book_online', 'BOOK ONLINE')}
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
                                    <Link
                                        href={item.href}
                                        className="flex items-center rounded-lg px-3 py-2 text-black/70 hover:text-black hover:bg-black/5 lg:hover:bg-transparent lg:px-0"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        {item.name}
                                    </Link>

                                    {item.children ? (
                                        <>
                                            <div className="hidden lg:block lg:invisible lg:absolute lg:left-0 lg:top-full lg:z-50 lg:mt-3 lg:w-64 lg:rounded-xl lg:border lg:border-black/10 lg:bg-white/90 lg:p-2 lg:opacity-0 lg:shadow-xl lg:backdrop-blur lg:transition lg:group-hover:visible lg:group-hover:opacity-100">
                                                {item.children.map((child) => (
                                                    <Link
                                                        key={child.name}
                                                        href={child.href}
                                                        className="block rounded-lg px-3 py-2 text-[11px] font-extrabold tracking-wider uppercase text-black/70 hover:bg-black/5 hover:text-black"
                                                    >
                                                        {child.name}
                                                    </Link>
                                                ))}
                                            </div>

                                            <div className="lg:hidden -mt-1 mb-2">
                                                <div className="grid gap-1 px-3">
                                                    {item.children.map((child) => (
                                                        <Link
                                                            key={child.name}
                                                            href={child.href}
                                                            className="rounded-lg px-3 py-2 text-[11px] font-extrabold tracking-wider uppercase text-black/60 hover:bg-black/5 hover:text-black"
                                                            onClick={() => setMobileOpen(false)}
                                                        >
                                                            {child.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    ) : null}
                                </li>
                            ))}
                            <li className="lg:hidden">
                                <div className="px-3 pt-2">
                                    <div className="text-[10px] font-extrabold uppercase tracking-widest text-black/50">
                                        {t('nav.language', 'Language')}
                                    </div>
                                    <select
                                        value={locale}
                                        onChange={(e) => {
                                            const next = e.target.value;
                                            router.post(
                                                route('locale.set'),
                                                { locale: next },
                                                { preserveScroll: true, preserveState: true },
                                            );
                                            setMobileOpen(false);
                                        }}
                                        className="mt-2 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-[12px] font-bold text-black/70"
                                    >
                                        {available.map((code) => (
                                            <option key={code} value={code}>
                                                {code.toUpperCase()}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <Link
                                    href="/#contact"
                                    className="mt-1 inline-flex w-full items-center justify-center rounded-lg bg-brand-green-500 px-4 py-2 text-xs font-extrabold tracking-wider text-white hover:bg-brand-green-600"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {t('nav.book_online', 'BOOK ONLINE')}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}
