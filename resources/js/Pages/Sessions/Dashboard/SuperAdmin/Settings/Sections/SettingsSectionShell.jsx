import { Link } from '@inertiajs/react';

export default function SettingsSectionShell({ title, description, children, docsHref }) {
    return (
        <div className="px-6 pb-6 pt-4">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-6 py-4">
                    <div className="text-sm font-semibold text-slate-900">{title}</div>
                    {description ? <div className="mt-1 text-[12px] text-slate-500">{description}</div> : null}
                </div>

                <div className="p-6">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        {children}
                        {docsHref ? (
                            <div className="mt-4">
                                <Link href={docsHref} className="text-[12px] font-semibold text-primary-700 hover:underline">
                                    Learn more
                                </Link>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}
