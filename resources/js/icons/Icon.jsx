import icons from './icons.json';

export default function Icon({ name, className = '', title }) {
    const icon = icons?.[name];

    if (!icon) {
        return null;
    }

    return (
        <svg
            className={className}
            viewBox={icon.viewBox}
            fill="currentColor"
            aria-hidden={title ? undefined : true}
            role={title ? 'img' : undefined}
        >
            {title ? <title>{title}</title> : null}
            {icon.paths.map((p, idx) => (
                <path
                    // eslint-disable-next-line react/no-array-index-key
                    key={idx}
                    d={p.d}
                    fillRule={p.fillRule}
                    clipRule={p.clipRule}
                />
            ))}
        </svg>
    );
}
