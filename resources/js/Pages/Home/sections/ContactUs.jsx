import Container from '../components/Container';
import SectionTitle from '../components/SectionTitle';
import {
    BookOpenIcon,
    BuildingOffice2Icon,
    ChatBubbleLeftRightIcon,
    ClockIcon,
    EnvelopeIcon,
    MapPinIcon,
    PhoneIcon
} from '@heroicons/react/24/outline';

export default function ContactUs() {
    return (
        <section id="contact" className="py-20 bg-slate-50 dark:bg-gray-800/50">
            <Container>
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <SectionTitle
                            align="center"
                            eyebrow="Get in touch"
                            title="Ready to Scale Your Operations?"
                            description="Let’s help you simplify operations, improve accountability, and move faster — with one platform built for real estate & construction teams."
                        />
                    </div>

                    <div className="grid gap-6 md:grid-cols-3 mb-10">
                        <a
                            href="mailto:hello@fortco.co.tz"
                            className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900"
                        >
                            <div className="flex items-start gap-4">
                                <span className="h-12 w-12 rounded-2xl bg-primary-50 text-primary-700 ring-1 ring-primary-100 flex items-center justify-center transition-transform group-hover:scale-105 dark:bg-gray-800 dark:text-primary-400 dark:ring-gray-700">
                                    <EnvelopeIcon className="h-6 w-6" />
                                </span>
                                <div>
                                    <p className="text-sm font-black text-slate-900 dark:text-white">Email</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">hello@fortco.co.tz</p>
                                </div>
                            </div>
                        </a>

                        <a
                            href="tel:+255700000000"
                            className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900"
                        >
                            <div className="flex items-start gap-4">
                                <span className="h-12 w-12 rounded-2xl bg-primary-50 text-primary-700 ring-1 ring-primary-100 flex items-center justify-center transition-transform group-hover:scale-105 dark:bg-gray-800 dark:text-primary-400 dark:ring-gray-700">
                                    <PhoneIcon className="h-6 w-6" />
                                </span>
                                <div>
                                    <p className="text-sm font-black text-slate-900 dark:text-white">Phone</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">+255 700 000 000</p>
                                </div>
                            </div>
                        </a>

                        <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900">
                            <div className="flex items-start gap-4">
                                <span className="h-12 w-12 rounded-2xl bg-primary-50 text-primary-700 ring-1 ring-primary-100 flex items-center justify-center transition-transform group-hover:scale-105 dark:bg-gray-800 dark:text-primary-400 dark:ring-gray-700">
                                    <MapPinIcon className="h-6 w-6" />
                                </span>
                                <div>
                                    <p className="text-sm font-black text-slate-900 dark:text-white">Location</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">Dar es Salaam, Tanzania</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-slate-200 dark:border-gray-700 overflow-hidden shadow-2xl">
                        <div className="grid md:grid-cols-2">
                            <div className="p-8 md:p-12">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Send us a Message</h3>
                                <p className="-mt-3 mb-6 text-sm font-medium text-slate-600 dark:text-slate-400">
                                    Tell us what you need — we’ll get back to you with clear answers and the next best step.
                                </p>
                                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Full Name</label>
                                            <input type="text" className="w-full bg-slate-50 dark:bg-gray-800 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary-500" placeholder="John Doe" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Email Address</label>
                                            <input type="email" className="w-full bg-slate-50 dark:bg-gray-800 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary-500" placeholder="john@example.com" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Subject</label>
                                        <select className="w-full bg-slate-50 dark:bg-gray-800 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary-500">
                                            <option>General Inquiry</option>
                                            <option>Demo Request</option>
                                            <option>Pricing Question</option>
                                            <option>Partnership</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Message</label>
                                        <textarea rows="4" className="w-full bg-slate-50 dark:bg-gray-800 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary-500" placeholder="How can we help?"></textarea>
                                    </div>
                                    <button className="w-full bg-slate-900 dark:bg-primary-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-slate-200 dark:shadow-none hover:bg-slate-800 dark:hover:bg-primary-700 transition-all active:scale-[0.98]">
                                        Send Message
                                    </button>
                                </form>
                            </div>
                            <div className="bg-slate-900 p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-black text-white mb-6">Contact details</h3>
                                    <p className="-mt-3 mb-6 text-sm font-medium text-slate-300">
                                        Quick support, professional guidance, and a team that understands your workflow.
                                    </p>

                                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 text-white font-semibold">
                                                <EnvelopeIcon className="h-5 w-5 text-primary-300" />
                                                <span>hello@fortco.co.tz</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-white font-semibold">
                                                <PhoneIcon className="h-5 w-5 text-primary-300" />
                                                <span>+255 700 000 000</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-white font-semibold">
                                                <MapPinIcon className="h-5 w-5 text-primary-300" />
                                                <span>Dar es Salaam, Tanzania</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-white font-semibold">
                                                <ClockIcon className="h-5 w-5 text-primary-300" />
                                                <span>Mon - Fri · 8:00 AM - 5:00 PM (EAT)</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                        <div className="flex items-center gap-4 text-white font-bold">
                                            <span className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center">
                                                <ChatBubbleLeftRightIcon className="h-5 w-5 text-white" />
                                            </span>
                                            <span>Live Chat</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-white font-bold">
                                            <span className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center">
                                                <BookOpenIcon className="h-5 w-5 text-white" />
                                            </span>
                                            <span>Help Docs</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Abstract background circle */}
                                <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-primary-600/20 blur-3xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
