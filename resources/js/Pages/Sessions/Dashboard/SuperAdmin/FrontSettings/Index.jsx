import AdminPanelLayout from '@/Layouts/AdminPanelLayout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

export default function Index() {
    const page = usePage();
    const section = page.props.section || 'header';

    const [busy, setBusy] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');
    const [settings, setSettings] = useState({});

    const csrf = () => document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    const readJson = async (r) => {
        const t = await r.text();
        try {
            return t ? JSON.parse(t) : {};
        } catch (e) {
            return {};
        }
    };

    const items = useMemo(
        () => [
            { key: 'header', label: 'Header', href: route('admin.front-settings', { section: 'header' }) },
            { key: 'footer', label: 'Footer', href: route('admin.front-settings', { section: 'footer' }) },
            { key: 'hero', label: 'Hero', href: route('admin.front-settings', { section: 'hero' }) },
            { key: 'about', label: 'About', href: route('admin.front-settings', { section: 'about' }) },
            { key: 'portfolio', label: 'Portfolio', href: route('admin.front-settings', { section: 'portfolio' }) },
            { key: 'contact', label: 'Contact', href: route('admin.front-settings', { section: 'contact' }) },
            { key: 'theme', label: 'Theme', href: route('admin.front-settings', { section: 'theme' }) },
            { key: 'seo', label: 'SEO', href: route('admin.front-settings', { section: 'seo' }) },
            { key: 'social', label: 'Social', href: route('admin.front-settings', { section: 'social' }) },
        ],
        []
    );

    const active = items.some((i) => i.key === section) ? section : 'header';
    const activeLabel = items.find((i) => i.key === active)?.label || 'Header';

    const fields = useMemo(() => {
        const common = {
            labelClass: 'block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5',
            inputClass:
                'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition outline-none',
        };

        const map = {
            header: [
                { key: 'logo_url', label: 'Logo URL', type: 'text', placeholder: '/logo.png' },
                { key: 'cta_text', label: 'CTA Text', type: 'text', placeholder: 'BOOK ONLINE' },
                { key: 'cta_link', label: 'CTA Link', type: 'text', placeholder: '/#contact' },
            ],
            footer: [
                { key: 'email', label: 'Email', type: 'text', placeholder: 'contact@fortco.co.tz' },
                { key: 'phone', label: 'Phone', type: 'text', placeholder: '+255 700 000 000' },
                { key: 'address', label: 'Location/Address', type: 'text', placeholder: 'Dar es Salaam, Tanzania' },
                { key: 'copyright_text', label: 'Copyright', type: 'text', placeholder: '© 2026 Fortco Company Limited. All rights reserved.' },
            ],
            hero: [
                { key: 'headline', label: 'Headline', type: 'text', placeholder: 'Manage your properties and projects with ease.' },
                { key: 'subheadline', label: 'Subheadline', type: 'textarea', placeholder: 'Short description shown in hero section.' },
                { key: 'primary_button_text', label: 'Primary Button Text', type: 'text', placeholder: 'Get Started Now' },
                { key: 'primary_button_link', label: 'Primary Button Link', type: 'text', placeholder: '/register' },
                { key: 'secondary_button_text', label: 'Secondary Button Text', type: 'text', placeholder: 'Explore Features' },
                { key: 'secondary_button_link', label: 'Secondary Button Link', type: 'text', placeholder: '/#features' },
            ],
            about: [
                { key: 'title', label: 'Title', type: 'text', placeholder: 'Who we are' },
                { key: 'description', label: 'Description', type: 'textarea', placeholder: 'About description shown on the home page section.' },
            ],
            portfolio: [
                { key: 'hero_title', label: 'Hero Title', type: 'text', placeholder: 'Portfolio' },
                { key: 'hero_subtitle', label: 'Hero Subtitle', type: 'textarea', placeholder: 'Portfolio hero subtitle/description.' },
            ],
            contact: [
                { key: 'email', label: 'Email', type: 'text', placeholder: 'hello@fortco.co.tz' },
                { key: 'phone', label: 'Phone', type: 'text', placeholder: '+255 700 000 000' },
                { key: 'location', label: 'Location', type: 'text', placeholder: 'Dar es Salaam, Tanzania' },
                { key: 'hours', label: 'Working Hours', type: 'text', placeholder: 'Mon - Fri · 8:00 AM - 5:00 PM (EAT)' },
            ],
            theme: [
                { key: 'primary_color', label: 'Primary Color', type: 'text', placeholder: '#1E3A8A' },
                { key: 'accent_color', label: 'Accent Color', type: 'text', placeholder: '#16A34A' },
            ],
            seo: [
                { key: 'meta_title', label: 'Meta Title', type: 'text', placeholder: 'Fortco' },
                { key: 'meta_description', label: 'Meta Description', type: 'textarea', placeholder: 'SEO description' },
            ],
            social: [
                { key: 'facebook', label: 'Facebook', type: 'text', placeholder: 'https://facebook.com' },
                { key: 'twitter', label: 'Twitter', type: 'text', placeholder: 'https://twitter.com' },
                { key: 'instagram', label: 'Instagram', type: 'text', placeholder: 'https://instagram.com' },
                { key: 'linkedin', label: 'LinkedIn', type: 'text', placeholder: 'https://linkedin.com' },
                { key: 'youtube', label: 'YouTube', type: 'text', placeholder: 'https://youtube.com' },
                { key: 'tiktok', label: 'TikTok', type: 'text', placeholder: 'https://tiktok.com' },
            ],
        };

        return { common, map };
    }, []);

    const sectionFields = fields.map[active] || [];

    const load = () => {
        setBusy(true);
        setError('');
        setSaved(false);
        fetch(route('admin.front-settings.data', { section: active }), {
            headers: { Accept: 'application/json' },
        })
            .then(async (r) => {
                const j = await readJson(r);
                if (!r.ok) throw new Error(j?.message || 'Failed');
                setSettings(j?.settings || {});
            })
            .catch((e) => setError(e?.message || 'Failed to load settings'))
            .finally(() => setBusy(false));
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active]);

    const save = () => {
        setBusy(true);
        setError('');
        setSaved(false);
        fetch(route('admin.front-settings.update'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf(),
                'X-Requested-With': 'XMLHttpRequest',
                Accept: 'application/json',
            },
            body: JSON.stringify({ section: active, settings }),
        })
            .then(async (r) => {
                const j = await readJson(r);
                if (!r.ok) throw new Error(j?.message || 'Failed');
                setSaved(true);
            })
            .catch((e) => setError(e?.message || 'Failed to save'))
            .finally(() => setBusy(false));
    };

    const setValue = (k, v) => setSettings((prev) => ({ ...prev, [k]: v }));

    const pageOptions = useMemo(
        () => [
            { label: 'Home', value: '/' },
            { label: 'About', value: '/about' },
            { label: 'Services', value: '/services' },
            { label: 'Portfolio', value: '/portfolio' },
            { label: 'Contact', value: '/#contact' },
            { label: 'Login', value: '/login' },
        ],
        []
    );

    const menuItems = Array.isArray(settings?.menu_items) ? settings.menu_items : [];

    const updateMenuItem = (idx, patch) => {
        setValue(
            'menu_items',
            menuItems.map((x, i) => (i === idx ? { ...x, ...patch } : x))
        );
    };

    const addMenuItem = () => {
        setValue('menu_items', [...menuItems, { label: 'New Menu', href: '/' }]);
    };

    const removeMenuItem = (idx) => {
        setValue('menu_items', menuItems.filter((_, i) => i !== idx));
    };

    const moveMenuItem = (from, to) => {
        if (to < 0 || to >= menuItems.length) return;
        const next = [...menuItems];
        const [it] = next.splice(from, 1);
        next.splice(to, 0, it);
        setValue('menu_items', next);
    };

    const uploadLogo = (file) => {
        if (!file) return;
        setBusy(true);
        setError('');
        setSaved(false);

        const fd = new FormData();
        fd.append('section', 'header');
        fd.append('key', 'logo_url');
        fd.append('file', file);

        fetch(route('admin.front-settings.upload'), {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': csrf(),
                'X-Requested-With': 'XMLHttpRequest',
                Accept: 'application/json',
            },
            body: fd,
        })
            .then(async (r) => {
                const j = await readJson(r);
                if (!r.ok) throw new Error(j?.message || 'Failed');
                if (j?.url) setValue('logo_url', j.url);
                setSaved(true);
            })
            .catch((e) => setError(e?.message || 'Upload failed'))
            .finally(() => setBusy(false));
    };

    return (
        <>
            <Head title="Front Settings" />
            <AdminPanelLayout
                title="Front Settings"
                active={active}
                items={items}
            >
                <div className="border-b border-slate-200 px-6 py-4">
                    <div className="text-sm font-semibold text-slate-900">
                        {activeLabel} Settings
                    </div>
                    <div className="mt-1 text-[12px] text-slate-500">
                        Manage website sections and content.
                    </div>
                </div>

                <div className="p-6">
                    {error ? (
                        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">{error}</div>
                    ) : null}

                    {saved ? (
                        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[12px] text-emerald-700">Saved.</div>
                    ) : null}

                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
                            <div className="text-[12px] font-semibold text-slate-700">{activeLabel} controls</div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={load}
                                    disabled={busy}
                                    className="rounded-lg px-4 py-2 text-[12px] font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Refresh
                                </button>
                                <button
                                    type="button"
                                    onClick={save}
                                    disabled={busy}
                                    className="rounded-lg px-4 py-2 text-[12px] font-semibold bg-blue-900 text-white hover:bg-blue-800 disabled:opacity-50"
                                >
                                    {busy ? 'Saving…' : 'Save'}
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                {sectionFields.map((f) => (
                                    <div key={f.key} className={f.type === 'textarea' ? 'md:col-span-2' : undefined}>
                                        <label className={fields.common.labelClass}>{f.label}</label>
                                        {f.type === 'textarea' ? (
                                            <textarea
                                                value={settings?.[f.key] ?? ''}
                                                onChange={(e) => setValue(f.key, e.target.value)}
                                                rows={4}
                                                placeholder={f.placeholder}
                                                className={fields.common.inputClass}
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                value={settings?.[f.key] ?? ''}
                                                onChange={(e) => setValue(f.key, e.target.value)}
                                                placeholder={f.placeholder}
                                                className={fields.common.inputClass}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {active === 'header' ? (
                                <div className="mt-8 grid gap-6">
                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                        <div className="text-[12px] font-bold text-slate-900">Logo upload</div>
                                        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 rounded-xl bg-white ring-1 ring-slate-200 flex items-center justify-center overflow-hidden">
                                                    <img src={settings?.logo_url || '/logo.png'} alt="Logo" className="h-full w-full object-contain" />
                                                </div>
                                                <div className="text-[12px] font-semibold text-slate-700">Current: {settings?.logo_url || '/logo.png'}</div>
                                            </div>

                                            <input
                                                type="file"
                                                accept="image/*"
                                                disabled={busy}
                                                onChange={(e) => uploadLogo(e.target.files?.[0])}
                                                className="text-[12px] font-semibold text-slate-700"
                                            />
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <div className="text-[12px] font-bold text-slate-900">Header menus</div>
                                                <div className="mt-1 text-[12px] text-slate-500">Add menus, rename, choose page/link, and reorder.</div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={addMenuItem}
                                                className="rounded-lg px-4 py-2 text-[12px] font-semibold bg-blue-900 text-white hover:bg-blue-800"
                                            >
                                                + Add Menu
                                            </button>
                                        </div>

                                        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-slate-50/50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                                                        <th className="px-4 py-3 border-r border-slate-100 w-16">No.</th>
                                                        <th className="px-4 py-3 border-r border-slate-100">Menu Name</th>
                                                        <th className="px-4 py-3 border-r border-slate-100">Page/Link</th>
                                                        <th className="px-4 py-3 text-center w-40">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {menuItems.length ? (
                                                        menuItems.map((m, idx) => (
                                                            <tr key={`${idx}-${m.label}`} className="hover:bg-slate-50/50">
                                                                <td className="px-4 py-3 border-r border-slate-100 text-[12px] font-semibold text-slate-700">{idx + 1}</td>
                                                                <td className="px-4 py-3 border-r border-slate-100">
                                                                    <input
                                                                        value={m?.label || ''}
                                                                        onChange={(e) => updateMenuItem(idx, { label: e.target.value })}
                                                                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] font-semibold text-slate-900"
                                                                        placeholder="Menu name"
                                                                    />
                                                                </td>
                                                                <td className="px-4 py-3 border-r border-slate-100">
                                                                    <div className="grid gap-2 md:grid-cols-2">
                                                                        <select
                                                                            value={pageOptions.some((p) => p.value === m?.href) ? m.href : ''}
                                                                            onChange={(e) => updateMenuItem(idx, { href: e.target.value || m?.href })}
                                                                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-900"
                                                                        >
                                                                            <option value="">Custom URL</option>
                                                                            {pageOptions.map((p) => (
                                                                                <option key={p.value} value={p.value}>
                                                                                    {p.label}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                        <input
                                                                            value={m?.href || ''}
                                                                            onChange={(e) => updateMenuItem(idx, { href: e.target.value })}
                                                                            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] font-semibold text-slate-900"
                                                                            placeholder="/path or https://..."
                                                                        />
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    <div className="flex items-center justify-center gap-2">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => moveMenuItem(idx, idx - 1)}
                                                                            className="h-9 w-9 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                                                            title="Move up"
                                                                        >
                                                                            ↑
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => moveMenuItem(idx, idx + 1)}
                                                                            className="h-9 w-9 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                                                            title="Move down"
                                                                        >
                                                                            ↓
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => removeMenuItem(idx)}
                                                                            className="h-9 w-9 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                                                                            title="Delete"
                                                                        >
                                                                            ✕
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="4" className="px-4 py-10 text-center text-[12px] text-slate-500 italic">
                                                                No menus yet. Click “Add Menu”.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </AdminPanelLayout>
        </>
    );
}
