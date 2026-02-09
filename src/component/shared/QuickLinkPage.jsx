import React from 'react';
import { Gauge, Leaf } from 'lucide-react';
import Button from './Button';
import Breadcrumb from './Breadcrumb';

const QuickLinkPage = ({ navigate, title }) => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-100">
            <div className="container mx-auto pt-10 px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <Breadcrumb
                    path={[
                        { label: 'Home', view: 'home' },
                        { label: 'Quick Links', view: null },
                        { label: title, view: null }
                    ]}
                    navigate={navigate}
                />

                {/* Main Card */}
                <div className="
                    max-w-4xl mx-auto mt-12
                    bg-white rounded-2xl p-12
                    border-2 border-green-300
                    shadow-[0_18px_45px_rgba(0,0,0,0.12)]
                    text-center
                ">

                    {/* Icon */}
                    <div className="
                        w-20 h-20 mx-auto mb-6
                        rounded-full
                        bg-gradient-to-br from-green-100 to-green-200
                        flex items-center justify-center
                        border border-green-300
                    ">
                        <Gauge className="w-10 h-10 text-green-700" />
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl font-extrabold text-green-900 mb-4">
                        {title}
                    </h1>

                    {/* Description */}
                    <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
                        This page displays information related to the selected
                        quick link. It is part of the government’s digital
                        initiative for transparent and efficient waste
                        management services.
                    </p>

                    <p className="text-md text-gray-500 mt-4">
                        In a real-world application, this section would fetch
                        and display live data based on the selected service.
                    </p>

                    {/* Divider */}
                    <div className="my-8 flex justify-center">
                        <div className="h-1 w-24 bg-green-300 rounded-full"></div>
                    </div>

                    {/* CTA */}
                    <Button
                        onClick={() => navigate('home')}
                        primary={false}
                        className="text-lg px-10 py-3"
                    >
                        Return to Home
                    </Button>

                </div>

                {/* Footer Hint */}
                <div className="text-center mt-12 text-gray-500 flex justify-center items-center gap-2">
                    <Leaf className="w-4 h-4 text-green-600" />
                    <span>Building a cleaner & greener community together</span>
                </div>

            </div>
        </div>
    );
};

export default QuickLinkPage;
