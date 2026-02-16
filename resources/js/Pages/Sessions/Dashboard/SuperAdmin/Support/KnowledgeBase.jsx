import AdminPanelLayout from '@/Layouts/AdminPanelLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

export default function KnowledgeBase() {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [q, setQ] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const [openModal, setOpenCreateModal] = useState(false);
    const [openCategoryModal, setOpenCategoryModal] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        id: null,
        title: '',
        content: '',
        category_id: '',
        is_published: true
    });

    const csrf = () => document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    const readJson = async (r) => {
        const t = await r.text();
        try { return t ? JSON.parse(t) : {}; } catch (e) { return {}; }
    };

    const loadData = () => {
        setBusy(true);
        fetch(route('admin.knowledge-base.data', { q, category_id: selectedCategory }), {
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to load');
                setArticles(json.articles || []);
                setCategories(json.categories || []);
            })
            .catch((e) => setError(e?.message))
            .finally(() => setBusy(false));
    };

    useEffect(() => { loadData(); }, [selectedCategory]);

    const submitForm = () => {
        setBusy(true);
        const url = isEditing 
            ? route('admin.knowledge-base.update', { article: form.id })
            : route('admin.knowledge-base.store');
        
        fetch(url, {
            method: isEditing ? 'PUT' : 'POST',
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf(),
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to save');
                setOpenCreateModal(false);
                setForm({ id: null, title: '', content: '', category_id: '', is_published: true });
                loadData();
            })
            .catch((e) => setError(e?.message))
            .finally(() => setBusy(false));
    };

    const submitCategory = () => {
        setBusy(true);
        fetch(route('admin.knowledge-base.categories.store'), {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf(),
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCategory),
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to save category');
                setNewCategory({ name: '', description: '' });
                loadData();
            })
            .catch((e) => setError(e?.message))
            .finally(() => setBusy(false));
    };

    const deleteCategory = (id) => {
        if (!window.confirm('Delete this category? Articles will become uncategorized.')) return;
        setBusy(true);
        fetch(route('admin.knowledge-base.categories.destroy', { category: id }), {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf(),
                Accept: 'application/json',
            },
        })
            .then(async (r) => {
                if (!r.ok) throw new Error('Failed to delete');
                loadData();
            })
            .catch((e) => setError(e?.message))
            .finally(() => setBusy(false));
    };

    const deleteArticle = (id) => {
        if (!window.confirm('Delete this article?')) return;
        setBusy(true);
        fetch(route('admin.knowledge-base.destroy', { article: id }), {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrf(),
                Accept: 'application/json',
            },
        })
            .then(async (r) => {
                if (!r.ok) throw new Error('Failed to delete');
                loadData();
            })
            .catch((e) => setError(e?.message))
            .finally(() => setBusy(false));
    };

    const editArticle = (a) => {
        setForm({
            id: a.id,
            title: a.title,
            content: a.content,
            category_id: a.category_id || '',
            is_published: !!a.is_published
        });
        setIsEditing(true);
        setOpenCreateModal(true);
    };

    const items = [
        { key: 'tickets', label: 'Tickets', href: route('admin.support.tickets') },
        { key: 'live-chat', label: 'Live Chat', href: route('admin.support.live-chat') },
        { key: 'knowledge-base', label: 'Knowledge Base', href: route('admin.support.knowledge-base') },
        { key: 'helpdesk-messages', label: 'Helpdesk Messages', href: route('admin.support.helpdesk-messages') },
    ];

    return (
        <>
            <Head title="Support - Knowledge Base" />
            <AdminPanelLayout title="Support" active="knowledge-base" items={items}>
                <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                    <div>
                        <div className="text-sm font-semibold text-slate-900">Knowledge Base</div>
                        <div className="mt-1 text-[12px] text-slate-500">Manage articles and guides.</div>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setOpenCategoryModal(true)}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Categories
                        </button>
                        <button 
                            onClick={() => { setIsEditing(false); setForm({ id: null, title: '', content: '', category_id: '', is_published: true }); setOpenCreateModal(true); }}
                            className="rounded-xl bg-slate-900 px-4 py-2 text-[12px] font-semibold text-white hover:bg-slate-800"
                        >
                            Add Article
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {error ? <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">{error}</div> : null}
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                        <input 
                            value={q} 
                            onChange={e => setQ(e.target.value)} 
                            onKeyDown={e => e.key === 'Enter' && loadData()}
                            placeholder="Search articles..." 
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] w-full max-w-sm" 
                        />
                        <select 
                            value={selectedCategory} 
                            onChange={e => setSelectedCategory(e.target.value)}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                        >
                            <option value="">All Categories</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {articles.map(a => (
                            <div key={a.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition text-left">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{a.category?.name || 'Uncategorized'}</div>
                                    <div className={`h-2 w-2 rounded-full ${a.is_published ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                </div>
                                <h3 className="mt-2 text-sm font-semibold text-slate-900 leading-snug">{a.title}</h3>
                                <p className="mt-2 text-[12px] text-slate-500 line-clamp-3 leading-relaxed">
                                    {a.content}
                                </p>
                                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <div className="text-[10px] text-slate-400">{new Date(a.created_at).toLocaleDateString()}</div>
                                    <div className="flex gap-2">
                                        <button onClick={() => editArticle(a)} className="text-[11px] font-semibold text-slate-700 hover:text-slate-900">Edit</button>
                                        <button onClick={() => deleteArticle(a.id)} className="text-[11px] font-semibold text-red-600 hover:text-red-700">Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {openModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4">
                        <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl overflow-hidden text-left">
                            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                                <div className="text-sm font-semibold text-slate-900">{isEditing ? 'Edit Article' : 'New Article'}</div>
                                <button onClick={() => setOpenCreateModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                            </div>
                            <div className="p-6 grid gap-4">
                                <div>
                                    <label className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide">Title</label>
                                    <input 
                                        value={form.title} 
                                        onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px]" 
                                        placeholder="e.g. How to reset your password"
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide">Category</label>
                                    <select 
                                        value={form.category_id} 
                                        onChange={e => setForm(p => ({ ...p, category_id: e.target.value }))}
                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px]"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide">Content</label>
                                    <textarea 
                                        value={form.content} 
                                        onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                                        rows={8}
                                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px]" 
                                        placeholder="Write article instructions here..."
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="checkbox" 
                                        id="is_pub"
                                        checked={form.is_published} 
                                        onChange={e => setForm(p => ({ ...p, is_published: e.target.checked }))}
                                    />
                                    <label htmlFor="is_pub" className="text-[12px] text-slate-700">Published</label>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                                <button onClick={() => setOpenCreateModal(false)} className="px-4 py-2 text-[12px] font-semibold text-slate-700">Cancel</button>
                                <button 
                                    onClick={submitForm}
                                    disabled={busy || !form.title || !form.content}
                                    className="rounded-xl bg-slate-900 px-6 py-2 text-[12px] font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                                >
                                    {busy ? 'Saving...' : 'Save Article'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {openCategoryModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4">
                        <div className="w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden text-left">
                            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                                <div className="text-sm font-semibold text-slate-900">Manage Categories</div>
                                <button onClick={() => setOpenCategoryModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                            </div>
                            <div className="p-6">
                                <div className="grid gap-4 mb-6">
                                    <div>
                                        <label className="text-[11px] font-semibold text-slate-700 uppercase tracking-wide">Category Name</label>
                                        <div className="flex gap-2 mt-1">
                                            <input 
                                                value={newCategory.name} 
                                                onChange={e => setNewCategory(p => ({ ...p, name: e.target.value }))}
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px]" 
                                                placeholder="e.g. Finance"
                                            />
                                            <button 
                                                onClick={submitCategory}
                                                disabled={busy || !newCategory.name}
                                                className="rounded-xl bg-slate-900 px-4 py-2 text-[12px] font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-2 max-h-60 overflow-auto">
                                    {categories.map(c => (
                                        <div key={c.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
                                            <div className="text-[12px] font-semibold text-slate-900">{c.name}</div>
                                            <button onClick={() => deleteCategory(c.id)} className="text-red-600 hover:text-red-700 p-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                                <button onClick={() => setOpenCategoryModal(false)} className="px-4 py-2 text-[12px] font-semibold text-slate-700">Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </AdminPanelLayout>
        </>
    );
}
