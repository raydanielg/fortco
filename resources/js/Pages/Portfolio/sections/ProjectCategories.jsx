import { useMemo, useState } from 'react';

import AnimatedIcon from '../../../Components/AnimatedIcon';
import home from 'react-useanimations/lib/home';
import settings from 'react-useanimations/lib/settings';
import activity from 'react-useanimations/lib/activity';
import calendar from 'react-useanimations/lib/calendar';

function Table({ columns, rows }) {
    const renderCell = (cell, idx, row) => {
        const isStatus = idx === columns.length - 1;
        if (!isStatus) return cell;
        return <span className="text-sm font-extrabold uppercase tracking-widest text-slate-600">{cell}</span>;
    };

    return (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50">
                        <tr>
                            {columns.map((c) => (
                                <th key={c} className="px-5 py-4 text-xs font-extrabold uppercase tracking-widest text-slate-600">
                                    {c}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {rows.map((r, rowIdx) => (
                            <tr
                                key={`${r[0]}-${r[1]}`}
                                className={
                                    (rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40') +
                                    ' hover:bg-slate-50 transition-colors'
                                }
                            >
                                {r.map((cell, idx) => (
                                    <td
                                        key={idx}
                                        className={
                                            (idx === 0
                                                ? 'text-slate-900 font-extrabold'
                                                : idx === columns.length - 1
                                                  ? 'text-right'
                                                  : 'text-slate-700 font-semibold') +
                                            ' px-5 py-4'
                                        }
                                    >
                                        {renderCell(cell, idx, r)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function ProjectCategories() {
    const data = useMemo(
        () => ({
            Residential: {
                columns: ['Project', 'Location', 'Units', 'Status'],
                rows: [
                    ['Edmark Estate', 'Kigamboni', '25 Villas', 'Completed'],
                    ['Mbuyuni Villas', 'Mwanza', '12 Villas', 'Completed'],
                    ['Lakeview Estate', 'Ilemela', '50 Villas', 'Ongoing'],
                    ['Teachers Housing', 'Mwanza', '60 Units', 'Completed'],
                    ['Kilimanjaro Apartments', 'Arusha', '40 Units', 'Completed'],
                ],
                animation: home,
            },
            Commercial: {
                columns: ['Project', 'Location', 'Floors', 'Status'],
                rows: [
                    ['Nyerere Plaza', 'Mwanza', '7', 'Completed'],
                    ['Victoria Tower', 'Mwanza', '5', 'Completed'],
                    ['Kariakoo Warehouse', 'Dar', '1', 'Completed'],
                    ['Dodoma Business Centre', 'Dodoma', '4', 'Ongoing'],
                ],
                animation: settings,
            },
            Hospitality: {
                columns: ['Project', 'Location', 'Rooms', 'Status'],
                rows: [
                    ['Beach Plaza', 'Kunduchi', '50', 'Completed'],
                    ['Zanzibar Village', 'Nungwi', '80', 'Ongoing'],
                    ['Lake Resort', 'Mwanza', '40', 'Planned'],
                ],
                animation: calendar,
            },
            Industrial: {
                columns: ['Project', 'Location', 'Sq Meters', 'Status'],
                rows: [
                    ['Kariakoo Warehouse', 'Dar', '2,500', 'Completed'],
                    ['NIDA Warehousing', 'Mwanza', '3,200', 'Ongoing'],
                ],
                animation: activity,
            },
        }),
        []
    );

    const tabs = Object.keys(data);
    const [active, setActive] = useState(tabs[0]);

    return (
        <section id="project-categories" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Project categories</div>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Organized by sector</h2>
            <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600">
                A structured view of delivery across residential, commercial, hospitality, and industrial work.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
                {tabs.map((t) => {
                    const isActive = active === t;
                    return (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setActive(t)}
                            className={
                                'group inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-widest transition ' +
                                (isActive
                                    ? 'bg-slate-900 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200')
                            }
                        >
                            <span
                                className={
                                    'flex h-7 w-7 items-center justify-center rounded-full ring-1 transition ' +
                                    (isActive
                                        ? 'bg-white/10 ring-white/15'
                                        : 'bg-white ring-slate-200 group-hover:ring-slate-300')
                                }
                            >
                                <AnimatedIcon
                                    animation={data[t].animation}
                                    size={18}
                                    strokeColor={isActive ? '#ffffff' : '#0f172a'}
                                    autoplay={isActive}
                                    loop={isActive}
                                    speed={0.65}
                                />
                            </span>
                            {t}
                        </button>
                    );
                })}
            </div>

            <div className="mt-6">
                <Table columns={data[active].columns} rows={data[active].rows} />
            </div>
        </section>
    );
}
