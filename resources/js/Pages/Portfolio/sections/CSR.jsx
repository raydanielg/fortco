import AnimatedIcon from '../../../Components/AnimatedIcon';
import heart from 'react-useanimations/lib/heart';
import userPlus from 'react-useanimations/lib/userPlus';
import alertCircle from 'react-useanimations/lib/alertCircle';
import activity from 'react-useanimations/lib/activity';

export default function CSR() {
    const items = [
        {
            title: 'Mbuyuni Primary School Renovation (2025)',
            desc: 'We renovated 3 classroom blocks, provided new desks, and installed a borehole water system benefiting 450 students.',
            animation: heart,
        },
        {
            title: 'Women in Construction (2024)',
            desc: 'Trained 50 women in masonry and tiling skills. 35 graduates are now employed on our construction sites.',
            animation: userPlus,
        },
        {
            title: 'COVID-19 Response (2020–2021)',
            desc: 'Donated handwashing stations and sanitizers to 15 public schools in Mwanza region.',
            animation: alertCircle,
        },
        {
            title: 'Youth Internship Program (Annual)',
            desc: '20 university students placed annually for 6-month paid internships.',
            animation: activity,
        },
    ];

    return (
        <section id="csr" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Corporate social responsibility</div>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Building beyond construction</h2>
            <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600">
                We invest in community impact programs that improve livelihoods, expand skills, and strengthen resilience.
            </p>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
                {items.map((x) => (
                    <div
                        key={x.title}
                        className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 shadow-sm ring-1 ring-primary-100">
                                <AnimatedIcon
                                    animation={x.animation}
                                    size={26}
                                    strokeColor="#2563eb"
                                    autoplay
                                    loop
                                    speed={0.65}
                                />
                            </div>
                            <div>
                                <h3 className="text-base font-black tracking-tight text-slate-900">{x.title}</h3>
                                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">{x.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
