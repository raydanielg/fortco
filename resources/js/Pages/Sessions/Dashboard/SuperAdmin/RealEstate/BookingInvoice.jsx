import { Head, Link } from '@inertiajs/react';

export default function BookingInvoice({ booking }) {
    const b = booking || {};
    const p = b.property || null;

    const invoiceNo = `INV-${String(b.id || '').padStart(6, '0')}`;
    const issueDate = b.created_at ? new Date(b.created_at) : null;

    const parseAmount = (value) => {
        const s = String(value || '');
        const match = s.match(/([0-9][0-9,\.]*)/);
        if (!match) return 0;
        const n = Number(String(match[1]).replace(/,/g, ''));
        return Number.isFinite(n) ? n : 0;
    };

    const baseAmount = parseAmount(p?.price || '');

    const billToRows = [
        { label: 'Customer', value: b.full_name || '-' },
        { label: 'Customer ID', value: b.id ? String(b.id) : '-' },
        { label: 'Email', value: b.email || '-' },
        { label: 'Phone', value: b.phone_number || '-' },
    ];

    const shipToRows = [
        { label: 'Recipient', value: b.full_name || '-' },
        { label: 'Property', value: p?.title || b.property_title || '-' },
        { label: 'Location', value: p?.location || '-' },
        { label: 'Price', value: p?.price || '-' },
    ];

    const items = [
        {
            qty: 1,
            item: 'VIEW',
            description: `Property viewing request${p?.title ? ` - ${p.title}` : ''}`,
            unit_price: baseAmount,
            discount: 0,
            total: baseAmount,
        },
    ];

    const subtotal = items.reduce((sum, x) => sum + (Number(x.total) || 0), 0);
    const tax = 0;
    const total = subtotal + tax;

    const money = (n) => `TZS ${Number(n || 0).toLocaleString()}`;

    return (
        <>
            <Head title={`Invoice ${invoiceNo}`} />

            <div className="min-h-screen bg-slate-100 py-10">
                <div className="mx-auto w-full max-w-[980px] px-4">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 print:hidden">
                        <Link
                            href={route('admin.real-estate.bookings.show', b.id)}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-900 hover:bg-slate-50"
                        >
                            Back
                        </Link>

                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="rounded-xl bg-slate-900 px-4 py-2 text-[12px] font-semibold text-white hover:bg-slate-800"
                        >
                            Print
                        </button>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="px-8 py-6">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 overflow-hidden rounded-xl border border-slate-200 bg-white">
                                        <img src="/logo.png" alt="" className="h-full w-full object-contain p-2" />
                                    </div>
                                    <div>
                                        <div className="text-[16px] font-black tracking-tight text-slate-900">FORTCO REAL ESTATE</div>
                                        <div className="mt-1 text-[12px] font-semibold text-slate-500">
                                            {issueDate ? issueDate.toLocaleDateString() : '-'}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-[18px] font-black text-slate-900">INVOICE</div>
                                    <div className="mt-1 text-[12px] font-semibold text-slate-500">{invoiceNo}</div>
                                </div>
                            </div>
                        </div>

                        <div className="px-8 pb-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="rounded-lg border border-slate-300">
                                    <div className="border-b border-slate-300 bg-slate-100 px-4 py-2 text-[12px] font-bold text-slate-700">Bill to</div>
                                    <div className="px-4 py-3">
                                        <table className="w-full text-[12px]">
                                            <tbody>
                                                {billToRows.map((r) => (
                                                    <tr key={r.label} className="border-b border-slate-200 last:border-b-0">
                                                        <td className="py-1 pr-3 font-semibold text-slate-600">{r.label}</td>
                                                        <td className="py-1 text-right font-semibold text-slate-900">{r.value}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-slate-300">
                                    <div className="border-b border-slate-300 bg-slate-100 px-4 py-2 text-[12px] font-bold text-slate-700">Ship to</div>
                                    <div className="px-4 py-3">
                                        <table className="w-full text-[12px]">
                                            <tbody>
                                                {shipToRows.map((r) => (
                                                    <tr key={r.label} className="border-b border-slate-200 last:border-b-0">
                                                        <td className="py-1 pr-3 font-semibold text-slate-600">{r.label}</td>
                                                        <td className="py-1 text-right font-semibold text-slate-900">{r.value}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 overflow-x-auto">
                                <table className="min-w-full border border-slate-300 text-[12px]">
                                    <thead className="bg-slate-100">
                                        <tr className="border-b border-slate-300">
                                            <th className="w-16 border-r border-slate-300 px-3 py-2 text-left font-bold text-slate-700">Qty.</th>
                                            <th className="w-24 border-r border-slate-300 px-3 py-2 text-left font-bold text-slate-700">Item#</th>
                                            <th className="border-r border-slate-300 px-3 py-2 text-left font-bold text-slate-700">Description</th>
                                            <th className="w-28 border-r border-slate-300 px-3 py-2 text-right font-bold text-slate-700">Unit price</th>
                                            <th className="w-28 border-r border-slate-300 px-3 py-2 text-right font-bold text-slate-700">Discount</th>
                                            <th className="w-28 px-3 py-2 text-right font-bold text-slate-700">Line total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((it, idx) => (
                                            <tr key={idx} className="border-b border-slate-200 last:border-b-0">
                                                <td className="border-r border-slate-200 px-3 py-2 font-semibold text-slate-900">{it.qty}</td>
                                                <td className="border-r border-slate-200 px-3 py-2 font-semibold text-slate-900">{it.item}</td>
                                                <td className="border-r border-slate-200 px-3 py-2 font-semibold text-slate-700">{it.description}</td>
                                                <td className="border-r border-slate-200 px-3 py-2 text-right font-semibold text-slate-900">{money(it.unit_price)}</td>
                                                <td className="border-r border-slate-200 px-3 py-2 text-right font-semibold text-slate-900">{money(it.discount)}</td>
                                                <td className="px-3 py-2 text-right font-semibold text-slate-900">{money(it.total)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-6 grid gap-4 md:grid-cols-[1fr,360px]">
                                <div className="rounded-lg border border-slate-300 bg-white p-4">
                                    <div className="text-[12px] font-bold text-slate-700">Short report</div>
                                    <div className="mt-2 text-[12px] font-semibold leading-relaxed text-slate-700">
                                        This invoice confirms receipt of a property viewing request. The applicant information and property summary are recorded above.
                                        Our team will review the request and contact the customer shortly.
                                    </div>
                                </div>

                                <div className="relative rounded-lg border border-slate-300 bg-white">
                                    <div className="border-b border-slate-300 bg-slate-100 px-4 py-2 text-[12px] font-bold text-slate-700">Totals</div>
                                    <div className="px-4 py-3">
                                        <div className="flex items-center justify-between py-1 text-[12px] font-semibold">
                                            <span className="text-slate-600">Subtotal</span>
                                            <span className="text-slate-900">{money(subtotal)}</span>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-slate-200 py-2 text-[12px] font-semibold">
                                            <span className="text-slate-600">Sales Tax</span>
                                            <span className="text-slate-900">{money(tax)}</span>
                                        </div>
                                        <div className="flex items-center justify-between rounded-md bg-slate-900 px-3 py-2 text-[12px] font-bold text-white">
                                            <span>Total</span>
                                            <span>{money(total)}</span>
                                        </div>
                                    </div>

                                    <div className="pointer-events-none absolute -bottom-10 -right-8 h-36 w-36 select-none">
                                        <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
                                            <defs>
                                                <filter id="stampBlur" x="-10%" y="-10%" width="120%" height="120%">
                                                    <feGaussianBlur stdDeviation="0.6" />
                                                </filter>
                                                <path id="topArc" d="M 30 105 A 70 70 0 0 1 170 105" />
                                                <path id="bottomArc" d="M 170 95 A 70 70 0 0 1 30 95" />
                                            </defs>

                                            <g opacity="0.28" filter="url(#stampBlur)">
                                                <circle cx="100" cy="100" r="86" fill="none" stroke="#0f172a" strokeWidth="6" strokeDasharray="6 6" />
                                                <circle cx="100" cy="100" r="72" fill="none" stroke="#0f172a" strokeWidth="4" />
                                                <circle cx="100" cy="100" r="50" fill="none" stroke="#0f172a" strokeWidth="2" />

                                                <text fill="#0f172a" fontSize="12" fontWeight="800" letterSpacing="2">
                                                    <textPath href="#topArc" startOffset="50%" textAnchor="middle">
                                                        OFFICIAL STAMP
                                                    </textPath>
                                                </text>
                                                <text fill="#0f172a" fontSize="10" fontWeight="800" letterSpacing="2">
                                                    <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
                                                        FORTCO REAL ESTATE
                                                    </textPath>
                                                </text>

                                                <g transform="translate(100 100)">
                                                    <rect x="-34" y="-10" width="68" height="20" rx="10" fill="#0f172a" opacity="0.10" />
                                                    <text x="0" y="4" textAnchor="middle" fontSize="10" fontWeight="900" letterSpacing="2" fill="#0f172a">
                                                        APPROVED
                                                    </text>
                                                </g>
                                            </g>
                                        </svg>

                                        <svg viewBox="0 0 220 90" className="absolute left-6 top-16 w-28 rotate-[-8deg]" aria-hidden="true">
                                            <path
                                                d="M10,60 C30,20 45,75 65,40 C80,18 98,72 118,38 C132,15 150,58 168,30 C182,10 196,40 210,22"
                                                fill="none"
                                                stroke="#0f172a"
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                opacity="0.25"
                                            />
                                            <path
                                                d="M25,70 C55,55 85,65 115,58 C145,50 175,55 205,48"
                                                fill="none"
                                                stroke="#0f172a"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                opacity="0.18"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 text-[12px] font-bold text-slate-700">Thank you for your business!</div>
                            <div className="mt-2 text-[11px] font-semibold text-slate-500">
                                Fortco Real Estate · {b.email || 'info@fortco.local'} · {b.phone_number || ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
