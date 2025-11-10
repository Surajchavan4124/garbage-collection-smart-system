import React, { useState, useEffect, useCallback } from 'react';
import {
    Home, Users, Globe, ChevronDown, Check, X, Scale, FileText, Smartphone, Mail, MapPin,
    Lock, Calendar, Clock, Trash2, Gauge, LineChart, PieChart, BarChart, Download, Plus,
    Minus, Search, Upload, Sliders, MessageSquare, Menu, X as Close, Star, Volume2, Video
} from 'lucide-react';

// --- Configuration Data ---

const PRIMARY_COLOR = 'indigo-600';
const ACCENT_COLOR = 'emerald-500';

const quickLinks = [
    { name: 'How it works', view: 'howItWorks' },
    { name: 'Submit Complaint', view: 'submitComplaint' },
    { name: 'Statistics', view: 'statisticsReports' },
    { name: 'View Schedule', view: 'viewSchedule' },
    { name: 'Guides / Resources', view: 'guidesResources' },
    { name: 'Events & Workshops', view: 'eventsWorkshops' },
    { name: 'News & Updates', view: 'newsUpdates' },
    { name: 'FAQ’s & Feedback', view: 'faqsFeedback' },
];

const committeeMembers = [
    { name: 'Dr. Sarah Cole', designation: 'Chairperson', contact: '9999999999' },
    { name: 'Mr. John Davis', designation: 'Vice Chair', contact: '9999999999' },
    { name: 'Ms. Emily Zhao', designation: 'Secretary', contact: '9999999999' },
    { name: 'Mr. Alex Singh', designation: 'Treasurer', contact: '9999999999' },
];

const contactMembers = [
    { name: 'Asha Verma', designation: 'Chairperson', phone: '+91 99999 99999', email: 'ashaverma@gmail.com' },
    { name: 'Mera Das', designation: 'Secretary', phone: '+91 99999 99999', email: 'meradas@gmail.com' },
    { name: 'Ravi Kumar', designation: 'Manager', phone: '+91 99999 99999', email: 'ravikumar@gmail.com' },
    { name: 'Sanjay Rao', designation: 'Garbage Committee Head', phone: '+91 99999 99999', email: 'sanjayrao@gmail.com' },
];

const eventsData = new Array(9).fill(0).map((_, i) => ({
    id: i,
    title: i % 3 === 0 ? 'Plantation Drive' : i % 3 === 1 ? 'Community Clean-up' : 'Recycling Workshop',
    description: "The Foundation organized a plantation drive at Mobor, this green initiative witnessed participation from over 50 volunteers.",
    date: '2025-09-13',
    time: '10:00 AM',
    location: 'Mobor Beach',
    participants: '30+',
}));

// --- Shared Components ---

