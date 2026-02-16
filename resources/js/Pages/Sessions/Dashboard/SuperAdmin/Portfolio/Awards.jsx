import AdminPanelLayout from '@/Layouts/AdminPanelLayout';
import { Head } from '@inertiajs/react';

export default function Awards() {
    const items = [
        { key: 'projects', label: 'Projects', href: route('admin.portfolio-projects') },
        { key: 'gallery', label: 'Gallery', href: route('admin.portfolio.gallery') },
        { key: 'testimonials', label: 'Testimonials', href: route('admin.portfolio.testimonials') },
        { key: 'awards', label: 'Awards', href: route('admin.portfolio.awards') },
    ];

    return (
        <>
            <Head title="Portfolio - Awards" />
            <AdminPanelLayout title="Portfolio" active="awards" items={items}>
                <div className="border-b border-slate-200 px-6 py-4">
                    <div className="text-sm font-semibold text-slate-900">Awards</div>
                    <div className="mt-1 text-[12px] text-slate-500">This section is a placeholder. We will add content later.</div>
                </div>
                <div className="p-6">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-[12px] text-slate-600">This page is a placeholder.</div>
                </div>
            </AdminPanelLayout>
        </>
    );
}
