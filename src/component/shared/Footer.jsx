// frontend/src/component/shared/Footer.jsx

import React from 'react';
import { Trash2, Phone, Mail, MapPin, Facebook, Twitter, Linkedin } from 'lucide-react';
import { quickLinks } from '../../config';

const Footer = ({ navigate }) => {
    const handleQuickLinkClick = (view) => {
        if (navigate) navigate(view);
    };

    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    
                    {/* Brand Section */}
                    <div className="col-span-1">
                        <div className="flex items-center mb-4">
                            <Trash2 className="w-6 h-6 mr-2 text-green-500" />
                            <span className="text-white font-bold text-lg">D2D Collection</span>
                        </div>
                        <p className="text-sm mb-4">
                            Smart door-to-door garbage collection system for a cleaner and greener future.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-green-500 hover:text-green-400 transition">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-green-500 hover:text-green-400 transition">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-green-500 hover:text-green-400 transition">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><button onClick={() => handleQuickLinkClick('home')} className="hover:text-green-500 transition text-sm">Home</button></li>
                            <li><button onClick={() => handleQuickLinkClick('about')} className="hover:text-green-500 transition text-sm">About</button></li>
                            <li><button onClick={() => handleQuickLinkClick('contact')} className="hover:text-green-500 transition text-sm">Contact</button></li>
                            <li><button onClick={() => handleQuickLinkClick('complaint')} className="hover:text-green-500 transition text-sm">Complaint</button></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Resources</h3>
                        <ul className="space-y-2">
                            <li><button onClick={() => handleQuickLinkClick('howItWorks')} className="hover:text-green-500 transition text-sm">How it Works</button></li>
                            <li><button onClick={() => handleQuickLinkClick('guidesResources')} className="hover:text-green-500 transition text-sm">Guides</button></li>
                            <li><button onClick={() => handleQuickLinkClick('faqsFeedback')} className="hover:text-green-500 transition text-sm">FAQ's</button></li>
                            <li><button onClick={() => handleQuickLinkClick('newsUpdates')} className="hover:text-green-500 transition text-sm">News</button></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="text-sm">+91 99999 99999</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Mail className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="text-sm">info@d2dcollection.com</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="text-sm">Your City, India</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-800 my-8"></div>

                {/* Bottom Section */}
                <div className="flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-sm text-gray-400">
                        &copy; 2025 Door-to-Door Garbage Collection. All rights reserved.
                    </p>
                    <div className="flex gap-6 mt-4 sm:mt-0 text-sm">
                        <a href="#" className="text-gray-400 hover:text-green-500 transition">Privacy Policy</a>
                        <a href="#" className="text-gray-400 hover:text-green-500 transition">Terms of Service</a>
                        <a href="#" className="text-gray-400 hover:text-green-500 transition">Sitemap</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;