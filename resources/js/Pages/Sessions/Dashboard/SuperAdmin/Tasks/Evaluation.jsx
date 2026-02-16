import AdminPanelLayout from '@/Layouts/AdminPanelLayout';
import { Head, usePage } from '@inertiajs/react';

export default function Evaluation() {
    const page = usePage();
    const url = page.url || '';

    const items = [
        { key: 'employee', label: 'Employee', href: route('admin.tasks.employee') },
        { key: 'assessment', label: 'Assessment', href: route('admin.tasks.assessment') },
        { key: 'evaluation', label: 'Evaluation', href: route('admin.tasks.evaluation') },
        { key: 'task', label: 'Task', href: route('admin.tasks.task') },
        { key: 'planning', label: 'Planning', href: route('admin.tasks.planning') },
    ];

    const active = items.find((i) => url.includes(`/admin/tasks/${i.key}`))?.key || 'evaluation';
    const activeLabel = items.find((i) => i.key === active)?.label || 'Evaluation';

    return (
        <>
            <Head title={activeLabel} />
            <AdminPanelLayout title="Tasks" active={active} items={items}>
                <div className="border-b border-slate-200 px-6 py-4">
                    <div className="text-sm font-semibold text-slate-900">{activeLabel}</div>
                    <div className="mt-1 text-[12px] text-slate-500">
                        This section is a placeholder. We will add content later.
                    </div>
                </div>

                <div className="p-6">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-[12px] text-slate-600">
                        This page is a placeholder.
                    </div>
                </div>
            </AdminPanelLayout>
        </>
    );
}
