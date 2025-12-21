// frontend/src/component/shared/Footer.jsx

import React from 'react';
import { PRIMARY_COLOR } from '../../config';

const Footer = () => (
    <footer className="bg-white border-t border-gray-100 py-4 mt-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-gray-500 text-xs">
            <p className="flex items-center mb-2 sm:mb-0">
                <span className={`mr-1 text-base text-${PRIMARY_COLOR}`}>★</span>
                Made with Whimsical (Concept Mockup)
            </p>
            <p className="text-center sm:text-right">&copy; 2025 Door-to-Door Garbage Collection</p>
        </div>
    </footer>
);

export default Footer;