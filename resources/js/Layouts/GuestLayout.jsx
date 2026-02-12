import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({
    children,
    title,
    subtitle,
    description,
    footer,
}) {
    return (
        <div className="flex min-h-screen bg-sand-50">
            <div className="grid w-full grid-cols-1 lg:grid-cols-2">
                <div className="flex flex-col items-center justify-center bg-sand-50 px-6 py-12 sm:px-12">
                    <div className="w-full max-w-[400px]">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
                            <div className="flex items-center justify-center">
                                <Link href="/" aria-label="Home">
                                    <img src="/logo.png" className="h-10 w-auto" alt="Fortco Logo" />
                                </Link>
                            </div>

                            {(title || subtitle || description) && (
                                <div className="mt-6 text-center">
                                    {subtitle && (
                                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                                            {subtitle}
                                        </div>
                                    )}
                                    {title && (
                                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                                            {title}
                                        </h1>
                                    )}
                                    {description && (
                                        <p className="mt-2 text-xs leading-relaxed text-slate-500">
                                            {description}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="mt-8">{children}</div>

                            {footer && (
                                <div className="mt-8 text-center">
                                    {footer}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="relative hidden flex-col justify-center overflow-hidden lg:flex">
                    <div className="absolute inset-0 bg-brand-green-600" />
                    <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.4),transparent_50%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.3),transparent_55%),radial-gradient(circle_at_50%_80%,rgba(0,0,0,0.15),transparent_55%)]" />

                    <div className="relative px-20 xl:px-32">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/90 backdrop-blur-md">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
                            </span>
                            FORTCO PLATFORM
                        </div>
                        
                        <h2 className="mt-8 text-5xl font-bold leading-[1.1] tracking-tight text-white xl:text-6xl">
                            Connecting Freight, <br />
                            Empowering Growth.
                        </h2>
                        
                        <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/85">
                            The all-in-one platform designed specifically for the modern logistics industry. 
                            Streamline your operations, manage global shipments, and grow your network with Fortco.
                        </p>

                        <div className="mt-16 grid grid-cols-2 gap-x-12 gap-y-10">
                            <div>
                                <div className="text-lg font-bold text-white">100+ Trade Routes</div>
                                <div className="mt-2 text-sm leading-relaxed text-white/70">
                                    Direct access to major logistics hubs in East Africa, UAE, and China.
                                </div>
                            </div>
                            <div>
                                <div className="text-lg font-bold text-white">Real-time Tracking</div>
                                <div className="mt-2 text-sm leading-relaxed text-white/70">
                                    End-to-end visibility for every shipment, ensuring reliability and transparency.
                                </div>
                            </div>
                        </div>

                        <div className="mt-20">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                                TRUSTED BY INDUSTRY LEADERS
                            </div>
                            <div className="mt-6">
                                <div role="status" className="max-w-sm animate-pulse space-y-3">
                                    <div className="h-2.5 w-48 rounded-full bg-white/20"></div>
                                    <div className="h-2 max-w-[360px] rounded-full bg-white/10"></div>
                                    <div className="h-2 rounded-full bg-white/10"></div>
                                    <div className="h-2 max-w-[330px] rounded-full bg-white/10"></div>
                                    <div className="h-2 max-w-[300px] rounded-full bg-white/10"></div>
                                    <div className="h-2 max-w-[360px] rounded-full bg-white/10"></div>
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
