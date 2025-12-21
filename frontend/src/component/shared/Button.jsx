// frontend/src/component/shared/Button.jsx

import React from 'react';
import { PRIMARY_COLOR, ACCENT_COLOR } from '../../config';

const Button = ({ children, onClick, primary = true, outline = false, small = false, className = '' }) => {
    let style = '';
    
    // Note: In a production React/Tailwind setup, dynamic class names (like `text-${PRIMARY_COLOR}`) need to be explicitly listed 
    // in the `tailwind.config.js` safelist for them to work correctly. For this mockup, we'll keep the template strings.

    if (outline) {
        style = `border-2 border-${PRIMARY_COLOR} text-${PRIMARY_COLOR} hover:bg-${PRIMARY_COLOR}/10`;
    } else if (primary) {
        style = `bg-${PRIMARY_COLOR} text-white hover:bg-indigo-700 shadow-md`;
    } else {
        style = `bg-${ACCENT_COLOR} text-white hover:bg-emerald-600 shadow-md`;
    }

    const sizeClass = small ? 'px-4 py-1 text-sm' : 'px-5 py-2 font-semibold';

    return (
        <button
            onClick={onClick}
            className={`rounded-full transition duration-150 ${sizeClass} ${style} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;