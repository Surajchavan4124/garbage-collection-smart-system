// frontend/src/component/Navbar.jsx

import React, { useState, useEffect } from 'react';
import { ChevronDown, Trash2, Menu, X as Close } from 'lucide-react';
import Button from './shared/Button';
import { PRIMARY_COLOR, quickLinks } from '../config';

const Navbar = ({ currentPage, navigate }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [dropdownTimeout, setDropdownTimeout] = useState(null);

    const navItems = [
        { name: 'Home', view: 'home' },
        { name: 'About', view: 'about' },
        { name: 'Contact', view: 'contact' },
    ];

    const getLinkClass = (view) =>
        currentPage === view ? `text-${PRIMARY_COLOR} font-semibold border-b-2 border-${PRIMARY_COLOR} pb-1` : 'text-gray-600 hover:text-indigo-600';

    const handleQuickLinkClick = (view) => {
        navigate(view);
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
    }

    const handleMouseEnter = () => {
        if (dropdownTimeout) {
            clearTimeout(dropdownTimeout);
        }
        setIsDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        const timeout = setTimeout(() => {
            setIsDropdownOpen(false);
        }, 150);
        setDropdownTimeout(timeout);
    };

    useEffect(() => {
        return () => {
            if (dropdownTimeout) clearTimeout(dropdownTimeout);
        };
    }, [dropdownTimeout]);

    return (
        <header className="sticky top-0 left-0 w-full bg-white shadow-lg z-20 h-20 flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between w-full">
                {/* Logo/Title */}
                <div className="flex-shrink-0">
                    <button onClick={() => navigate('home')} className={`text-xl font-bold text-gray-800 hover:text-${PRIMARY_COLOR} transition duration-150 flex items-center`}>
                        <Trash2 className={`w-6 h-6 mr-2 text-${PRIMARY_COLOR}`} />
                        <span className="hidden sm:inline">Door-to-Door Garbage Collection</span>
                        <span className="sm:hidden">D2D Collection</span>
                    </button>
                </div>

                {/* Navigation Links (Desktop) */}
                <nav className="hidden md:flex flex-grow justify-center">
                    <div className="space-x-8 flex items-center">
                        {navItems.map(item => (
                            <button
                                key={item.name}
                                onClick={() => navigate(item.view)}
                                className={getLinkClass(item.view)}
                            >
                                {item.name}
                            </button>
                        ))}

                        {/* Quick Links Dropdown */}
                        <div
                            className="relative inline-block"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <button className={`text-gray-600 hover:text-${PRIMARY_COLOR} transition duration-150 flex items-center focus:outline-none`}>
                                Quick Links
                                <ChevronDown className="ml-1 w-4 h-4" />
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white shadow-2xl rounded-lg mt-3 py-2 w-56 z-30 transition duration-300 origin-top">
                                    {quickLinks.map(link => (
                                        <button
                                            key={link.name}
                                            onClick={() => handleQuickLinkClick(link.view)}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            {link.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Action Buttons & Mobile Menu Toggle */}
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => navigate('login')}
                        className={`text-sm bg-green-400 hover:bg-green-500 text-white px-5 py-2 rounded-full shadow-md transition`}
                    >
                        Login
                    </button>

                    <Button
                        onClick={() => navigate('registration')}
                        outline={true}
                        primary={false}
                        className="hidden sm:block text-sm bg-green-400 text-white hover:bg-green-500"
                    >
                        Register
                    </Button>
                    
                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden p-2 text-gray-600 hover:text-indigo-600"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <Close className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-white shadow-xl md:hidden pb-4 z-10">
                    {navItems.map(item => (
                        <button
                            key={item.name}
                            onClick={() => { navigate(item.view); setIsMobileMenuOpen(false); }}
                            className={`block w-full text-left px-6 py-3 text-gray-700 hover:bg-gray-100 ${getLinkClass(item.view)}`}
                        >
                            {item.name}
                        </button>
                    ))}
                    <div className="px-6 py-2 font-semibold text-gray-800 border-t mt-2">Quick Links</div>
                    {quickLinks.map(link => (
                        <button
                            key={link.name}
                            onClick={() => handleQuickLinkClick(link.view)}
                            className="block w-full text-left pl-10 pr-6 py-2 text-sm text-gray-600 hover:bg-gray-50"
                        >
                            {link.name}
                        </button>
                    ))}
                    <div className="px-6 pt-4 border-t mt-2">
                        <Button onClick={() => { navigate('registration'); setIsMobileMenuOpen(false); }} outline={true} primary={false} className="w-full">
                            Register
                        </Button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;