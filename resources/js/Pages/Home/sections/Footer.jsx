import Container from '../components/Container';
import AnimatedIcon from '../../../Components/AnimatedIcon';
import activity from 'react-useanimations/lib/activity';
import explore from 'react-useanimations/lib/explore';
import lock from 'react-useanimations/lib/lock';
import home from 'react-useanimations/lib/home';
import calendar from 'react-useanimations/lib/calendar';
import checkmark from 'react-useanimations/lib/checkmark';
import settings from 'react-useanimations/lib/settings';
import { ArrowUpRightIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaTiktok } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-slate-50 dark:border-gray-800 dark:bg-gray-900">
            <Container className="py-14">
                <div className="grid gap-10 lg:grid-cols-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <img src="/logo.png" alt="Fortco" className="h-12 w-12 rounded-2xl bg-white p-1 object-contain shadow-sm" loading="lazy" />
                            <div>
                                <div className="text-base font-black tracking-tight text-slate-900 dark:text-white">Fortco</div>
                                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Company Limited
                                </div>
                            </div>
                        </div>
                        <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300">
                            Real estate, construction, loans, appointments, and reporting, organized in one modern platform.
                        </p>

                        <div className="mt-6 space-y-3">
                            <a
                                href="mailto:contact@fortco.co.tz"
                                className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                            >
                                <EnvelopeIcon className="h-4 w-4" />
                                contact@fortco.co.tz
                            </a>
                            <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                <PhoneIcon className="h-4 w-4" />
                                +255 700 000 000
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Product</div>
                            <div className="mt-4 grid gap-2 text-sm">
                                <a href="#features" className="text-slate-700 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                                    <span className="inline-flex items-center gap-2">
                                        <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900">
                                            <AnimatedIcon animation={settings} size={18} strokeColor="#2563eb" autoplay loop speed={0.9} />
                                        </span>
                                        Features
                                    </span>
                                </a>
                                <a href="#services" className="text-slate-700 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                                    <span className="inline-flex items-center gap-2">
                                        <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900">
                                            <AnimatedIcon animation={home} size={18} strokeColor="#2563eb" autoplay loop speed={0.9} />
                                        </span>
                                        Services
                                    </span>
                                </a>
                                <a href="#blogs" className="text-slate-700 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                                    <span className="inline-flex items-center gap-2">
                                        <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900">
                                            <AnimatedIcon animation={explore} size={18} strokeColor="#2563eb" autoplay loop speed={0.9} />
                                        </span>
                                        Blogs
                                    </span>
                                </a>
                            </div>
                        </div>
                        <div>
                            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Company</div>
                            <div className="mt-4 grid gap-2 text-sm">
                                <a href="#about" className="text-slate-700 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                                    <span className="inline-flex items-center gap-2">
                                        <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900">
                                            <AnimatedIcon animation={checkmark} size={18} strokeColor="#2563eb" autoplay loop speed={0.9} />
                                        </span>
                                        About
                                    </span>
                                </a>
                                <a href="#contact" className="text-slate-700 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                                    <span className="inline-flex items-center gap-2">
                                        <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900">
                                            <AnimatedIcon animation={calendar} size={18} strokeColor="#2563eb" autoplay loop speed={0.9} />
                                        </span>
                                        Contact
                                    </span>
                                </a>
                                <a href="#" className="text-slate-700 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
                                    <span className="inline-flex items-center gap-2">
                                        <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900">
                                            <AnimatedIcon animation={activity} size={18} strokeColor="#2563eb" autoplay loop speed={0.9} />
                                        </span>
                                        Support
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Get started</div>
                        <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300">
                            Create an account, set roles, and start managing projects with clarity.
                        </p>
                        <div className="mt-5">
                            <a
                                href="#contact"
                                className="group inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-black px-6 py-3 text-sm font-extrabold tracking-wide text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                            >
                                Book Online
                                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10">
                                    <ArrowUpRightIcon className="h-5 w-5 text-white transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                </span>
                            </a>
                        </div>
                    </div>
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Follow</div>
                        <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-300">Updates, product news, and tips.</p>
                        <div className="mt-5 flex items-center gap-4 text-lg">
                            {[
                                { label: 'Facebook', href: 'https://facebook.com', Icon: FaFacebook },
                                { label: 'Twitter', href: 'https://twitter.com', Icon: FaTwitter },
                                { label: 'Instagram', href: 'https://instagram.com', Icon: FaInstagram },
                                { label: 'LinkedIn', href: 'https://linkedin.com', Icon: FaLinkedin },
                                { label: 'YouTube', href: 'https://youtube.com', Icon: FaYoutube },
                                { label: 'TikTok', href: 'https://tiktok.com', Icon: FaTiktok },
                            ].map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="transition-transform duration-200 hover:-translate-y-0.5"
                                    aria-label={s.label}
                                    title={s.label}
                                >
                                    <span className="text-primary-700 hover:text-primary-800 dark:text-primary-300 dark:hover:text-primary-200">
                                        <s.Icon />
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-slate-200 pt-6 text-sm text-slate-600 dark:border-gray-800 dark:text-slate-400 md:flex-row">
                    <div>© {new Date().getFullYear()} Fortco Company Limited. All rights reserved.</div>
                    <div className="flex gap-4">
                        <a href="#" className="transition hover:text-slate-900 dark:hover:text-white">
                            Privacy
                        </a>
                        <a href="#" className="transition hover:text-slate-900 dark:hover:text-white">
                            Terms
                        </a>
                    </div>
                </div>
            </Container>
        </footer>
    );
}
