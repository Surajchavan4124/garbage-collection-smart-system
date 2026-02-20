import React from 'react';

const Button = ({
    children,
    onClick,
    primary = true,
    outline = false,
    small = false,
    className = '',
}) => {

    const base =
        'inline-flex items-center justify-center rounded-full transition duration-150 focus:outline-none';

    const sizeClass = small
        ? 'px-4 py-1 text-sm'
        : 'px-5 py-2 font-semibold';

    let variant = '';

    if (outline) {
        variant =
            'border-2 border-green-700 text-green-700 hover:bg-green-700/10';
    } else if (primary) {
        variant =
            'bg-green-700 text-white hover:bg-green-800 shadow-md';
    } else {
        variant =
            'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md';
    }

    return (
        <button
            onClick={onClick}
            className={`${base} ${sizeClass} ${variant} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;
