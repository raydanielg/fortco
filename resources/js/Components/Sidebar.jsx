import { Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';

function IconGrid(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
        </svg>
    );
}

function IconQuestion(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.09 9a3 3 0 115.82 1c0 2-3 2-3 4"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 17h.01" />
        </svg>
    );
}

function IconChart(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3v18h18"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 15l3-3 3 2 5-6"
            />
        </svg>
    );
}

function IconBuilding(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 21h18"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 21V5a2 2 0 012-2h8a2 2 0 012 2v16"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 7h1M9 10h1M9 13h1M14 7h1M14 10h1M14 13h1"
            />
        </svg>
    );
}

function IconHammer(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 7l3 3m-9 9l9-9M6 8l2-2 4 4-2 2-4-4z"
            />
        </svg>
    );
}

function IconHome(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 10.5l9-7 9 7V20a1.5 1.5 0 01-1.5 1.5H6A1.5 1.5 0 014.5 20v-9.5z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 21V12h6v9"
            />
        </svg>
    );
}

function IconCash(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 7h18v10H3V7z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 11h.01M17 13h.01"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 17h6"
            />
        </svg>
    );
}

function IconCalendar(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 3v2M16 3v2M4 7h16"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 7v14h14V7"
            />
        </svg>
    );
}

function IconImage(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 11l3 3 5-5"
            />
        </svg>
    );
}

function IconUsers(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 21v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 12a4 4 0 100-8 4 4 0 000 8z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 21v-1a3 3 0 00-2.2-2.9"
            />
        </svg>
    );
}

function IconLock(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 11V8a4 4 0 118 0v3"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 11h12a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7a2 2 0 012-2z"
            />
        </svg>
    );
}

function IconCard(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 10h18"
            />
        </svg>
    );
}

function IconReport(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 17v-6m4 6V7m4 10v-4"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 21h16"
            />
        </svg>
    );
}

function IconSupport(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 12a8 8 0 0116 0v5a2 2 0 01-2 2h-2"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 17v-5a6 6 0 0112 0v5"
            />
        </svg>
    );
}

function IconPalette(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 3c5 0 9 3.6 9 8 0 2.8-1.8 4-4 4h-1a2 2 0 00-2 2 3 3 0 01-3 3c-4.4 0-8-3.6-8-8 0-5 4-9 9-9z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7.5 10h.01M10 8.5h.01M14 8.5h.01M16.5 10h.01" />
        </svg>
    );
}

function IconCog2(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19.4 15a7.7 7.7 0 00.1-1 7.7 7.7 0 00-.1-1l2-1.5-2-3.5-2.4 1a7.8 7.8 0 00-1.7-1l-.4-2.6h-4l-.4 2.6a7.8 7.8 0 00-1.7 1l-2.4-1-2 3.5 2 1.5a7.7 7.7 0 00-.1 1 7.7 7.7 0 00.1 1l-2 1.5 2 3.5 2.4-1c.5.4 1.1.7 1.7 1l.4 2.6h4l.4-2.6c.6-.3 1.2-.6 1.7-1l2.4 1 2-3.5-2-1.5z"
            />
        </svg>
    );
}

function IconChevron(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
            />
        </svg>
    );
}

function IconFile(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"
            />
        </svg>
    );
}

function IconBag(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 8h14l-1 12H6L5 8z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 8V6a3 3 0 016 0v2"
            />
        </svg>
    );
}

function IconChat(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 10h8m-8 4h5m9-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
    );
}

function IconShield(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4"
            />
        </svg>
    );
}

