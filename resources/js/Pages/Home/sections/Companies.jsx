import Container from '../components/Container';

export default function Companies() {
    const companies = ['Developers', 'Brokers', 'Consultants', 'Contractors', 'Investors', 'Partners'];

    return (
        <section className="bg-sand-50 py-14">
            <Container>
                <div className="relative overflow-hidden rounded-3xl border border-black/5 bg-white/70 p-6 shadow-sm backdrop-blur md:p-8">
                    <div className="absolute inset-0 bg-[radial-gradient(30rem_30rem_at_top,theme(colors.sand.200),transparent)] opacity-60" />

                    <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-black/70">
                                Trusted by teams
                            </div>
                            <div className="mt-3 text-lg font-black tracking-tight text-slate-900">
                                Built to support companies of different sizes.
                            </div>
                            <div className="mt-2 text-sm font-medium text-slate-600">
                                Developers, brokers, consultants and partners use Fortco every day.
                            </div>
                        </div>

                        <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 md:w-auto md:grid-cols-3 lg:grid-cols-6">
                            {companies.map((c) => (
                                <div
                                    key={c}
                                    className="flex items-center justify-center rounded-full border border-black/10 bg-white/80 px-4 py-2 text-[11px] font-extrabold uppercase tracking-widest text-black/70 shadow-sm transition hover:bg-white"
                                >
                                    {c}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
