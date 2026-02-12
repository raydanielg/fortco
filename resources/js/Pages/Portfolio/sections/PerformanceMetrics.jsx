import { useMemo, useState } from 'react';
import { CalendarDaysIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

export default function PerformanceMetrics() {
    const rows = [
        ['Projects Completed', '8', '12', '15', '18'],
        ['Value Delivered (TZS)', '6.2B', '8.5B', '12.1B', '15.8B'],
        ['Client Satisfaction', '94%', '96%', '97%', '98%'],
        ['On-Time Delivery', '92%', '94%', '95%', '96%'],
        ['Safety Incidents', '2', '1', '0', '0'],
    ];

    const years = useMemo(() => ['2022', '2023', '2024', '2025'], []);
    const [selectedYear, setSelectedYear] = useState('All');

    const headers = useMemo(() => {
        if (selectedYear === 'All') return ['Metric', ...years];
        return ['Metric', selectedYear];
    }, [selectedYear, years]);

    const visibleRows = useMemo(() => {
        if (selectedYear === 'All') return rows;
        const yearIndex = years.indexOf(selectedYear);
        return rows.map((r) => [r[0], r[yearIndex + 1]]);
    }, [rows, selectedYear, years]);

    return (
        <section id="performance-metrics" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Performance metrics</div>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Measured delivery outcomes</h2>
            <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600">
                We track delivery performance and continuously improve quality, safety, and client experience.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm font-semibold text-slate-600">
                    Showing: <span className="font-black text-slate-900">{selectedYear === 'All' ? 'All years' : selectedYear}</span>
                </div>

                <div className="relative w-full sm:w-auto">
                    <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="w-full appearance-none rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm font-extrabold tracking-wide text-slate-900 shadow-sm transition focus:border-primary-300 focus:ring-2 focus:ring-primary-200 sm:w-56"
                        aria-label="Select year"
                    >
                        <option value="All">All years</option>
                        {years
                            .slice()
                            .reverse()
                            .map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                    </select>
                </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                {headers.map((h) => (
                                    <th
                                        key={h}
                                        className="px-5 py-4 text-xs font-extrabold uppercase tracking-widest text-slate-600"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {visibleRows.map((r) => (
                                <tr key={r[0]} className="hover:bg-slate-50">
                                    {r.map((cell, idx) => (
                                        <td
                                            key={idx}
                                            className={
                                                (idx === 0
                                                    ? 'text-slate-900 font-extrabold'
                                                    : 'text-slate-700 font-semibold') + ' px-5 py-4'
                                            }
                                        >
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
