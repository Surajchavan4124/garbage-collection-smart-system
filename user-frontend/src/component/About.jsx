import React, { useState } from 'react';
import {
    ChevronDown,
    FileText,
    LineChart,
    Calendar,
    Scale,
    Leaf
} from 'lucide-react';
import Button from './shared/Button';
import Breadcrumb from './shared/Breadcrumb';

const AboutPage = ({ navigate }) => {
    const [expanded, setExpanded] = useState('mission');

    /* ================= ACCORDION ITEM ================= */
    const AccordionItem = ({ id, title, children }) => (
        <div className="border-b border-green-200">
            <button
                className="
                    flex justify-between items-center w-full p-6
                    text-left font-semibold text-green-900
                    hover:bg-green-50 transition-all
                "
                onClick={() => setExpanded(expanded === id ? null : id)}
            >
                {title}
                <ChevronDown
                    className={`w-5 h-5 text-green-700 transition-transform duration-300
                    ${expanded === id ? 'rotate-180' : 'rotate-0'}`}
                />
            </button>

            {expanded === id && (
                <div className="
                    p-6 text-gray-700 bg-green-50
                    border-t border-green-200
                    leading-relaxed
                ">
                    {children}
                </div>
            )}
        </div>
    );

    /* ================= GUIDING CARD ================= */
    const GuidingPrincipleCard = ({ icon: Icon, title, buttonLabel, navigateTarget }) => (
        <div className="
            bg-white rounded-2xl p-8 text-center
            border-2 border-green-300
            shadow-[0_10px_30px_rgba(0,0,0,0.08)]
            hover:shadow-[0_18px_45px_rgba(0,0,0,0.14)]
            hover:-translate-y-1
            transition-all duration-300
        ">
            <div className="
                w-16 h-16 mx-auto mb-5 rounded-full
                bg-gradient-to-br from-green-100 to-green-200
                flex items-center justify-center
                border border-green-300
            ">
                <Icon className="w-8 h-8 text-green-700" />
            </div>

            <p className="font-semibold text-gray-800 mb-5">
                {title}
            </p>

            <Button
                primary={true}
                small={true}
                onClick={() => navigate(navigateTarget)}
                className="w-full"
            >
                {buttonLabel}
            </Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-100">
            <div className="container mx-auto pt-10 px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <Breadcrumb
                    path={[
                        { label: 'Home', view: 'home' },
                        { label: 'About', view: null }
                    ]}
                    navigate={navigate}
                />

                {/* Page Header */}
                <div className="text-center mt-10 mb-16">
                    <div className="flex justify-center mb-4">
                        <div className="
                            w-16 h-16 rounded-full
                            bg-gradient-to-br from-green-100 to-green-200
                            flex items-center justify-center
                            border border-green-300
                        ">
                            <Leaf className="w-8 h-8 text-green-700" />
                        </div>
                    </div>

                    <h1 className="text-4xl font-extrabold text-green-900">
                        About Our Mission
                    </h1>

                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                        A government-led initiative focused on cleanliness,
                        sustainability, and responsible waste management.
                    </p>
                </div>

                {/* Core Information (Accordion) */}
                <div className="
                    max-w-4xl mx-auto mb-20
                    rounded-2xl overflow-hidden
                    border-2 border-green-300
                    shadow-[0_16px_45px_rgba(0,0,0,0.12)]
                    bg-white
                ">
                    <AccordionItem id="mission" title="Our Mission">
                        <p>
                            Our mission is to create a cleaner, zero-waste community
                            by providing every household with a simple, transparent,
                            and efficient system for waste segregation and collection.
                            Together, we aim to protect the environment and reduce
                            landfill waste.
                        </p>
                    </AccordionItem>

                    <AccordionItem id="objectives" title="Our Key Objectives">
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Achieve 100% household registration.</li>
                            <li>Maintain segregation compliance above 95%.</li>
                            <li>Use technology for efficient monitoring.</li>
                            <li>Promote recycling and composting.</li>
                        </ul>
                    </AccordionItem>

                    <AccordionItem id="works" title="How Our Program Works">
                        <p>
                            The program follows four steps: Segregation,
                            Collection, Processing, and Reporting.
                            Color-coded bins ensure proper waste separation,
                            and transparent reporting keeps citizens informed.
                        </p>

                        <Button
                            onClick={() => navigate('howItWorks')}
                            small={true}
                            className="mt-4"
                        >
                            View Detailed Guide
                        </Button>
                    </AccordionItem>

                    <AccordionItem id="legal" title="Legal & Compliance">
                        <div className="flex items-center text-sm font-medium text-gray-700">
                            <Scale className="w-4 h-4 mr-2 text-green-700" />
                            Operating under Municipal Waste Management Bylaws.
                        </div>
                    </AccordionItem>
                </div>

                {/* Guiding Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
                    <GuidingPrincipleCard
                        icon={FileText}
                        title="File a Complaint"
                        buttonLabel="Lodge Issue"
                        navigateTarget="submitComplaint"
                    />
                    <GuidingPrincipleCard
                        icon={LineChart}
                        title="View Statistics"
                        buttonLabel="See Reports"
                        navigateTarget="statisticsReports"
                    />
                    <GuidingPrincipleCard
                        icon={Calendar}
                        title="Check Collection Schedule"
                        buttonLabel="View Dates"
                        navigateTarget="viewSchedule"
                    />
                </div>

                {/* CTA */}
                <div className="
                    text-center pb-16
                    bg-white max-w-3xl mx-auto
                    rounded-2xl p-12
                    border-2 border-green-300
                    shadow-[0_14px_40px_rgba(0,0,0,0.12)]
                ">
                    <h2 className="text-3xl font-extrabold text-green-900 mb-4">
                        Ready to Join the Movement?
                    </h2>

                    <p className="text-gray-600 mb-6">
                        Register today and be part of a cleaner,
                        greener future.
                    </p>

                    <Button
                        primary={false}
                        onClick={() => navigate('registration')}
                        className="text-lg px-10 py-3"
                    >
                        Register Now
                    </Button>
                </div>

            </div>
        </div>
    );
};

export default AboutPage;
