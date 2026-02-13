import RealEstatePanelLayout from '@/Layouts/RealEstatePanelLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

export default function Properties() {
    const [tab, setTab] = useState('all');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');

    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [categoryName, setCategoryName] = useState('');

    const [form, setForm] = useState({
        title: '',
        category_id: '',
        type: 'House',
        status: 'For Sale',
        location: '',
        price: '',
        beds: '',
        baths: '',
        size: '',
        image: '',
        featured: false,
        description: '',
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    const [openMenuId, setOpenMenuId] = useState(null);

    const csrf = () => document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    const readJson = async (r) => {
        const text = await r.text();
        try {
            return text ? JSON.parse(text) : {};
        } catch (e) {
            return {};
        }
    };

    const navItems = useMemo(
        () => [
            { key: 'properties', label: 'Properties', href: route('admin.real-estate.properties') },
            { key: 'bookings', label: 'Bookings', href: route('admin.real-estate.bookings') },
            { key: 'clients', label: 'Clients', href: route('admin.real-estate.clients') },
        ],
        []
    );

    const typeOptions = useMemo(() => ['House', 'Apartment', 'Plot/Land', 'Commercial', 'Rental'], []);
    const statusOptions = useMemo(() => ['For Sale', 'For Rent', 'For Lease'], []);

    const fetchCategories = () => {
        setCategoriesLoading(true);
        setError('');
        fetch(route('admin.real-estate.property-categories.data'), {
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to load categories');
                setCategories(Array.isArray(json?.categories) ? json.categories : []);
            })
            .catch((e) => setError(e?.message || 'Failed to load categories'))
            .finally(() => setCategoriesLoading(false));
    };

    const fetchItems = () => {
        setLoading(true);
        setError('');
        const url = new URL(route('admin.real-estate.properties.data'));
        if (query.trim()) url.searchParams.set('q', query.trim());

        fetch(url.toString(), {
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json' },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to load properties');
                setItems(Array.isArray(json?.properties) ? json.properties : []);
            })
            .catch((e) => setError(e?.message || 'Failed to load properties'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchItems();
        fetchCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submit = () => {
        if (!form.title.trim()) {
            setError('Title is required');
            setTab('create');
            return;
        }

        setBusy(true);
        setError('');
        const fd = new FormData();
        fd.append('title', form.title);
        if (form.category_id) fd.append('category_id', String(form.category_id));
        fd.append('type', form.type);
        fd.append('status', form.status);
        if (form.location) fd.append('location', form.location);
        if (form.price) fd.append('price', form.price);
        if (form.beds !== '') fd.append('beds', String(form.beds));
        if (form.baths !== '') fd.append('baths', String(form.baths));
        if (form.size) fd.append('size', form.size);
        if (form.description) fd.append('description', form.description);
        fd.append('featured', form.featured ? '1' : '0');
        if (imageFile) fd.append('image_file', imageFile);

        fetch(route('admin.real-estate.properties.store'), {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                Accept: 'application/json',
                'X-CSRF-TOKEN': csrf(),
            },
            body: fd,
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to create property');
                setForm({
                    title: '',
                    category_id: '',
                    type: 'House',
                    status: 'For Sale',
                    location: '',
                    price: '',
                    beds: '',
                    baths: '',
                    size: '',
                    image: '',
                    featured: false,
                    description: '',
                });
                setImageFile(null);
                setImagePreview('');
                setTab('all');
                fetchItems();
            })
            .catch((e) => setError(e?.message || 'Failed to create property'))
            .finally(() => setBusy(false));
    };

    const remove = (id) => {
        if (!confirm('Delete this property?')) return;
        setBusy(true);
        setError('');
        fetch(route('admin.real-estate.properties.destroy', id), {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json', 'X-CSRF-TOKEN': csrf() },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to delete property');
                fetchItems();
            })
            .catch((e) => setError(e?.message || 'Failed to delete property'))
            .finally(() => setBusy(false));
    };

    const createCategory = () => {
        if (!categoryName.trim()) {
            setError('Category name is required');
            setTab('categories');
            return;
        }

        setBusy(true);
        setError('');
        fetch(route('admin.real-estate.property-categories.store'), {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf(),
            },
            body: JSON.stringify({ name: categoryName.trim() }),
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to create category');
                setCategoryName('');
                fetchCategories();
            })
            .catch((e) => setError(e?.message || 'Failed to create category'))
            .finally(() => setBusy(false));
    };

    const deleteCategory = (id) => {
        if (!confirm('Delete this category?')) return;
        setBusy(true);
        setError('');
        fetch(route('admin.real-estate.property-categories.destroy', id), {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: { 'X-Requested-With': 'XMLHttpRequest', Accept: 'application/json', 'X-CSRF-TOKEN': csrf() },
        })
            .then(async (r) => {
                const json = await readJson(r);
                if (!r.ok) throw new Error(json?.message || 'Failed to delete category');
                fetchCategories();
                fetchItems();
            })
            .catch((e) => setError(e?.message || 'Failed to delete category'))
            .finally(() => setBusy(false));
    };

    return (
        <RealEstatePanelLayout
            title="Real Estate"
            active="properties"
            items={navItems}
        >
            <Head title="Real Estate - Properties" />

            <div className="border-b border-slate-200 px-6 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <div className="text-sm font-semibold text-slate-900">Properties</div>
                        <div className="mt-1 text-[12px] text-slate-500">Manage your property listings.</div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setTab('all')}
                            className={
                                'rounded-xl px-4 py-2 text-[12px] font-semibold ' +
                                (tab === 'all' ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50')
                            }
                        >
                            All Properties
                        </button>
                        <button
                            type="button"
                            onClick={() => setTab('create')}
                            className={
                                'rounded-xl px-4 py-2 text-[12px] font-semibold ' +
                                (tab === 'create' ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50')
                            }
                        >
                            Create
                        </button>
                        <button
                            type="button"
                            onClick={() => setTab('categories')}
                            className={
                                'rounded-xl px-4 py-2 text-[12px] font-semibold ' +
                                (tab === 'categories'
                                    ? 'bg-slate-900 text-white'
                                    : 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50')
                            }
                        >
                            Categories
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {error ? (
                    <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[12px] text-rose-700">{error}</div>
                ) : null}

                {tab === 'all' ? (
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
                            <div className="text-[12px] font-semibold text-slate-900">All properties</div>
                            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                                <div className="relative w-full sm:w-80">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M21 21l-4.3-4.3m1.8-4.7a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 pl-9 text-[12px]"
                                        placeholder="Search title, type, status, location"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={fetchItems}
                                    disabled={loading}
                                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
                                >
                                    Search
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-[12px]">
                                <thead className="bg-white">
                                    <tr className="border-b border-slate-200">
                                        <th className="px-4 py-3 font-semibold text-slate-700">Image</th>
                                        <th className="px-4 py-3 font-semibold text-slate-700">Title</th>
                                        <th className="px-4 py-3 font-semibold text-slate-700">Type</th>
                                        <th className="px-4 py-3 font-semibold text-slate-700">Status</th>
                                        <th className="px-4 py-3 font-semibold text-slate-700">Location</th>
                                        <th className="px-4 py-3 font-semibold text-slate-700">Price</th>
                                        <th className="px-4 py-3 font-semibold text-slate-700">Category</th>
                                        <th className="px-4 py-3 font-semibold text-slate-700">Featured</th>
                                        <th className="px-4 py-3 font-semibold text-slate-700" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        Array.from({ length: 6 }).map((_, i) => (
                                            <tr key={i} className="border-b border-slate-100">
                                                <td className="px-4 py-3" colSpan={9}>
                                                    <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                                                </td>
                                            </tr>
                                        ))
                                    ) : items.length ? (
                                        items.map((p) => (
                                            <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                                                <td className="px-4 py-3">
                                                    {p.image ? (
                                                        <img src={p.image} alt="" className="h-9 w-12 rounded-lg border border-slate-200 object-cover" />
                                                    ) : (
                                                        <div className="h-9 w-12 rounded-lg border border-slate-200 bg-slate-50" />
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 font-semibold text-slate-900">{p.title}</td>
                                                <td className="px-4 py-3 text-slate-700">{p.type}</td>
                                                <td className="px-4 py-3 text-slate-700">{p.status}</td>
                                                <td className="px-4 py-3 text-slate-700">{p.location || '-'}</td>
                                                <td className="px-4 py-3 text-slate-700">{p.price || '-'}</td>
                                                <td className="px-4 py-3 text-slate-700">{p.category?.name || '-'}</td>
                                                <td className="px-4 py-3 text-slate-700">{p.featured ? 'Yes' : 'No'}</td>
                                                <td className="relative px-4 py-3 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => setOpenMenuId(openMenuId === p.id ? null : p.id)}
                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
                                                    >
                                                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M12 6.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM12 13.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM12 20.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
                                                            />
                                                        </svg>
                                                    </button>

                                                    {openMenuId === p.id ? (
                                                        <div className="absolute right-4 top-12 z-20 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setOpenMenuId(null);
                                                                    alert('Coming soon');
                                                                }}
                                                                className="block w-full px-4 py-2 text-left text-[12px] hover:bg-slate-50"
                                                            >
                                                                View
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setOpenMenuId(null);
                                                                    remove(p.id);
                                                                }}
                                                                className="block w-full px-4 py-2 text-left text-[12px] text-rose-700 hover:bg-rose-50"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    ) : null}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td className="px-4 py-8 text-center text-slate-500" colSpan={9}>
                                                No properties found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : null}

                {tab === 'create' ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="grid gap-4 lg:grid-cols-2">
                            <div className="lg:col-span-2">
                                <div className="text-[12px] font-semibold text-slate-900">Property details</div>
                                <div className="mt-1 text-[12px] text-slate-500">Fields marked with * are required.</div>
                            </div>

                            <div>
                                <label className="text-[12px] font-semibold text-slate-700">
                                    Title <span className="text-rose-600">*</span>
                                </label>
                                <input
                                    value={form.title}
                                    onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                    placeholder="e.g. Modern Family House in Mikocheni"
                                />
                            </div>

                            <div>
                                <label className="text-[12px] font-semibold text-slate-700">Category</label>
                                <select
                                    value={form.category_id}
                                    onChange={(e) => setForm((s) => ({ ...s, category_id: e.target.value }))}
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                >
                                    <option value="">None</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-[12px] font-semibold text-slate-700">
                                    Type <span className="text-rose-600">*</span>
                                </label>
                                <select
                                    value={form.type}
                                    onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))}
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                >
                                    {typeOptions.map((t) => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-[12px] font-semibold text-slate-700">
                                    Status <span className="text-rose-600">*</span>
                                </label>
                                <select
                                    value={form.status}
                                    onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))}
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                >
                                    {statusOptions.map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-[12px] font-semibold text-slate-700">Location</label>
                                <input
                                    value={form.location}
                                    onChange={(e) => setForm((s) => ({ ...s, location: e.target.value }))}
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                    placeholder="e.g. Dar es Salaam"
                                />
                            </div>

                            <div>
                                <label className="text-[12px] font-semibold text-slate-700">Price</label>
                                <input
                                    value={form.price}
                                    onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))}
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                    placeholder="e.g. TZS 480,000,000"
                                />
                            </div>

                            <div>
                                <label className="text-[12px] font-semibold text-slate-700">Beds</label>
                                <input
                                    value={form.beds}
                                    onChange={(e) => setForm((s) => ({ ...s, beds: e.target.value }))}
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                    inputMode="numeric"
                                    placeholder="e.g. 4"
                                />
                            </div>

                            <div>
                                <label className="text-[12px] font-semibold text-slate-700">Baths</label>
                                <input
                                    value={form.baths}
                                    onChange={(e) => setForm((s) => ({ ...s, baths: e.target.value }))}
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                    inputMode="numeric"
                                    placeholder="e.g. 3"
                                />
                            </div>

                            <div>
                                <label className="text-[12px] font-semibold text-slate-700">Size</label>
                                <input
                                    value={form.size}
                                    onChange={(e) => setForm((s) => ({ ...s, size: e.target.value }))}
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                    placeholder="e.g. 320 m²"
                                />
                            </div>

                            <div>
                                <label className="text-[12px] font-semibold text-slate-700">Image URL</label>
                                <input
                                    value={form.image}
                                    onChange={(e) => setForm((s) => ({ ...s, image: e.target.value }))}
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                    placeholder="e.g. /slides/beautiful-view...jpg"
                                />
                            </div>

                            <div>
                                <label className="text-[12px] font-semibold text-slate-700">Upload image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0] || null;
                                        setImageFile(f);
                                        setImagePreview(f ? URL.createObjectURL(f) : '');
                                    }}
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                />
                                {imagePreview ? (
                                    <div className="mt-2">
                                        <img src={imagePreview} alt="" className="h-28 w-full rounded-xl border border-slate-200 object-cover" />
                                    </div>
                                ) : null}
                            </div>

                            <div className="flex items-center gap-2 pt-6">
                                <input
                                    id="featured"
                                    type="checkbox"
                                    checked={!!form.featured}
                                    onChange={(e) => setForm((s) => ({ ...s, featured: e.target.checked }))}
                                    className="h-4 w-4 rounded border-slate-300 text-slate-900"
                                />
                                <label htmlFor="featured" className="text-[12px] font-semibold text-slate-700">
                                    Featured
                                </label>
                            </div>

                            <div className="lg:col-span-2">
                                <label className="text-[12px] font-semibold text-slate-700">Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                                    rows={4}
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                    placeholder="Short description..."
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setError('');
                                    setTab('all');
                                }}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-900 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={submit}
                                disabled={busy}
                                className="rounded-xl bg-slate-900 px-4 py-2 text-[12px] font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                            >
                                {busy ? 'Saving...' : 'Save Property'}
                            </button>
                        </div>
                    </div>
                ) : null}

                {tab === 'categories' ? (
                    <div className="grid gap-4 lg:grid-cols-[1fr,360px]">
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                                <div className="text-[12px] font-semibold text-slate-900">All categories</div>
                            </div>

                            <div className="divide-y divide-slate-100">
                                {categoriesLoading ? (
                                    Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="px-4 py-3">
                                            <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                                        </div>
                                    ))
                                ) : categories.length ? (
                                    categories.map((c) => (
                                        <div key={c.id} className="flex items-center justify-between gap-3 px-4 py-3">
                                            <div className="text-[12px] font-semibold text-slate-900">{c.name}</div>
                                            <button
                                                type="button"
                                                onClick={() => deleteCategory(c.id)}
                                                disabled={busy}
                                                className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-[12px] font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-8 text-center text-[12px] text-slate-500">No categories yet</div>
                                )}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="text-[12px] font-semibold text-slate-900">Create category</div>
                            <div className="mt-4">
                                <label className="text-[12px] font-semibold text-slate-700">
                                    Name <span className="text-rose-600">*</span>
                                </label>
                                <input
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px]"
                                    placeholder="e.g. Residential"
                                />
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    type="button"
                                    onClick={createCategory}
                                    disabled={busy}
                                    className="rounded-xl bg-slate-900 px-4 py-2 text-[12px] font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                                >
                                    {busy ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </RealEstatePanelLayout>
    );
}