const Button = ({ children, onClick, primary = true, outline = false, small = false, className = '' }) => {
    let style = '';
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

const Breadcrumb = ({ path, navigate }) => {
    return (
        <div className="flex text-sm text-gray-500 mb-6 px-4 sm:px-6 lg:px-8">
            {path.map((item, index) => (
                <React.Fragment key={index}>
                    <button
                        onClick={() => item.view && navigate(item.view)}
                        className={`hover:text-${PRIMARY_COLOR} ${!item.view ? 'cursor-default' : ''}`}
                    >
                        {item.label}
                    </button>
                    {index < path.length - 1 && <span className="mx-2 text-gray-400">&gt;</span>}
                </React.Fragment>
            ))}
        </div>
    );
};

// --- Header Component ---

const Header = ({ currentPage, navigate }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [dropdownTimeout, setDropdownTimeout] = useState(null); // New state for managing timeout

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
   
    // Custom handlers to implement the delay
    const handleMouseEnter = () => {
        if (dropdownTimeout) {
            clearTimeout(dropdownTimeout);
        }
        setIsDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        const timeout = setTimeout(() => {
            setIsDropdownOpen(false);
        }, 150); // 150ms delay to allow cursor to enter the menu area
        setDropdownTimeout(timeout);
    };
   
    // Cleanup timeout on component unmount
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
                       
                        {/* Quick Links Dropdown - NOW USING DELAYED HOVER LOGIC */}
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

                {/* Action Buttons (Right) */}
                <div className="flex items-center space-x-3">
                    <Button onClick={() => navigate('login')} primary={true} className="text-sm">
                        Login
                    </Button>
                    <Button onClick={() => navigate('registration')} outline={true} primary={false} className="hidden sm:block text-sm">
                        Register
                    </Button>
                   
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
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

// --- Footer Component ---

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

// --- Page Components ---

// 1. Home Page
const HomePage = ({ navigate }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = 3;

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

    // Placeholder for Committee Members section
    const MemberCard = ({ member }) => (
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center hover:shadow-xl transition duration-300">
            <div className={`w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-4`}>
                <Users className={`w-12 h-12 text-${PRIMARY_COLOR}`} />
            </div>
            <p className="text-lg font-bold text-gray-900">{member.name}</p>
            <p className={`text-sm text-${PRIMARY_COLOR} font-medium mb-2`}>{member.designation}</p>
            <p className="text-sm text-gray-500 flex items-center">
                <Smartphone className="w-4 h-4 mr-1" />
                Contact: {member.contact}
            </p>
        </div>
    );

    return (
        <div className="pt-10">
            {/* 2. Hero/Slider Section */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <div className="relative overflow-hidden rounded-xl shadow-2xl bg-gray-200">
                    {/* Slides Container */}
                    <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                        {[...Array(totalSlides)].map((_, i) => (
                            <div key={i} className="min-w-full h-[40vh] md:h-[60vh] flex flex-col items-center justify-center p-12 text-center bg-gray-100">
                                <Video className="w-24 h-24 text-gray-500 mb-4" strokeWidth={1.5} />
                                <h2 className="text-2xl md:text-4xl font-extrabold text-gray-800 mb-2">Slide {i + 1}: Modern Waste Management</h2>
                                <p className="text-gray-600 text-lg">Your reliable partner for a cleaner community.</p>
                            </div>
                        ))}
                    </div>

                    {/* Directional Arrows */}
                    <button onClick={prevSlide} className="absolute top-1/2 left-4 transform -translate-y-1/2 p-3 rounded-full bg-white bg-opacity-70 hover:bg-opacity-90 shadow-lg text-gray-800 transition duration-150">
                        &lt;
                    </button>
                    <button onClick={nextSlide} className="absolute top-1/2 right-4 transform -translate-y-1/2 p-3 rounded-full bg-white bg-opacity-70 hover:bg-opacity-90 shadow-lg text-gray-800 transition duration-150">
                        &gt;
                    </button>

                    {/* Pagination Dots */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                        {[...Array(totalSlides)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentSlide(i)}
                                className={`w-3 h-3 rounded-full transition duration-300 ${i === currentSlide ? `bg-${PRIMARY_COLOR}` : 'bg-gray-400'}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Key Metrics Section */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Key Metrics</h2>
               
                <div className="flex flex-col md:flex-row items-center justify-between bg-white p-8 rounded-xl shadow-xl max-w-4xl mx-auto">
                    {['Households registered', 'Waste collected', 'Segregation rate'].map((label, index) => (
                        <React.Fragment key={index}>
                            <div className="flex flex-col items-center justify-center p-4 w-full md:w-1/3 border-t md:border-t-0 border-gray-200 first:border-t-0">
                                <p className={`text-4xl font-extrabold text-${PRIMARY_COLOR} mb-1`}>
                                    {index === 0 ? '14,520+' : index === 1 ? '6,800 Tons' : '92%'}
                                </p>
                                <p className="text-base text-gray-500 font-medium">{label}</p>
                            </div>
                            {index < 2 && <div className="metric-divider hidden md:block h-16 w-px bg-gray-200"></div>}
                        </React.Fragment>
                    ))}
                </div>
            </section>

            {/* 4. Committee Members Section */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Committee Members</h2>
               
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                    {committeeMembers.map((member, index) => (
                        <MemberCard key={index} member={member} />
                    ))}
                </div>
            </section>
        </div>
    );
};

// 2. Registration Form
const RegistrationPage = ({ navigate }) => {
    // State for mock file inputs
    const [identityFile, setIdentityFile] = useState(null);
    const [premisesFile, setPremisesFile] = useState(null);

    const IconInput = ({ icon: Icon, placeholder, label, type = 'text', half = true }) => (
        <div className={`flex flex-col ${half ? 'md:w-1/2' : 'w-full'} p-2`}>
            <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="relative">
                <input
                    type={type}
                    placeholder={placeholder}
                    className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-150"
                />
                <Icon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
        </div>
    );

    const FileUpload = ({ title, documentsAccepted, setFile, file }) => (
        <div className="w-full md:w-1/2 p-2">
            <h4 className="font-semibold text-gray-800 mb-3">{title}</h4>
            <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg bg-gray-50 h-full flex flex-col justify-between">
                <div>
                    <input
                        type="file"
                        id={title.replace(/\s/g, '-')}
                        className="hidden"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    <label htmlFor={title.replace(/\s/g, '-')} className={`cursor-pointer block text-center py-2 rounded-full border border-${PRIMARY_COLOR} text-${PRIMARY_COLOR} hover:bg-indigo-50 transition`}>
                        {file ? file.name : 'Choose file / No file chosen'}
                    </label>
                    <p className="text-xs text-gray-500 mt-3 font-medium">Documents accepted:</p>
                    <ul className="text-xs text-gray-500 list-disc pl-5 mt-1">
                        {documentsAccepted.map((doc, i) => <li key={i}>{doc}</li>)}
                    </ul>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto pt-10 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap shadow-2xl rounded-xl overflow-hidden min-h-[80vh]">
                {/* A. Left Panel: Registration Form */}
                <div className="w-full lg:w-3/5 bg-white p-6 md:p-12">
                    <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-10">Register</h2>
                   
                    <form className="flex flex-wrap -m-2">
                        {/* Input Fields */}
                        <IconInput icon={Users} label="Username" placeholder="Enter Username" />
                        <IconInput icon={Mail} label="E-mail" placeholder="Enter E-mail" type="email" />
                        <IconInput icon={Lock} label="Password" placeholder="Enter Password" type="password" />
                        <IconInput icon={Lock} label="Confirm Password" placeholder="Confirm Password" type="password" />
                        <IconInput icon={Home} label="H. No (House Number)" placeholder="Enter House Number" />
                        <IconInput icon={MapPin} label="Area/Locality/Ward" placeholder="Enter Area/Locality/Ward" />
                        <IconInput icon={MapPin} label="Pincode" placeholder="Enter Pincode" />
                        <IconInput icon={Smartphone} label="Mobile Number" placeholder="Enter Mobile Number" />

                        {/* Document Upload Section */}
                        <div className="w-full p-2 mt-6">
                            <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">Upload Documents</h3>
                            <div className="flex flex-wrap -m-2">
                                <FileUpload
                                    title="Proof of Identity"
                                    documentsAccepted={['Aadhaar Card, Voter ID, Driving License, Passport, Enrollment Card, or any other government document.']}
                                    setFile={setIdentityFile}
                                    file={identityFile}
                                />
                                <FileUpload
                                    title="Proof of Premises"
                                    documentsAccepted={['House registration document, House tax receipt (latest), Electricity bill (not older than 3 months), Rent/Lease agreement, Transfer of property document, or any other document...']}
                                    setFile={setPremisesFile}
                                    file={premisesFile}
                                />
                            </div>
                        </div>

                        {/* Action Button & Link */}
                        <div className="w-full p-2 mt-8 text-center">
                            <Button primary={false} className="w-full max-w-sm" onClick={(e) => { e.preventDefault(); alert('Registration simulated!'); }}>
                                Register
                            </Button>
                            <button onClick={(e) => { e.preventDefault(); alert('Need Help? Contact support at 9999999999'); }} className={`mt-4 text-sm text-${PRIMARY_COLOR} hover:underline`}>
                                Need help?
                            </button>
                        </div>
                    </form>
                </div>

                {/* B. Right Panel: Login Prompt */}
                <div className={`hidden lg:flex lg:w-2/5 flex-col items-center justify-center p-8 text-white bg-emerald-500 bg-opacity-90`}>
                    <h3 className="text-4xl font-extrabold mb-4">Welcome Back!</h3>
                    <p className="text-lg mb-8 text-center">Already have an account?</p>
                    <Button primary={false} onClick={() => navigate('login')} className="px-8 py-2 bg-white text-emerald-600 hover:bg-gray-100 shadow-xl">
                        Login
                    </Button>
                </div>
            </div>
        </div>
    );
};

// 3. Login Form
const LoginPage = ({ navigate }) => {
    const IconInput = ({ icon: Icon, placeholder, type = 'text' }) => (
        <div className="relative mb-6">
            <input
                type={type}
                placeholder={placeholder}
                className="w-full p-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 transition duration-150"
            />
            <Icon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
    );

    return (
        <div className="container mx-auto pt-10 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap shadow-2xl rounded-xl overflow-hidden min-h-[60vh]">
                {/* A. Left Panel: Welcome & Register Prompt */}
                <div className={`hidden lg:flex lg:w-2/5 flex-col items-center justify-center p-8 text-white bg-emerald-500 bg-opacity-90`}>
                    <h3 className="text-4xl font-extrabold mb-4">Hello, Welcome!</h3>
                    <p className="text-lg mb-8 text-center">Don't have an account?</p>
                    <Button primary={false} onClick={() => navigate('registration')} className="px-8 py-2 bg-white text-emerald-600 hover:bg-gray-100 shadow-xl">
                        Register
                    </Button>
                </div>

                {/* B. Right Panel: Login Form */}
                <div className="w-full lg:w-3/5 bg-white p-6 md:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-10">Login</h2>
                   
                    <form className="max-w-md mx-auto w-full">
                        <IconInput icon={Users} placeholder="Username" />
                        <IconInput icon={Lock} placeholder="Password" type="password" />
                       
                        <div className="text-right mb-8">
                            <button
                                onClick={(e) => { e.preventDefault(); navigate('forgotPassword'); }}
                                className={`text-sm text-${PRIMARY_COLOR} hover:underline`}
                            >
                                Forgot Password?
                            </button>
                        </div>

                        <Button primary={false} className="w-full" onClick={(e) => { e.preventDefault(); alert('Login simulated!'); }}>
                            Login
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// 4. Forgot Password
const ForgotPasswordPage = ({ navigate }) => {
    return (
        <div className="container mx-auto pt-10 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap shadow-2xl rounded-xl overflow-hidden min-h-[60vh]">
                {/* A. Left Panel: Forgot Password Info */}
                <div className={`hidden lg:flex lg:w-2/5 flex-col items-center justify-center p-8 text-white bg-emerald-500 bg-opacity-90`}>
                    <h3 className="text-4xl font-extrabold mb-4">Forgot Password</h3>
                    <p className="text-lg mb-8 text-center">Remember your account details?</p>
                    <Button primary={false} onClick={() => navigate('login')} className="px-8 py-2 bg-white text-emerald-600 hover:bg-gray-100 shadow-xl">
                        Login
                    </Button>
                </div>

                {/* B. Right Panel: Reset Password Form */}
                <div className="w-full lg:w-3/5 bg-gray-50 p-6 md:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-10">Reset Password</h2>
                   
                    <form className="max-w-md mx-auto w-full">
                        <div className="flex items-end mb-6">
                            <div className="flex-grow mr-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username/Email/Mobile no.</label>
                                <input type="text" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Enter details" />
                            </div>
                            <Button primary={true} small={true} onClick={(e) => { e.preventDefault(); alert('OTP Sent!'); }}>
                                Get OTP
                            </Button>
                        </div>

                        <div className="flex items-end mb-8">
                            <div className="flex-grow mr-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                                <input type="text" className="w-full p-3 border-2 border-red-500 rounded-lg" placeholder="Enter 6-digit OTP" />
                            </div>
                            <Button primary={false} small={true} onClick={(e) => { e.preventDefault(); alert('OTP Verified!'); }}>
                                Verify OTP
                            </Button>
                        </div>
                       
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
                            <input type="password" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="New password" />
                        </div>
                       
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm new password</label>
                            <input type="password" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Confirm new password" />
                        </div>

                        <Button primary={false} className="w-full" onClick={(e) => { e.preventDefault(); alert('Password Reset Successful!'); navigate('login'); }}>
                            Reset Password
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// 5. About Us Page
const AboutPage = ({ navigate }) => {
    const [expanded, setExpanded] = useState('mission');

    const AccordionItem = ({ id, title, children }) => (
        <div className="border-b border-gray-200">
            <button
                className="flex justify-between items-center w-full p-5 text-left font-semibold text-gray-800 hover:bg-gray-50 transition duration-150"
                onClick={() => setExpanded(expanded === id ? null : id)}
            >
                {title}
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${expanded === id ? 'rotate-180' : 'rotate-0'}`} />
            </button>
            {expanded === id && (
                <div className="p-5 text-gray-600 bg-gray-50 border-t border-gray-200">
                    {children}
                </div>
            )}
        </div>
    );

    const GuidingPrincipleCard = ({ icon: Icon, title, buttonLabel, navigateTarget }) => (
        <div className="border border-gray-300 rounded-lg p-5 flex flex-col items-center text-center bg-white shadow-sm">
            <Icon className={`w-8 h-8 text-${PRIMARY_COLOR} mb-3`} />
            <p className="font-medium text-gray-700 mb-3">{title}</p>
            <Button primary={true} small={true} onClick={() => navigate(navigateTarget)} className="w-full">
                {buttonLabel}
            </Button>
        </div>
    );
   
    return (
        <div className="container mx-auto pt-10 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12">About Us</h1>
           
            {/* 3. Core Information Section (Accordion Structure) */}
            <div className="max-w-4xl mx-auto mb-16 rounded-xl overflow-hidden shadow-xl bg-white">
                <AccordionItem id="mission" title="Our Mission">
                    <p>Our mission is to create a cleaner, zero-waste community by providing every household with a simple, transparent, and efficient system for waste segregation and collection. We believe that by working together, we can drastically reduce landfill waste, protect our local environment, and turn 'waste' into a valuable resource.</p>
                </AccordionItem>
                <AccordionItem id="objectives" title="Our Key Objectives">
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Achieve 100% household registration.</li>
                        <li>Maintain a segregation compliance rate above 95%.</li>
                        <li>Integrate modern technology for efficient collection and monitoring.</li>
                    </ul>
                </AccordionItem>
                <AccordionItem id="works" title="How Our Program Works">
                    <p>Households register, receive assigned bins, follow the schedule for door-to-door collection, and provide feedback via the website. Our system uses GPS and notifications for transparency.</p>
                </AccordionItem>
            </div>

            {/* 4. Supporting Information Panels (Two Columns) */}
            <div className="flex flex-wrap -mx-4">
                {/* A. Left Panel: Village Garbage Management Committee Details */}
                <div className="w-full lg:w-1/2 p-4">
                    <div className="bg-white p-6 rounded-xl shadow-xl h-full">
                        <h3 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-3 mb-4">Village Garbage Management Committee details</h3>
                        <div className="space-y-4">
                            {committeeMembers.slice(0, 3).map((member, index) => (
                                <div key={index} className="flex items-center space-x-4 border-b pb-4 last:border-b-0 last:pb-0">
                                    <div className={`w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0`}>
                                        <Users className={`w-6 h-6 text-${PRIMARY_COLOR}`} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{member.name}</p>
                                        <p className={`text-sm text-${PRIMARY_COLOR}`}>{member.designation}</p>
                                        <p className="text-sm text-gray-500">Contact: {member.contact}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* B. Right Panel: Guiding Principles (Policy and Transparency) */}
                <div className="w-full lg:w-1/2 p-4">
                    <div className="bg-white p-6 rounded-xl shadow-xl h-full">
                        <h3 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-3 mb-4">Guiding Principles</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <GuidingPrincipleCard icon={Scale} title="Privacy policy and terms of use." buttonLabel="View" navigateTarget="legalTransparency" />
                            <GuidingPrincipleCard icon={FileText} title="Financial transparency reports." buttonLabel="View" navigateTarget="legalTransparency" />
                            <GuidingPrincipleCard icon={Sliders} title="Text-size adjustment and contrast settings." buttonLabel="Manage" navigateTarget="accessibilityLanguage" />
                            <GuidingPrincipleCard icon={Globe} title="Change Content to local language." buttonLabel="Manage" navigateTarget="accessibilityLanguage" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 6. Legal & Transparency Page
const LegalTransparencyPage = ({ navigate }) => {
    const path = [
        { label: 'About', view: 'about' },
        { label: 'Guiding Principles', view: 'about' },
        { label: 'Legal & Transparency', view: null }
    ];

    const PolicySection = ({ title, summary, content }) => (
        <div className="bg-white p-6 rounded-xl shadow-lg mb-10">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                <Button primary={true} small={true} onClick={() => alert(`Downloading ${title} PDF...`)}>
                    <Download className="w-4 h-4 mr-1 inline" /> Download as PDF
                </Button>
            </div>
            {summary && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                    <p className="font-semibold">Summary:</p>
                    <p className="text-sm">{summary}</p>
                </div>
            )}
            <div className="text-sm text-gray-600 max-h-60 overflow-y-auto pr-3">
                {content.split('\n\n').map((p, i) => <p key={i} className="mb-3">{p}</p>)}
            </div>
        </div>
    );

    const ReportCard = ({ title, date }) => (
        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center border border-gray-100">
            <FileText className={`w-10 h-10 text-${PRIMARY_COLOR} mb-3`} />
            <p className="font-semibold text-gray-800 mb-1">{title}</p>
            <p className="text-xs text-gray-500 mb-4">Published {date}</p>
            <div className="flex space-x-2 w-full">
                <Button primary={true} small={true} onClick={() => alert(`Viewing ${title}...`)} className="w-1/2">View</Button>
                <Button primary={false} small={true} onClick={() => alert(`Downloading ${title}...`)} className="w-1/2">Download</Button>
            </div>
        </div>
    );

    const policyContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nVivamus sagittis, sem sed feugiat dictum, nulla tellus luctus ligula, sed varius quam odio sed dolor. Suspendisse potenti. Nam et est sed sem pretium egestas. Nulla facilisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur blandit, ipsum et vehicula volutpat, ipsum elit euismod enim, ac posuere leo nisl vel elit.";

    return (
        <div className="container mx-auto pt-10">
            <Breadcrumb path={path} navigate={navigate} />

            <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                {/* Privacy Policy */}
                <PolicySection
                    title="Privacy Policy"
                    summary="Summary: We collect minimal personal data required for registration and complaint resolution. You can request access, correction, or deletion at any time."
                    content={policyContent}
                />

                {/* Terms of Use */}
                <PolicySection
                    title="Terms of Use"
                    content={policyContent}
                />

                {/* Financial Reports Section */}
                <div className="mt-16 mb-10">
                    <h2 className="text-3xl font-bold text-gray-800 flex items-center mb-8">
                        <FileText className={`w-8 h-8 mr-3 text-${PRIMARY_COLOR}`} />
                        Financial Reports
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ReportCard title="Quarterly Report (FY 2024-25)" date="1st July 2024" />
                        <ReportCard title="Half Yearly Report (FY 2024-25)" date="1st October 2024" />
                        <ReportCard title="Annual Report (FY 2024-25)" date="31st March 2025" />
                    </div>
                </div>
            </div>
        </div>
    );
};

// 7. Accessibility & Language Page
const AccessibilityLanguagePage = ({ navigate }) => {
    const path = [
        { label: 'About', view: 'about' },
        { label: 'Guiding Principles', view: 'about' },
        { label: 'Accessibility & Language', view: null }
    ];

    const [activeSection, setActiveSection] = useState('text-size');
    const [textSize, setTextSize] = useState('Default');
    const [isHighContrast, setIsHighContrast] = useState(false);
    const [isDyslexiaFriendly, setIsDyslexiaFriendly] = useState(false);

    const ToggleSwitch = ({ label, description, state, setState }) => (
        <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
            <div>
                <p className="font-semibold text-gray-800">{label}</p>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
            <button
                onClick={() => setState(!state)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${state ? `bg-${PRIMARY_COLOR}` : 'bg-gray-300'}`}
            >
                <span
                    className={`absolute left-0 top-0 w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${state ? 'translate-x-full' : 'translate-x-0'}`}
                />
            </button>
        </div>
    );

    const FontSizeButton = ({ label }) => (
        <button
            onClick={() => setTextSize(label)}
            className={`w-1/4 p-2 rounded-lg border-2 text-sm font-semibold transition duration-150
                ${textSize === label ? 'border-yellow-500 bg-yellow-50 text-yellow-800' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="container mx-auto pt-10">
            <Breadcrumb path={path} navigate={navigate} />

            <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-800 flex items-center mb-12">
                    <Sliders className={`w-8 h-8 mr-3 text-${PRIMARY_COLOR}`} />
                    Accessibility & Language
                </h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* A. Left Column: Quick Navigation (Sidebar) */}
                    <div className="w-full lg:w-1/4">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Navigation</h3>
                        <div className="space-y-3">
                            {['Text Size', 'Contrast', 'Language'].map(label => {
                                const id = label.toLowerCase().replace(/\s/g, '-');
                                const Icon = label === 'Text Size' ? 'T' : label === 'Contrast' ? Volume2 : Globe;
                                return (
                                    <button
                                        key={id}
                                        onClick={() => setActiveSection(id)}
                                        className={`w-full text-left p-4 rounded-xl font-semibold transition duration-150 flex items-center shadow-md ${activeSection === id ? `bg-emerald-500 text-white` : `bg-white text-gray-700 border border-emerald-500 hover:bg-emerald-50`}`}
                                    >
                                        {typeof Icon === 'string' ? <span className="text-xl mr-3">{Icon}</span> : <Icon className="w-5 h-5 mr-3" />}
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* B. Right Column: Settings Controls (Content Panel) */}
                    <div className="w-full lg:w-3/4 space-y-8 bg-white p-6 rounded-xl shadow-xl">
                        {/* 1. Text Size Control */}
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 flex items-center mb-4">
                                <span className="text-2xl font-black mr-3">T</span> Text Size
                            </h3>
                           
                            {/* Slider (Simulated) */}
                            <div className="flex items-center space-x-4 mb-6 p-4 border rounded-lg bg-gray-50">
                                <Minus className="w-6 h-6 text-gray-600" />
                                <input type="range" min="1" max="4" value={['Small', 'Default', 'Large', 'Extra Large'].indexOf(textSize) + 1} onChange={(e) => setTextSize(['Small', 'Default', 'Large', 'Extra Large'][e.target.value - 1])} className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg accent-${PRIMARY_COLOR}`} />
                                <Plus className="w-6 h-6 text-gray-600" />
                            </div>

                            {/* Preset Buttons */}
                            <div className="flex justify-between space-x-2 mb-6">
                                <FontSizeButton label="Small" />
                                <FontSizeButton label="Default" />
                                <FontSizeButton label="Large" />
                                <FontSizeButton label="Extra Large" />
                            </div>

                            {/* Preview */}
                            <div className="p-4 border border-gray-200 rounded-lg text-gray-700 bg-white shadow-sm" style={{ fontSize: textSize === 'Small' ? '14px' : textSize === 'Large' ? '18px' : textSize === 'Extra Large' ? '22px' : '16px' }}>
                                <span className="font-semibold">Preview:</span> 'Waste collection schedule updates every Monday'
                            </div>
                        </div>

                        <hr />

                        {/* 2. Contrast & Color Control */}
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 flex items-center mb-4">
                                <Volume2 className="w-6 h-6 mr-3" /> Contrast & Color
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ToggleSwitch
                                    label="High Contrast"
                                    description="Increases text and UI Contrast."
                                    state={isHighContrast}
                                    setState={setIsHighContrast}
                                />
                                <ToggleSwitch
                                    label="Dyslexia-Friendly"
                                    description="Improved spacing for readability."
                                    state={isDyslexiaFriendly}
                                    setState={setIsDyslexiaFriendly}
                                />
                            </div>
                        </div>

                        <hr />

                        {/* 3. Language Control */}
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 flex items-center mb-4">
                                <Globe className="w-6 h-6 mr-3" /> Language
                            </h3>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
                            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                                <option>English (Default)</option>
                                <option>Hindi</option>
                                <option>Marathi</option>
                                <option>Konkani</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 8. Contact Us Page
const ContactPage = ({ navigate }) => {
    const ContactCard = ({ member }) => (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col sm:flex-row items-center p-6 text-center sm:text-left">
            {/* Left Icon Block */}
            <div className={`flex flex-col items-center justify-center p-4 bg-emerald-500 bg-opacity-10 rounded-lg flex-shrink-0 w-full sm:w-28 sm:h-28 sm:mr-6 mb-4 sm:mb-0`}>
                <Users className={`w-8 h-8 text-emerald-600 mb-1`} />
                <Smartphone className={`w-6 h-6 text-emerald-600`} />
            </div>

            {/* Right Details Block */}
            <div className="w-full">
                <p className="text-xl font-bold text-gray-900">{member.name}</p>
                <p className={`text-sm text-${PRIMARY_COLOR} font-medium mb-3`}>{member.designation}</p>
               
                <div className="flex flex-col space-y-2">
                    <div className={`flex items-center p-2 rounded-lg border border-${PRIMARY_COLOR} text-${PRIMARY_COLOR}`}>
                        <Smartphone className="w-4 h-4 mr-2" />
                        <a href={`tel:${member.phone}`} className="text-sm font-medium">{member.phone}</a>
                    </div>
                    <div className={`flex items-center p-2 rounded-lg border border-${PRIMARY_COLOR} text-${PRIMARY_COLOR}`}>
                        <Mail className="w-4 h-4 mr-2" />
                        <a href={`mailto:${member.email}`} className="text-sm font-medium truncate">{member.email}</a>
                    </div>
                </div>
            </div>
        </div>
    );

    const QuickContactTile = ({ icon: Icon, title, value, color }) => (
        <div className={`bg-white p-5 rounded-xl shadow-md flex flex-col items-center justify-center border-t-4 border-${color}`}>
            <Icon className={`w-8 h-8 text-${color} mb-2`} />
            <p className="text-sm font-semibold text-gray-700">{title}</p>
            <p className="text-lg font-bold text-gray-900">{value}</p>
        </div>
    );

    return (
        <div className="container mx-auto pt-10 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12">Contact Us</h1>

            {/* 2. Committee Member Directory (Top Section) */}
            <section className="max-w-6xl mx-auto mb-16">
                <div className={`flex items-center justify-between p-4 bg-${PRIMARY_COLOR} rounded-t-xl`}>
                    <h2 className="text-xl font-bold text-white flex items-center">
                        <Users className="w-6 h-6 mr-2" /> Committee Member Directory
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-b-xl shadow-xl">
                    {contactMembers.map((member, index) => (
                        <ContactCard key={index} member={member} />
                    ))}
                </div>
            </section>

            {/* 3. Bottom Section (Two Columns) */}
            <section className="flex flex-wrap -mx-4 max-w-6xl mx-auto">
                {/* A. Left Panel: Connect With Us (Contact Form) */}
                <div className="w-full lg:w-1/2 p-4">
                    <div className="bg-white p-6 rounded-xl shadow-xl h-full">
                        <h3 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-3 mb-4">Connect With Us</h3>
                        <form className="space-y-4">
                            <div><label className="block text-sm font-medium">Name</label><input type="text" className="w-full p-3 border rounded-lg" /></div>
                            <div><label className="block text-sm font-medium">Email</label><input type="email" className="w-full p-3 border rounded-lg" /></div>
                            <div><label className="block text-sm font-medium">Subject</label><input type="text" className="w-full p-3 border rounded-lg" /></div>
                            <div><label className="block text-sm font-medium">Message</label><textarea rows="4" className="w-full p-3 border rounded-lg"></textarea></div>
                            <div className="flex space-x-4 pt-2">
                                <Button primary={false} className="bg-emerald-500 hover:bg-emerald-600">Send</Button>
                                <Button primary={true} className="bg-red-500 hover:bg-red-600">Reset</Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* B. Right Panel: Office Location */}
                <div className="w-full lg:w-1/2 p-4">
                    <div className="bg-white p-6 rounded-xl shadow-xl h-full">
                        <h3 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-3 mb-4">Office Location</h3>
                       
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Search Ward</label>
                            <div className="relative">
                                <input type="text" placeholder="Enter Ward name..." className="w-full p-3 border rounded-lg pr-10" />
                                <Search className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center text-gray-500 mb-6">
                            <MapPin className="w-10 h-10" />
                            Map Placeholder
                        </div>

                        {/* Quick Contact Tiles */}
                        <div className="grid grid-cols-2 gap-4">
                            <QuickContactTile icon={Smartphone} title="Helpline" value="0832 2733928" color="indigo-600" />
                            <QuickContactTile icon={MessageSquare} title="Whatsapp" value="+91 99999 99999" color="emerald-500" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

// 9. Quick Links > How it works
const HowItWorksPage = ({ navigate }) => {
    const path = [
        { label: 'Quick Links', view: 'howItWorks' },
        { label: 'How it works', view: null }
    ];

    const ProcessStep = ({ number, text }) => (
        <div className="flex flex-col items-center w-full relative">
            <div className={`w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xl mb-3 shadow-lg`}>
                {number}
            </div>
            <p className="text-center font-semibold text-gray-700">{text}</p>
        </div>
    );

    const ProcessArrow = () => (
        <div className="hidden md:flex items-center justify-center flex-shrink-0 w-10 text-gray-400">
            &rarr;
        </div>
    );

    const FAQItem = ({ question, answer, isExpanded }) => (
        <div className="border-b border-gray-200">
            <button
                className="flex justify-between items-center w-full p-4 text-left font-semibold text-gray-800 hover:bg-gray-50 transition duration-150"
                // Simulate state change if this were a real component
                onClick={() => alert(isExpanded ? "Collapsing answer..." : answer)}
            >
                {question}
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} />
            </button>
            {isExpanded && (
                <div className="p-4 text-gray-600 bg-gray-100 border-t border-gray-200">
                    {answer}
                </div>
            )}
        </div>
    );

    return (
        <div className="container mx-auto pt-10">
            <Breadcrumb path={path} navigate={navigate} />
            <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12">Garbage Collection - Smart Reporting System</h1>

                {/* 2. Process Flow Diagram */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-xl shadow-xl mb-16 space-y-8 md:space-y-0">
                    <ProcessStep number={1} text="Register" />
                    <ProcessArrow />
                    <ProcessStep number={2} text="View Schedules" />
                    <ProcessArrow />
                    <ProcessStep number={3} text="Get Collection Notification" />
                    <ProcessArrow />
                    <ProcessStep number={4} text="Provide FeedBack/Complain" />
                </div>

                {/* 3. Frequently Asked Questions (FAQ / Accordion) */}
                <div className={`bg-gray-100 p-6 rounded-xl shadow-lg`}>
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
                    <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
                        <FAQItem question="How Registration works?" answer="Go to Registration, fill household details, upload proof of address, then submit. You will receive a confirmation via SMS/WhatsApp." isExpanded={true} />
                        <FAQItem question="How scheduling works?" answer="Schedules are automatically generated based on your ward and are viewable on the 'View Schedule' page." isExpanded={false} />
                        <FAQItem question="What notifications will I receive?" answer="You will receive alerts about upcoming collection days, service interruptions, and complaint updates." isExpanded={false} />
                        <FAQItem question="What type of complaints can I raise?" answer="You can raise complaints regarding missed collection, laborer misbehavior, unauthorized dumping, or damaged bins." isExpanded={false} />
                        <FAQItem question="How to contact support?" answer="You can contact support via the 'Contact Us' page, or by calling our helpline number." isExpanded={false} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// 10. Quick Links > Submit Complaint
const SubmitComplaintPage = ({ navigate }) => {
    const path = [
        { label: 'Quick Links', view: 'submitComplaint' },
        { label: 'Submit Complaint', view: null }
    ];

    const [isUploaded, setIsUploaded] = useState(false);

    return (
        <div className="container mx-auto pt-10">
            <Breadcrumb path={path} navigate={navigate} />
            <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12">Complaint form</h1>

                <div className="flex flex-wrap shadow-xl rounded-xl overflow-hidden bg-white">
                    {/* 3. Left Column: Complaint Details Form */}
                    <div className="w-full lg:w-2/3 p-6 md:p-10 border-r border-gray-100">
                        <form className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Complaint Details</h2>
                           
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="Enter Your Name" className="p-3 border rounded-lg" />
                                <input type="text" placeholder="Enter Ward/Locality" className="p-3 border rounded-lg" />
                                <input type="text" placeholder="Enter House No." className="p-3 border rounded-lg" />
                                <select className="p-3 border rounded-lg bg-white">
                                    <option>Complain subject</option>
                                    <option>Damaged Dustbin</option>
                                    <option selected>Misbehavior of labour</option>
                                    <option>Garbage thrown by non residents</option>
                                    <option>Other (Please Specify)</option>
                                </select>
                            </div>
                           
                            <div>
                                <label className="block text-sm font-medium mb-1">Describe the complaint in brief to help us understand the complaint better and for a faster resolution.</label>
                                <textarea rows="4" className="w-full p-3 border rounded-lg" placeholder="Describe your complaint..."></textarea>
                            </div>

                            <div className="flex space-x-4 pt-4">
                                <Button
                                    primary={false}
                                    className="bg-emerald-500 hover:bg-emerald-600 w-full"
                                    onClick={(e) => { e.preventDefault(); navigate('complaintSubmitted'); }}
                                >
                                    Submit
                                </Button>
                                <Button primary={true} className="bg-gray-200 text-gray-800 hover:bg-gray-300 w-full">
                                    Clear Form
                                </Button>
                            </div>
                            <div className="text-center pt-2">
                                <button onClick={() => navigate('login')} className={`text-sm text-${PRIMARY_COLOR} hover:underline`}>
                                    Login to track your existing complaints
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* 4. Right Column: Auxiliary Functions */}
                    <div className="w-full lg:w-1/3 p-6 md:p-10 bg-gray-50">
                        {/* A. Proof Upload */}
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Proof (upload picture) (if Any)</h3>
                        <div
                            className={`h-40 border-2 border-dashed ${isUploaded ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300'} rounded-lg flex flex-col items-center justify-center text-gray-500 mb-8 cursor-pointer`}
                            onClick={() => setIsUploaded(!isUploaded)}
                        >
                            {isUploaded ? <Check className="w-8 h-8 text-emerald-600" /> : <Upload className="w-8 h-8" />}
                            <p className="font-semibold mt-2">{isUploaded ? 'Photo Uploaded!' : 'Upload Photo'}</p>
                            <p className="text-xs">Drag and drop files here</p>
                        </div>

                        {/* B. WhatsApp/SMS Integration */}
                        <div className="space-y-4">
                            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between border border-emerald-300">
                                <div className="flex items-center">
                                    <MessageSquare className="w-6 h-6 text-emerald-500 mr-3" />
                                    <p className="text-sm">Link WhatsApp. Receive complaint updates...</p>
                                </div>
                                <Button primary={true} small={true} className={`bg-${PRIMARY_COLOR}`}>Connect</Button>
                            </div>

                            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between border border-gray-300">
                                <div className="flex items-center">
                                    <Smartphone className="w-6 h-6 text-gray-500 mr-3" />
                                    <p className="text-sm">Enable SMS Alerts.</p>
                                </div>
                                <ToggleSwitch state={false} setState={() => alert('SMS alerts toggled (simulated)')} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 11. Complaint Submitted Page
const ComplaintSubmittedPage = ({ navigate }) => {
    return (
        <div className="container mx-auto pt-10 px-4 sm:px-6 lg:px-8 bg-gray-100 min-h-[80vh] flex items-center justify-center">
            <div className="bg-white p-10 rounded-xl shadow-2xl max-w-lg w-full text-center border-t-8 border-red-500">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Complaint Submitted</h1>
               
                <div className="space-y-3 text-left bg-gray-50 p-6 rounded-lg mb-8 border">
                    <p className="text-sm"><span className="font-bold text-gray-700">Name:</span> S. Kumar</p>
                    <p className="text-sm"><span className="font-bold text-gray-700">Subject:</span> There is Hazardous waste in my locality which has not been collected</p>
                    <p className="text-lg"><span className="font-extrabold text-red-600">Ticket ID:</span> 101040790</p>
                </div>

                <Button primary={true} className="bg-red-500 hover:bg-red-600 w-full max-w-xs" onClick={() => navigate('home')}>
                    Close
                </Button>
                <button onClick={() => navigate('login')} className={`mt-4 block mx-auto text-sm text-${PRIMARY_COLOR} hover:underline`}>
                    Login to track your existing complaints
                </button>
            </div>
        </div>
    );
};

// 12. Quick Links > Statistics & Reports
const StatisticsReportsPage = ({ navigate }) => {
    const path = [
        { label: 'Quick Links', view: 'statisticsReports' },
        { label: 'Statistics', view: null }
    ];

    const ChartPlaceholder = ({ title, Icon, children, color }) => (
        <div className="bg-white p-6 rounded-xl shadow-lg h-full">
            <h3 className="text-xl font-bold text-gray-800 flex items-center mb-4">
                <Icon className={`w-6 h-6 mr-2 text-${color}`} />
                {title}
            </h3>
            <div className="h-64 flex items-center justify-center border border-gray-100 rounded-lg bg-gray-50">
                {children}
            </div>
        </div>
    );

    // Simulated Line Chart Visuals
    const LineChartVisual = () => (
        <div className="w-full h-full p-4 flex flex-col justify-end text-xs">
            <div className="flex justify-between items-end h-full w-full relative">
                <div className="absolute inset-0 border-t border-l border-gray-300"></div>
                {/* Y-Axis labels (simulated) */}
                <span className="absolute left-0 -translate-x-full top-0 text-gray-500">35Kgs</span>
                <span className="absolute left-0 -translate-x-full bottom-0 text-gray-500">0Kgs</span>

                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                    {/* Line data (mock trend: 10, 20, 15, 30) */}
                    <polyline fill="none" stroke="#f59e0b" strokeWidth="3" points="5,90 30,70 55,80 80,50" />
                    <circle cx="5" cy="90" r="2" fill="#f59e0b" />
                    <circle cx="30" cy="70" r="2" fill="#f59e0b" />
                    <circle cx="55" cy="80" r="2" fill="#f59e0b" />
                    <circle cx="80" cy="50" r="2" fill="#f59e0b" />
                </svg>
            </div>
            <div className="flex justify-between mt-2 text-gray-500">
                <span>Week 1</span>
                <span>Week 2</span>
                <span>Week 3</span>
                <span>Week 4</span>
            </div>
        </div>
    );

    // Simulated Pie Chart Visuals
    const PieChartVisual = () => (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <svg width="150" height="150" viewBox="0 0 100 100">
                <circle r="50" cx="50" cy="50" fill="#a7f3d0" />
                {/* 23% contamination starting at 12 o'clock */}
                <path d="M50 50 L50 0 A50 50 0 0 1 73.5 12.5 Z" fill="#f87171" />
                <text x="50" y="50" textAnchor="middle" fill="#065f46" className="font-bold text-sm">77%</text>
            </svg>
            <div className="flex space-x-4 mt-4 text-sm">
                <span className="flex items-center"><div className="w-3 h-3 bg-red-400 mr-1 rounded-full"></div> 23% Contamination</span>
                <span className="flex items-center"><div className="w-3 h-3 bg-emerald-200 mr-1 rounded-full"></div> 77% Compliance</span>
            </div>
        </div>
    );

    // Simulated Bar Chart Visuals
    const BarChartVisual = () => (
        <div className="w-full h-full p-4 flex flex-col justify-end text-xs">
             <div className="flex justify-around items-end h-full w-full relative border-l border-t border-gray-300">
                {[
                    { q: 'Q1', d: [{ y: 40, c: 'gray-500' }, { y: 60, c: PRIMARY_COLOR }] },
                    { q: 'Q2', d: [{ y: 55, c: 'gray-500' }, { y: 70, c: PRIMARY_COLOR }] },
                    { q: 'Q3', d: [{ y: 30, c: 'gray-500' }, { y: 90, c: PRIMARY_COLOR }] },
                    { q: 'Q4', d: [{ y: 65, c: 'gray-500' }, { y: 80, c: PRIMARY_COLOR }] },
                ].map((quarter) => (
                    <div key={quarter.q} className="flex h-full items-end justify-center w-1/4">
                        {quarter.d.map((bar, i) => (
                            <div
                                key={i}
                                className={`w-4 mx-1 rounded-t-sm`}
                                style={{ height: `${bar.y}%`, backgroundColor: bar.c.includes('indigo') ? '#4f46e5' : '#6b7280' }}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <div className="flex justify-around mt-2 text-gray-500">
                <span>Q1</span>
                <span>Q2</span>
                <span>Q3</span>
                <span>Q4</span>
            </div>
            <div className="flex justify-center mt-4 space-x-4">
                <span className="flex items-center"><div className={`w-3 h-3 bg-gray-500 mr-1`}></div> 2018</span>
                <span className={`flex items-center`}><div className={`w-3 h-3 bg-${PRIMARY_COLOR} mr-1`}></div> 2019</span>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto pt-10">
            <Breadcrumb path={path} navigate={navigate} />
            <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                {/* 2. Date Selection and Page Title */}
                <div className="flex justify-between items-center p-4 rounded-xl bg-red-100 border-l-4 border-red-500 mb-12">
                    <h1 className="text-3xl font-bold text-gray-800">Statistic And Report</h1>
                    <div className="flex items-center text-sm text-gray-600 font-medium cursor-pointer">
                        Jul 1, 2019 - Jul 31, 2019 <ChevronDown className="w-4 h-4 ml-1" />
                    </div>
                </div>

                {/* 3. Top Reporting Section (Two Columns) */}
                <div className="flex flex-wrap -mx-4 mb-16">
                    {/* A. Left Chart: Public Monthly Collection Totals */}
                    <div className="w-full lg:w-1/2 p-4">
                        <ChartPlaceholder title="Public monthly collection totals" Icon={LineChart} color="amber-500">
                            <LineChartVisual />
                        </ChartPlaceholder>
                    </div>

                    {/* B. Right Chart: Segregation Compliance Rates */}
                    <div className="w-full lg:w-1/2 p-4">
                        <div className="bg-white p-6 rounded-xl shadow-lg h-full">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center mb-4">
                                <PieChart className="w-6 h-6 mr-2 text-teal-500" />
                                Segregation compliance rates
                            </h3>
                           
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Text Breakdowns */}
                                <div className="text-sm md:w-1/2 space-y-2">
                                    <p className="font-semibold text-gray-700">Compliance Rate Breakdown:</p>
                                    <ul className="list-disc pl-5 text-gray-600">
                                        <li>Paper & Cardboard - 60%</li>
                                        <li>Metals - 15%</li>
                                        <li>Plastics - 15%</li>
                                    </ul>
                                    <p className="font-semibold text-gray-700 pt-2">Contamination Rate Breakdown:</p>
                                    <ul className="list-disc pl-5 text-gray-600">
                                        <li>Plastic Bags & Film - 30%</li>
                                        <li>Food & Liquid Waste - 25%</li>
                                        <li>Wet-cycling (Wrong Materials) - 25%</li>
                                    </ul>
                                </div>
                               
                                {/* Pie Chart & Summary */}
                                <div className="md:w-1/2 flex flex-col justify-center items-center">
                                    <PieChartVisual />
                                    <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-3 mt-4 text-xs rounded w-full text-center">
                                        Audit found an average contamination rate of <span className="font-bold">23%</span> / Compliance rate of <span className="font-bold">77%</span>.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
               
                {/* 4. Bottom Reporting Section (Year-on-Year Bar Chart) */}
                <div className="w-full">
                    <ChartPlaceholder title="Year-on-year performance charts" Icon={BarChart} color={PRIMARY_COLOR}>
                        <BarChartVisual />
                    </ChartPlaceholder>
                </div>
            </div>
        </div>
    );
};

// 13. Quick Links > View Schedule page
const ViewSchedulePage = ({ navigate }) => {
    const path = [
        { label: 'Quick Links', view: 'viewSchedule' },
        { label: 'View Schedule', view: null }
    ];

    const scheduleData = [
        { area: 'Rawanfond', period: '14 days', date: '21-09-2025', time: '09:00 AM - 11:00 AM' },
        { area: 'Mandopa', period: '20 days', date: '12-09-2025', time: '11:00 AM - 01:00 PM' },
        { area: 'Talaulim', period: '10 days', date: '18-09-2025', time: '07:00 AM - 09:00 AM' },
        { area: 'Sinquetim', period: '7 days', date: '25-09-2025', time: '02:00 PM - 04:00 PM' },
        { area: 'Margao', period: '7 days', date: '25-09-2025', time: '08:00 AM - 10:00 AM' },
        { area: 'Ponda', period: '14 days', date: '21-09-2025', time: '10:00 AM - 12:00 PM' },
        { area: 'Vasco', period: '20 days', date: '12-09-2025', time: '06:00 AM - 08:00 AM' },
        // ... more data
    ];

    return (
        <div className="container mx-auto pt-10">
            <Breadcrumb path={path} navigate={navigate} />
            <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12">Garbage Collection Schedule</h1>

                {/* 2. Schedule Table */}
                <div className="bg-white rounded-xl shadow-xl overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className={`bg-gray-50 text-${PRIMARY_COLOR}`}>
                            <tr>
                                {['Area', 'Collection period', 'Next collection date', 'Collection time'].map(header => (
                                    <th key={header} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {scheduleData.map((row, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.area}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.period}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 3. Important Note and Call to Action */}
                <div className="mt-10 p-6 bg-red-50 rounded-xl border-l-4 border-red-400 text-gray-700 shadow-lg">
                    <p className="font-semibold mb-2">Note:</p>
                    <p className="text-sm">For non collection of your garbage please <button onClick={() => navigate('login')} className={`text-${PRIMARY_COLOR} hover:underline`}>login/register</button>, collection rescheduling option will be available if concerned panchayat allows such facility for your area.</p>
                    <p className="text-sm mt-1">Or you can also <button onClick={() => navigate('submitComplaint')} className={`text-${PRIMARY_COLOR} hover:underline`}>raise a complain</button> through the "Submit Complain" page.</p>
                </div>
            </div>
        </div>
    );
};

// 14. Quick Links > Guides/Resources
const GuidesResourcesPage = ({ navigate }) => {
    const path = [
        { label: 'Quick Links', view: 'guidesResources' },
        { label: 'Guides/Resources', view: null }
    ];

    const videoResources = new Array(6).fill(0).map((_, i) => ({
        title: `Waste Segregation: Part ${i + 1}`,
        description: "Post votum promissa memini cuius",
    }));

    const DoDontSection = ({ icon: Icon, title, content, color }) => (
        <div className="w-full md:w-1/2 p-2">
            <h4 className={`text-xl font-bold mb-3 flex items-center text-${color}`}>
                <Icon className="w-6 h-6 mr-2" />
                {title}
            </h4>
            <ul className={`list-disc pl-5 text-gray-600 space-y-2 text-sm`}>
                {content.split('\n').map((item, i) => <li key={i}>{item}</li>)}
            </ul>
        </div>
    );

    const dosContent = "Separate wet and dry waste.\nClean containers before recycling.\nCompost kitchen scraps where possible.\nCheck local guidelines for hazardous waste.";
    const dontsContent = "Don't mix waste types.\nDon't put e-waste in regular bins.\nDon't use thin plastic bags.\nDon't throw medical waste with regular garbage.";

    return (
        <div className="container mx-auto pt-10">
            <Breadcrumb path={path} navigate={navigate} />
            <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12">Waste Segregation Guide</h1>

                <div className="flex flex-wrap -mx-4">
                    {/* 3. Left Column: Video/Resource Grid (Wider) */}
                    <div className="w-full lg:w-2/3 p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Resource Library</h2>
                            <select className="p-2 border rounded-lg text-sm bg-white">
                                <option>Latest upload</option>
                                <option>Most viewed</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {videoResources.map((resource, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 cursor-pointer hover:shadow-xl transition duration-300">
                                    <div className="bg-gray-200 h-40 flex items-center justify-center relative">
                                        <Video className="w-10 h-10 text-gray-500" />
                                        {/* Added Play icon import above */}
                                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition duration-300">
                                            <svg className="w-12 h-12 text-white fill-current" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2-7c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1H9c-.55 0-1 .45-1 1v3zm10-7V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v1H5v2h14V5h-3V4h3z"/></svg>
                                        </div>
                                    </div>
                                    <p className="p-3 font-semibold text-gray-800">{resource.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 4. Right Column: Downloadable Guides & Textual Content (Narrower) */}
                    <div className="w-full lg:w-1/3 p-4">
                        <div className="bg-white p-6 rounded-xl shadow-xl h-full border border-gray-100">
                            {/* Downloadable PDF */}
                            <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                    <FileText className="w-5 h-5 mr-2 text-red-500" /> Downloadable PDF
                                </h3>
                                <Button primary={true} small={true}>Download</Button>
                            </div>

                            {/* Segregation Do's and Don'ts */}
                            <div className="mt-4 p-4 border-2 border-dashed border-emerald-300 rounded-lg bg-emerald-50">
                                <h3 className="text-xl font-bold text-emerald-700 text-center mb-4">Segregation Do's and Don'ts</h3>
                                <div className="flex flex-wrap -m-2">
                                    <DoDontSection icon={Check} title="Do's" content={dosContent} color="emerald-600" />
                                    <DoDontSection icon={X} title="Don'ts" content={dontsContent} color="red-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 15. Quick Links > Events & Workshops
const EventsWorkshopsPage = ({ navigate }) => {
    const path = [
        { label: 'Quick Links', view: 'eventsWorkshops' },
        { label: 'Events & Workshops', view: null }
    ];

    const EventCard = ({ event }) => (
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 flex flex-col hover:shadow-2xl transition duration-300">
            <div className="bg-gray-200 h-40 flex items-center justify-center relative">
                <Video className="w-10 h-10 text-gray-500" />
            </div>
            <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
               
                <div className="space-y-1 text-sm text-gray-700 flex-grow">
                    <p className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-indigo-500" /> Date: {event.date}</p>
                    <p className="flex items-center"><Clock className="w-4 h-4 mr-2 text-indigo-500" /> Time: {event.time}</p>
                    <p className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-indigo-500" /> Location: {event.location}</p>
                    <p className="flex items-center"><Users className="w-4 h-4 mr-2 text-indigo-500" /> Participants: {event.participants}</p>
                </div>

                <div className="mt-4 flex justify-end">
                    <Button primary={false} onClick={() => navigate('volunteerForm')} className="bg-emerald-500 hover:bg-emerald-600">Be a Volunteer</Button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto pt-10">
            <Breadcrumb path={path} navigate={navigate} />
            <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12">Featured Events</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {eventsData.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            </div>
        </div>
    );
};

// 16. Volunteer Form Page (Modal Style)
const VolunteerFormPage = ({ navigate }) => {
    return (
        <div className="container mx-auto pt-10 px-4 sm:px-6 lg:px-8 bg-gray-100 min-h-[80vh] flex items-center justify-center">
            <div className={`bg-white p-10 rounded-xl shadow-2xl max-w-md w-full text-center border-t-8 border-${PRIMARY_COLOR}`}>
                <h1 className="text-3xl font-extrabold text-gray-800 mb-8">SignUp volunteer Form</h1>
               
                <form className="space-y-6 text-left">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">1.Enter your name:</label>
                        <input type="text" className="w-full p-3 border rounded-lg" />
                    </div>
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">2.Enter your email:</label>
                        <input type="email" className="w-full p-3 border rounded-lg" />
                    </div>
                    {/* Phone Number */}
                    <div>
                        <label className="block text-sm font-semibold mb-1">3.Enter your Phone no.:</label>
                        <input type="tel" className="w-full p-3 border rounded-lg" />
                    </div>
                   
                    {/* Event Selection */}
                    <div>
                        <label className="block text-sm font-semibold mb-2">Select Event :</label>
                        <select size="5" className="w-full p-3 border border-gray-300 rounded-lg bg-white overflow-y-auto">
                            <option>--</option>
                            <option>Plantation Drive (2025-09-13)</option>
                            <option>Community Clean-up (2025-09-20)</option>
                            <option>Recycling Workshop (2025-09-27)</option>
                            <option>Event 4 Placeholder</option>
                            <option>Event 5 Placeholder</option>
                        </select>
                    </div>

                    <div className="flex space-x-4 pt-4">
                        <Button primary={true} className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={(e) => { e.preventDefault(); alert('Volunteer Sign-up Submitted!'); navigate('eventsWorkshops'); }}>
                            Submit
                        </Button>
                        <Button outline={true} primary={false} className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50" onClick={(e) => { e.preventDefault(); navigate('eventsWorkshops'); }}>
                            Close
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// 17. Quick Links > News & Updates
const NewsUpdatesPage = ({ navigate }) => {
    const path = [
        { label: 'Quick Links', view: 'newsUpdates' },
        { label: 'News & Updates', view: null }
    ];

    const newsItems = [
        { headline: 'Extended Hours for Recycling Centers on Weekends', date: '28 Oct 2025', category: 'Announcements', icon: Volume2 },
        { headline: 'MoU Signed with Local NGO for Waste Education', date: '07 Nov 2025', category: 'Press releases', icon: FileText },
        { headline: 'Ward 11 Residents Reduce Mixed Waste by 35%', date: '07 Sept 2025', category: 'Success stories', icon: Star },
    ];

    const [activeFilter, setActiveFilter] = useState('All');

    const ArticlePreview = ({ item }) => (
        <div className="flex p-4 border border-gray-200 rounded-xl bg-white shadow-md hover:shadow-lg transition duration-300 cursor-pointer">
            {/* Image Placeholder */}
            <div className={`w-24 h-24 bg-gray-200 flex items-center justify-center rounded-lg flex-shrink-0 mr-4`}>
                <FileText className="w-8 h-8 text-gray-500" />
            </div>
            {/* Content */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{item.headline}</h3>
                <div className="flex space-x-4 text-sm mb-2">
                    <span className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-1" /> {item.date}
                    </span>
                    <span className={`flex items-center text-${PRIMARY_COLOR} font-medium`}>
                        <item.icon className="w-4 h-4 mr-1" /> {item.category}
                    </span>
                </div>
                <p className="text-sm text-gray-500">A one-line summary of the content goes here...</p>
            </div>
        </div>
    );

    const PhotoTile = () => (
        <div className="h-24 bg-gray-200 rounded-lg flex items-center justify-center">
            <Video className="w-6 h-6 text-gray-500" />
        </div>
    );

    return (
        <div className="container mx-auto pt-10">
            <Breadcrumb path={path} navigate={navigate} />
            <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
               
                {/* News & Updates Section */}
                <h1 className="text-4xl font-extrabold text-gray-800 mb-8">News & Updates</h1>
               
                {/* Filter Tabs */}
                <div className="flex space-x-2 sm:space-x-4 mb-10 overflow-x-auto pb-2">
                    {['All', 'Announcements', 'Press releases', 'Success stories'].map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition duration-150 flex-shrink-0 ${
                                activeFilter === filter
                                ? `bg-${PRIMARY_COLOR} text-white shadow-md`
                                : `bg-white text-gray-700 border border-${PRIMARY_COLOR} hover:bg-gray-50`
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* News Article List */}
                <div className="space-y-6 mb-16">
                    {newsItems.filter(item => activeFilter === 'All' || item.category === activeFilter).map((item, index) => (
                        <ArticlePreview key={index} item={item} />
                    ))}
                </div>

                {/* Photo Gallery Section */}
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Photo Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {new Array(12).fill(0).map((_, index) => (
                        <PhotoTile key={index} />
                    ))}
                </div>
            </div>
        </div>
    );
};

// 18. Quick Links > FAQ’s & Feedback
const FAQsFeedbackPage = ({ navigate }) => {
    const path = [
        { label: 'Quick Links', view: 'faqsFeedback' },
        { label: 'FAQ’s & Feedback', view: null }
    ];

    const faqs = [
        { question: 'How do I register my household', answer: "Go to Registration, fill household details, upload proof of address, then submit. You will receive a confirmation via SMS/WhatsApp.", expanded: true },
        { question: 'I didn\'t get an OTP. What should I do?', answer: "Please check your spam folder or ensure your mobile number is correct and try requesting a new OTP after 5 minutes.", expanded: false },
        { question: 'What goes into Dry vs. Wet bins?', answer: "Wet waste includes organic materials like food scraps and yard waste. Dry waste includes non-organic items like paper, plastic, and metal.", expanded: false },
        { question: 'How do I dispose of e-waste?', answer: "E-waste must be dropped off at designated collection points. Check our 'Guides/Resources' page for a map of locations.", expanded: false },
        { question: 'Can I submit photos with complaints?', answer: "Yes, you can upload photos as proof directly in the 'Submit Complaint' form.", expanded: false },
        { question: 'Where do I see collection schedules?', answer: "The schedules are available on the 'View Schedule' page under Quick Links.", expanded: false },
    ];
   
    const [openFaq, setOpenFaq] = useState(faqs[0].question);
    const [rating, setRating] = useState(3);

    const StarRating = () => (
        <div className="flex space-x-1 cursor-pointer">
            {[1, 2, 3, 4, 5].map(i => (
                <Star
                    key={i}
                    onClick={() => setRating(i)}
                    className={`w-6 h-6 transition duration-150 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
            ))}
        </div>
    );

    return (
        <div className="container mx-auto pt-10">
            <Breadcrumb path={path} navigate={navigate} />
            <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
               
                {/* 2. Frequently Asked Questions (FAQ) Section */}
                <h1 className="text-4xl font-extrabold text-gray-800 mb-8">FAQ's</h1>
                <div className="bg-white rounded-xl shadow-xl mb-16 border border-gray-100 overflow-hidden">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border-b border-gray-100 last:border-b-0">
                            <button
                                className="flex justify-between items-center w-full p-4 text-left font-semibold text-gray-800 hover:bg-gray-50 transition duration-150"
                                onClick={() => setOpenFaq(faq.question === openFaq ? null : faq.question)}
                            >
                                {faq.question}
                                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${faq.question === openFaq ? 'rotate-180' : 'rotate-0'}`} />
                            </button>
                            {faq.question === openFaq && (
                                <div className="p-4 text-gray-600 bg-gray-50 border-t border-gray-100">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* 3. Give Your Feedback Section */}
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Give Your Feedback</h2>
                <div className="flex flex-wrap shadow-xl rounded-xl overflow-hidden bg-white">
                    {/* A. Left Column: Feedback Form */}
                    <div className="w-full lg:w-2/3 p-6 md:p-10 border-r border-gray-100">
                        <form className="space-y-4">
                            <div><label className="block text-sm font-medium">Name:</label><input type="text" className="w-full p-3 border rounded-lg" /></div>
                            <div><label className="block text-sm font-medium">Email:</label><input type="email" className="w-full p-3 border rounded-lg" /></div>
                            <div><label className="block text-sm font-medium">Your Feedback:</label><textarea rows="4" className="w-full p-3 border rounded-lg"></textarea></div>
                           
                            <div className="pt-2">
                                <label className="block text-sm font-medium mb-2">Rate Our Service:</label>
                                <StarRating />
                            </div>

                            <div className="flex space-x-4 pt-4">
                                <Button primary={false} className="bg-emerald-500 hover:bg-emerald-600">Submit</Button>
                                <Button primary={true} className="bg-gray-200 text-gray-800 hover:bg-gray-300">Reset</Button>
                            </div>
                        </form>
                    </div>

                    {/* B. Right Column: Image Placeholder */}
                    <div className="hidden lg:flex lg:w-1/3 p-6 md:p-10 bg-gray-50 items-center justify-center flex-col">
                        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                            <Video className="w-16 h-16 text-gray-500" />
                        </div>
                        <p className="text-sm text-gray-600 mt-3 text-center">Image of the Garbage committee working</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main App Component (The Router) ---

const App = () => {
    const [currentPage, setCurrentPage] = useState('home');

    // Navigation function used site-wide
    const navigate = useCallback((page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0); // Scroll to top on page change
    }, []);

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage navigate={navigate} />;
            case 'about':
                return <AboutPage navigate={navigate} />;
            case 'contact':
                return <ContactPage navigate={navigate} />;
            case 'registration':
                return <RegistrationPage navigate={navigate} />;
            case 'login':
                return <LoginPage navigate={navigate} />;
            case 'forgotPassword':
                return <ForgotPasswordPage navigate={navigate} />;
            case 'legalTransparency':
                return <LegalTransparencyPage navigate={navigate} />;
            case 'accessibilityLanguage':
                return <AccessibilityLanguagePage navigate={navigate} />;
            case 'howItWorks':
                return <HowItWorksPage navigate={navigate} />;
            case 'submitComplaint':
                return <SubmitComplaintPage navigate={navigate} />;
            case 'complaintSubmitted':
                return <ComplaintSubmittedPage navigate={navigate} />;
            case 'statisticsReports':
                return <StatisticsReportsPage navigate={navigate} />;
            case 'viewSchedule':
                return <ViewSchedulePage navigate={navigate} />;
            case 'guidesResources':
                return <GuidesResourcesPage navigate={navigate} />;
            case 'eventsWorkshops':
                return <EventsWorkshopsPage navigate={navigate} />;
            case 'volunteerForm':
                return <VolunteerFormPage navigate={navigate} />;
            case 'newsUpdates':
                return <NewsUpdatesPage navigate={navigate} />;
            case 'faqsFeedback':
                return <FAQsFeedbackPage navigate={navigate} />;
            default:
                return <HomePage navigate={navigate} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header currentPage={currentPage} navigate={navigate} />
            <main className="pt-20">
                {renderPage()}
            </main>
            <Footer />
        </div>
    );
};

export default App;