export default function Sidebar({
    title,
    userName,
    isSuperAdmin = false,
    isOpen,
    onClose,
}) {
    const [query, setQuery] = useState('');

    const [openDashboard, setOpenDashboard] = useState(true);
    const [openConstruction, setOpenConstruction] = useState(false);
    const [openRealEstate, setOpenRealEstate] = useState(false);
    const [openLoans, setOpenLoans] = useState(false);
    const [openAppointments, setOpenAppointments] = useState(false);
    const [openPortfolio, setOpenPortfolio] = useState(false);
    const [openUsers, setOpenUsers] = useState(false);
    const [openUserManagement, setOpenUserManagement] = useState(false);
    const [openBilling, setOpenBilling] = useState(false);
    const [openCompanies, setOpenCompanies] = useState(false);
    const [openReports, setOpenReports] = useState(false);
    const [openSupport, setOpenSupport] = useState(false);
    const [openFront, setOpenFront] = useState(false);
    const [openSettings, setOpenSettings] = useState(false);
    const [openSuperAdmin, setOpenSuperAdmin] = useState(false);
    const [openPackages, setOpenPackages] = useState(false);
    const [openOffline, setOpenOffline] = useState(false);
    const [openFaq, setOpenFaq] = useState(false);

    const menu = useMemo(() => {
        if (!isSuperAdmin) {
            return [
                {
                    key: 'dashboard',
                    label: 'Dashboard',
                    icon: IconGrid,
                    open: openDashboard,
                    setOpen: setOpenDashboard,
                    children: [
                        { label: 'Main Dashboard', href: route('dashboard') },
                    ],
                },
            ];
        }

        return [
            {
                key: 'dashboard',
                label: 'DASHBOARD',
                icon: IconChart,
                open: openDashboard,
                setOpen: setOpenDashboard,
                children: [
                    { label: 'Main Dashboard', href: route('dashboard') },
                    { label: 'Analytics', href: route('admin.analytics') },
                    { label: 'System Health', href: route('admin.system-health') },
                ],
            },
            {
                key: 'construction',
                label: 'CONSTRUCTION',
                icon: IconHammer,
                open: openConstruction,
                setOpen: setOpenConstruction,
                children: [
                    { label: 'Projects', href: '#' },
                    { label: 'Materials', href: '#' },
                    { label: 'Workers', href: '#' },
                ],
            },
            {
                key: 'real_estate',
                label: 'REAL ESTATE',
                icon: IconHome,
                open: openRealEstate,
                setOpen: setOpenRealEstate,
                children: [
                    { label: 'Properties', href: '#' },
                    { label: 'Bookings', href: '#' },
                    { label: 'Clients', href: '#' },
                ],
            },
            {
                key: 'loans',
                label: 'LOANS',
                icon: IconCash,
                open: openLoans,
                setOpen: setOpenLoans,
                children: [
                    { label: 'Companies', href: '#' },
                    { label: 'Applications', href: '#' },
                    { label: 'Repayments', href: '#' },
                ],
            },
            {
                key: 'appointments',
                label: 'APPOINTMENTS',
                icon: IconCalendar,
                open: openAppointments,
                setOpen: setOpenAppointments,
                children: [
                    { label: 'Calendar', href: '#' },
                    { label: 'Bookings', href: '#' },
                    { label: 'Services', href: '#' },
                ],
            },
            {
                key: 'portfolio',
                label: 'PORTFOLIO',
                icon: IconImage,
                open: openPortfolio,
                setOpen: setOpenPortfolio,
                children: [
                    { label: 'Gallery', href: '#' },
                    { label: 'Testimonials', href: '#' },
                    { label: 'Awards', href: '#' },
                ],
            },
            {
                key: 'user_management',
                label: 'USER MANAGEMENT',
                icon: IconLock,
                open: openUserManagement,
                setOpen: setOpenUserManagement,
                children: [
                    { label: 'Users', href: route('admin.user-management.users') },
                    { label: 'Employees', href: route('admin.user-management.employees') },
                    { label: 'Roles', href: route('admin.user-management.roles') },
                    { label: 'Permissions', href: route('admin.user-management.permissions') },
                    { label: 'Sessions & Logs', href: route('admin.user-management.sessions-logs') },
                ],
            },
            {
                key: 'billing',
                label: 'BILLING',
                icon: IconCard,
                open: openBilling,
                setOpen: setOpenBilling,
                children: [
                    { label: 'Invoices', href: '#' },
                    { label: 'Transactions', href: '#' },
                    { label: 'Gateways', href: '#' },
                ],
            },
            {
                key: 'companies',
                label: 'COMPANIES',
                icon: IconBuilding,
                open: openCompanies,
                setOpen: setOpenCompanies,
                children: [
                    { label: 'Profile', href: '#' },
                    { label: 'Partners', href: '#' },
                    { label: 'Vendors', href: '#' },
                ],
            },
            {
                key: 'reports',
                label: 'REPORTS',
                icon: IconReport,
                open: openReports,
                setOpen: setOpenReports,
                children: [
                    { label: 'Financial', href: '#' },
                    { label: 'Projects', href: '#' },
                    { label: 'Export', href: '#' },
                ],
            },
            {
                key: 'support',
                label: 'SUPPORT',
                icon: IconSupport,
                open: openSupport,
                setOpen: setOpenSupport,
                children: [
                    { label: 'Tickets', href: '#' },
                    { label: 'Live Chat', href: '#' },
                    { label: 'Knowledge Base', href: '#' },
                ],
            },
            {
                key: 'front',
                label: 'FRONT SETTINGS',
                icon: IconPalette,
                href: route('admin.front-settings'),
            },
            {
                key: 'settings',
                label: 'SETTINGS',
                icon: IconCog2,
                href: route('admin.settings'),
            },
            {
                key: 'superadmin',
                label: 'SUPER ADMIN',
                icon: IconShield,
                open: openSuperAdmin,
                setOpen: setOpenSuperAdmin,
                children: [
                    { label: 'System Audit', href: '#' },
                    { label: 'Modules', href: '#' },
                    { label: 'Impersonate', href: '#' },
                    { label: 'Maintenance', href: '#' },
                ],
            },
            {
                key: 'packages',
                label: 'PACKAGES',
                icon: IconBag,
                open: openPackages,
                setOpen: setOpenPackages,
                children: [
                    { label: 'Subscriptions', href: '#' },
                    { label: 'Features', href: '#' },
                    { label: 'Pricing', href: '#' },
                ],
            },
            {
                key: 'offline',
                label: 'OFFLINE REQUEST',
                icon: IconChat,
                open: openOffline,
                setOpen: setOpenOffline,
                children: [
                    { label: 'Pending', href: '#' },
                    { label: 'Approved', href: '#' },
                    { label: 'Rejected', href: '#' },
                ],
            },
            {
                key: 'faq',
                label: 'ADMIN FAQ',
                icon: IconQuestion,
                href: route('admin.faq'),
            },
        ];
    }, [
        isSuperAdmin,
        openDashboard,
        openConstruction,
        openRealEstate,
        openLoans,
        openAppointments,
        openPortfolio,
        openUsers,
        openUserManagement,
        openBilling,
        openCompanies,
        openReports,
        openSupport,
        openFront,
        openSettings,
        openSuperAdmin,
        openPackages,
        openOffline,
        openFaq,
    ]);

    const filteredMenu = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return menu;

        return menu
            .map((group) => {
                const matchesGroup = group.label.toLowerCase().includes(q);
                const children = (group.children || []).filter((c) =>
                    c.label.toLowerCase().includes(q)
                );
                if (matchesGroup || children.length) {
                    return {
                        ...group,
                        open: true,
                        children,
                    };
                }
                return null;
            })
            .filter(Boolean);
    }, [menu, query]);

    const StepsList = ({ items }) => (
        <ul className="relative mt-1 space-y-1 border-l border-gray-200 py-1 pl-5">
            {items.map((item) => (
                <li key={item.label}>
                    <Link
                        href={item.href}
                        className="group relative flex w-full items-center rounded-lg p-2 pl-6 text-sm font-medium text-gray-700 hover:bg-gray-100"
                        onClick={onClose}
                    >
                        <span className="absolute left-[-9px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-gray-300 bg-white group-hover:border-gray-400" />
                        {item.label}
                    </Link>
                </li>
            ))}
        </ul>
    );

    const Section = ({ group }) => {
        if (group.href) {
            const Icon = group.icon;
            return (
                <li>
                    <Link
                        href={group.href}
                        className="group flex w-full items-center rounded-lg p-2 text-[12px] font-semibold text-gray-900 hover:bg-gray-100"
                        onClick={onClose}
                    >
                        <Icon className="h-5 w-5 text-gray-400 transition-transform duration-200 group-hover:scale-110 group-hover:text-gray-900" />
                        <span className="ml-3 flex-1 whitespace-nowrap text-left tracking-wide">
                            {group.label}
                        </span>
                    </Link>
                </li>
            );
        }

        const Icon = group.icon;
        return (
            <li>
                <button
                    type="button"
                    className="group flex w-full items-center rounded-lg p-2 text-[12px] font-semibold text-gray-900 hover:bg-gray-100"
                    aria-controls={`dropdown-${group.key}`}
                    onClick={() => group.setOpen((v) => !v)}
                >
                    <Icon className="h-5 w-5 text-gray-400 transition-transform duration-200 group-hover:scale-110 group-hover:text-gray-900" />
                    <span className="ml-3 flex-1 whitespace-nowrap text-left tracking-wide">
                        {group.label}
                    </span>
                    <IconChevron
                        className={
                            "h-5 w-5 text-gray-400 transition-transform duration-200 group-hover:text-gray-900 " +
                            (group.open ? "rotate-180" : "")
                        }
                    />
                </button>
                <div id={`dropdown-${group.key}`} className={group.open ? 'block' : 'hidden'}>
                    <StepsList items={group.children} />
                </div>
            </li>
        );
    };

    return (
        <aside
            id="default-sidebar"
            className={
                "fixed left-0 top-12 z-40 h-[calc(100vh-3rem)] w-64 border-r border-gray-200 bg-white transition-transform sm:translate-x-0 " +
                (isOpen ? "translate-x-0" : "-translate-x-full")
            }
            aria-label="Sidenav"
        >
            <div className="h-full overflow-y-auto px-3 py-5">
                <div className="mb-6 px-2">
                    <div className="text-xs font-semibold text-gray-900">
                        FORTCO ERP v2.0
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                        {title}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                        {userName}
                    </div>
                </div>

                <div className="mb-4 px-2">
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.3-4.3m1.8-4.7a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search Menu..."
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 pl-9 text-[12px] text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        />
                    </div>
                </div>

                <ul className="space-y-2">
                    {filteredMenu.map((group) => (
                        <Section key={group.key} group={group} />
                    ))}
                </ul>
            </div>
        </aside>
    );
}
