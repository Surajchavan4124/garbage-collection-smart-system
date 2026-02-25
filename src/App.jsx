import React, { useState } from 'react';
import Navbar from './component/Navbar';
import Home from './component/Home';
import About from './component/About';
import Contact from './component/Contact';
import RegistrationPage from './component/RegistrationPage';
import ComplaintPage from './component/ComplaintPage';
import QuickLinkPage from './component/shared/QuickLinkPage';

// Auth Pages
import LoginPage from './component/auth/LoginPage';
import LoginHousehold from './component/auth/LoginHousehold';
import LoginCompany from './component/auth/LoginCompany';
import RegistrationHousehold from './component/auth/RegistrationHousehold';
import RegistrationCompany from './component/auth/RegistrationCompany';
import ForgotPasswordPage from './component/auth/ForgotPasswordPage';

// Dashboard Pages
import HouseholdDashboard from './component/dashboard/HouseholdDashboard';
import CompanyDashboard from './component/dashboard/CompanyDashboard';
import AdminDashboard from './component/dashboard/AdminDashboard';

// Feature Pages
import ScheduleBooking from './component/ScheduleBooking';
import UserProfile from './component/UserProfile';
import PaymentHistory from './component/PaymentHistory';

// Management Pages
import UsersManagement from './component/management/UsersManagement';
import CompaniesManagement from './component/management/CompaniesManagement';
import FleetManagement from './component/management/FleetManagement';
import ComplaintsManagement from './component/management/ComplaintsManagement';
import SystemSettings from './component/management/SystemSettings';

function App() {
    const [view, setView] = useState('home');

    const navigate = (newView) => {
        setView(newView);
    };

    const renderView = () => {
        switch (view) {
            case 'home':
                return <Home navigate={navigate} />;

            case 'about':
                return <About navigate={navigate} />;

            case 'contact':
                return <Contact navigate={navigate} />;

            case 'register':
                return <RegistrationPage navigate={navigate} />;

            case 'complaint':
                return <ComplaintPage navigate={navigate} />;

            // Auth Pages - Login
            case 'login':
                return <LoginPage navigate={navigate} />;

            case 'login-household':
                return <LoginHousehold navigate={navigate} />;

            case 'login-company':
                return <LoginCompany navigate={navigate} />;

            // Auth Pages - Registration
            case 'registration-household':
                return <RegistrationHousehold navigate={navigate} />;

            case 'registration-company':
                return <RegistrationCompany navigate={navigate} />;

            case 'forgot-password':
                return <ForgotPasswordPage navigate={navigate} />;

            // Dashboard Pages
            case 'household-dashboard':
                return <HouseholdDashboard navigate={navigate} />;

            case 'company-dashboard':
                return <CompanyDashboard navigate={navigate} />;

            case 'admin-dashboard':
                return <AdminDashboard navigate={navigate} />;

            // Feature Pages
            case 'schedule-booking':
                return <ScheduleBooking navigate={navigate} />;

            case 'user-profile':
                return <UserProfile navigate={navigate} />;

            case 'payments':
                return <PaymentHistory navigate={navigate} />;

            // Management Pages
            case 'users-management':
                return <UsersManagement navigate={navigate} />;

            case 'companies-management':
                return <CompaniesManagement navigate={navigate} />;

            case 'fleet-management':
                return <FleetManagement navigate={navigate} />;

            case 'complaints-management':
                return <ComplaintsManagement navigate={navigate} />;

            case 'system-settings':
                return <SystemSettings navigate={navigate} />;

            /* ----------- QUICK LINKS ----------- */

            case 'howItWorks':
                return <QuickLinkPage navigate={navigate} title="How it works" />;

            case 'submitComplaint':
                return <QuickLinkPage navigate={navigate} title="Submit Complaint" />;

            case 'statisticsReports':
                return <QuickLinkPage navigate={navigate} title="Statistics" />;

            case 'viewSchedule':
                return <QuickLinkPage navigate={navigate} title="View Schedule" />;

            case 'guidesResources':
                return <QuickLinkPage navigate={navigate} title="Guides / Resources" />;

            case 'eventsWorkshops':
                return <QuickLinkPage navigate={navigate} title="Events & Workshops" />;

            case 'newsUpdates':
                return <QuickLinkPage navigate={navigate} title="News & Updates" />;

            case 'faqsFeedback':
                return <QuickLinkPage navigate={navigate} title="FAQ’s & Feedback" />;

            default:
                return <Home navigate={navigate} />;
        }
    };

    return (
        <>
            <Navbar navigate={navigate} currentPage={view} />
            {renderView()}
        </>
    );
}

export default App;