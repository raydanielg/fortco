export default function SectionTitle({ eyebrow, title, description, align = 'left' }) {
    const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';

    return (
        <div className={`max-w-2xl ${alignClass}`}>
            {eyebrow ? (
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">{eyebrow}</p>
            ) : null}
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
            {description ? <p className="mt-3 text-base text-slate-600">{description}</p> : null}
        </div>
    );
}
