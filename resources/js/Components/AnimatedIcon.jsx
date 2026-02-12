import UseAnimations from 'react-useanimations';

export default function AnimatedIcon({ animation, size = 24, strokeColor = 'inherit', fillColor = '', className = '', wrapperStyle = {}, ...props }) {
    return (
        <span className={className} style={wrapperStyle}>
            <UseAnimations
                animation={animation}
                size={size}
                strokeColor={strokeColor}
                fillColor={fillColor}
                {...props}
            />
        </span>
    );
}
