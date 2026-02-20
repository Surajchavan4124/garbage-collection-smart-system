import React, { useState, useEffect } from 'react';
import { ChevronDown, Trash2, Menu, X as Close } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './shared/Button';
import { quickLinks } from '../config';

const Navbar = ({ currentPage, navigate }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [dropdownTimeout, setDropdownTimeout] = useState(null);

    // NEW STATES
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    const navItems = [
        { name: 'Home', view: 'home' },
        { name: 'About', view: 'about' },
        { name: 'Contact', view: 'contact' },
    ];

    const handleQuickLinkClick = (view) => {
        navigate(view);
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
    };

    const handleMouseEnter = () => {
        if (dropdownTimeout) clearTimeout(dropdownTimeout);
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

    const DropdownItem = ({ label, onClick }) => (
        <button
            onClick={onClick}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
            {label}
        </button>
    );

    return (
        <header className="sticky top-0 left-0 w-full bg-white shadow-lg z-50 h-20 flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between w-full">

                {/* LOGO */}
                <button
                    onClick={() => navigate('home')}
                    className="flex items-center text-xl font-bold text-gray-800"
                >
                    <Trash2 className="w-6 h-6 mr-2 text-green-600" />
                    <span className="hidden sm:inline">Door-to-Door Garbage Collection</span>
                    <span className="sm:hidden">D2D Collection</span>
                </button>

                {/* DESKTOP NAV */}
                <nav className="hidden md:flex flex-grow justify-center">
                    <div className="relative flex items-center gap-10">

                        {navItems.map((item) => (
                            <button
                                key={item.view}
                                onClick={() => navigate(item.view)}
                                className="relative pb-2 text-gray-700 font-medium hover:text-green-600"
                            >
                                {item.name}
                                {currentPage === item.view && (
                                    <motion.span
                                        layoutId="navbar-underline"
                                        className="absolute left-0 right-0 -bottom-1 h-[2px] bg-green-600 rounded"
                                    />
                                )}
                            </button>
                        ))}

                        {/* QUICK LINKS */}
                        <div
                            className="relative"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <button className="flex items-center text-gray-700 font-medium hover:text-green-600">
                                Quick Links <ChevronDown className="ml-1 w-4 h-4" />
                            </button>

                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white shadow-2xl rounded-lg py-2 w-56"
                                >
                                    {quickLinks.map((link) => (
                                        <DropdownItem
                                            key={link.name}
                                            label={link.name}
                                            onClick={() => handleQuickLinkClick(link.view)}
                                        />
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </nav>

                {/* ACTION BUTTONS */}
                <div className="relative flex items-center space-x-3">

                    {/* LOGIN DROPDOWN */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setIsLoginOpen(!isLoginOpen);
                                setIsRegisterOpen(false);
                            }}
                            className="flex items-center text-sm bg-green-400 hover:bg-green-500 text-white px-5 py-2 rounded-full shadow"
                        >
                            Login <ChevronDown className="ml-1 w-4 h-4" />
                        </button>

                        {isLoginOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white shadow-xl rounded-lg overflow-hidden">
                                <DropdownItem
                                    label="Household"
                                    onClick={() => navigate('login-household')}
                                />
                                <DropdownItem
                                    label="Company"
                                    onClick={() => navigate('login-company')}
                                />
                            </div>
                        )}
                    </div>

                    {/* REGISTER DROPDOWN */}
                    <div className="relative hidden sm:block">
                        <Button
                            outline
                            className="flex items-center gap-1"
                            onClick={() => {
                                setIsRegisterOpen(!isRegisterOpen);
                                setIsLoginOpen(false);
                            }}
                        >
                            Register <ChevronDown className="w-4 h-4" />
                        </Button>

                        {isRegisterOpen && (
                            <div className="absolute right-0 mt-2 w-44 bg-white shadow-xl rounded-lg overflow-hidden">
                                <DropdownItem
                                    label="Household"
                                    onClick={() => navigate('registration-household')}
                                />
                                <DropdownItem
                                    label="Company"
                                    onClick={() => navigate('registration-company')}
                                />
                            </div>
                        )}
                    </div>

                    {/* MOBILE TOGGLE */}
                    <button
                        className="md:hidden p-2 text-gray-600"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <Close /> : <Menu />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
