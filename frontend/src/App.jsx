// frontend/src/App.jsx

import React, { useState, useCallback } from 'react';
import Navbar from './component/Navbar';
import Footer from './component/shared/Footer';
import HomePage from './component/Home';
import AboutPage from './component/About';
import ContactPage from './component/Contact';
import RegistrationPage from './component/RegistrationPage';
import LoginPage from './component/auth/LoginPage';
import ForgotPasswordPage from './component/auth/ForgotPasswordPage';
import QuickLinkPage from './component/shared/QuickLinkPage';
import { quickLinks } from './config';

// Helper to map quick links from config data to the generic page component
const quickLinkMap = quickLinks.reduce((acc, link) => {
    // Dynamically create a component instance that passes the specific link name as a prop
    acc[link.view] = ({ navigate }) => <QuickLinkPage navigate={navigate} title={link.name} />;
    return acc;
}, {});

const App = () => {
    // State for the current page, defaulting to 'home'
    const [currentPage, setCurrentPage] = useState('home');

    // Memoized navigation function to update state and scroll to top
    const navigate = useCallback((view) => {
        setCurrentPage(view);
        window.scrollTo(0, 0); 
    }, []);

    // Define all routes and their corresponding components
    const routeComponents = {
        home: HomePage,
        about: AboutPage,
        contact: ContactPage,
        registration: RegistrationPage,
        login: LoginPage,
        forgotPassword: ForgotPasswordPage,
        ...quickLinkMap // Includes all dynamic quick links
    };

    // Determine the component to render based on currentPage state
    const CurrentPage = routeComponents[currentPage] || HomePage;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar currentPage={currentPage} navigate={navigate} />

            <main className="flex-grow">
                {/* Render the selected page, passing the navigation function */}
                <CurrentPage navigate={navigate} />
            </main>

            <Footer />
        </div>
    );
};

export default App;