import React from 'react';
import { Users, Smartphone, Mail, MapPin, Leaf } from 'lucide-react';
import Button from './shared/Button';
import Breadcrumb from './shared/Breadcrumb';
import { contactMembers } from '../config';

const ContactPage = ({ navigate }) => {

    /* ================= CONTACT MEMBER CARD ================= */
    const MemberContactCard = ({ member }) => (
        <div className="
            relative bg-white p-8 rounded-2xl
            border-2 border-green-300
            shadow-[0_10px_30px_rgba(0,0,0,0.08)]
            hover:shadow-[0_18px_45px_rgba(0,0,0,0.14)]
            hover:-translate-y-1
            transition-all duration-300
            overflow-hidden
        ">
            {/* Eco accent bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-700 to-emerald-500" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

                {/* Left section */}
                <div className="flex items-start md:items-center">
                    <div className="
                        w-14 h-14 rounded-full
                        bg-gradient-to-br from-green-100 to-green-200
                        flex items-center justify-center
                        mr-5 border border-green-300
                    ">
                        <Users className="w-7 h-7 text-green-700" />
                    </div>

                    <div>
                        <p className="text-xl font-bold text-gray-900">
                            {member.name}
                        </p>
                        <p className="text-sm text-green-700 font-medium">
                            {member.designation}
                        </p>
                    </div>
                </div>

                {/* Right section */}
                <div className="
                    bg-green-50 border border-green-200
                    rounded-xl px-5 py-4
                    min-w-[260px]
                ">
                    <p className="text-sm text-gray-700 flex items-center mb-2">
                        <Smartphone className="w-4 h-4 mr-2 text-green-600" />
                        {member.phone}
                    </p>
                    <p className="text-sm text-gray-700 flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-green-600" />
                        {member.email}
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-100">
            <div className="container mx-auto pt-10 px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb */}
                <Breadcrumb
                    path={[
                        { label: 'Home', view: 'home' },
                        { label: 'Contact', view: null }
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
                        Contact Committee
                    </h1>
                    <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
                        Connect with government officials responsible for
                        cleanliness, waste collection, and environmental sustainability.
                    </p>
                </div>

                {/* Contact Members */}
                <div className="max-w-5xl mx-auto space-y-8">
                    {contactMembers.map((member, index) => (
                        <MemberContactCard key={index} member={member} />
                    ))}
                </div>

                {/* Office Section */}
                <div className="
                    mt-24 text-center
                    bg-white rounded-2xl
                    border-2 border-green-300
                    shadow-[0_14px_40px_rgba(0,0,0,0.12)]
                    p-12 max-w-3xl mx-auto
                ">
                    <h2 className="text-3xl font-extrabold text-green-900 mb-4">
                        Our Main Office
                    </h2>

                    <p className="text-gray-700 font-medium">
                        Door-to-Door Garbage Collection Headquarters
                    </p>
                    <p className="text-gray-600 mt-1">
                        123 Clean Street, Ward 5, Pincode 90210
                    </p>

                    <div className="mt-8 flex justify-center">
                        <Button
                            onClick={() => alert('Opening map...')}
                            outline={true}
                            className="
                                flex items-center gap-2
                                border-green-700 text-green-800
                                hover:bg-green-700 hover:text-white
                                transition-all
                            "
                        >
                            <MapPin className="w-4 h-4" />
                            View on Map
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ContactPage;
