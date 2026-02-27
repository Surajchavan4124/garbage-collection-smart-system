import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Lock, Save } from 'lucide-react';
import Button from './shared/Button';

const UserProfile = ({ navigate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+91 99999 99999',
        address: '123 Main Street, City',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        memberSince: '2024-01-15',
    });
    const [tempProfile, setTempProfile] = useState({ ...profile });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTempProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setProfile({ ...tempProfile });
        setIsEditing(false);
    };

    const InfoCard = ({ icon: Icon, label, value }) => (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-4 p-4 rounded-lg border-2 border-green-200 hover:border-green-400 transition"
        >
            <div className="text-green-600">{<Icon className="w-6 h-6" />}</div>
            <div>
                <p className="text-sm text-gray-600">{label}</p>
                <p className="font-semibold text-gray-900">{value}</p>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto"
            >
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <button onClick={() => navigate('household-dashboard')} className="text-green-600 hover:text-green-700 mb-4">
                            ← Back to Dashboard
                        </button>
                        <h1 className="text-4xl font-bold text-gray-900">User Profile</h1>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => {
                            if (isEditing) handleSave();
                            else setIsEditing(true);
                        }}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                    >
                        {isEditing ? (
                            <>
                                <Save className="w-5 h-5" />
                                Save Changes
                            </>
                        ) : (
                            <>
                                <User className="w-5 h-5" />
                                Edit Profile
                            </>
                        )}
                    </motion.button>
                </div>

                {!isEditing ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Profile Avatar */}
                        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                            <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <User className="w-12 h-12 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                            <p className="text-gray-600 mt-1">Member since {profile.memberSince}</p>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <InfoCard icon={Mail} label="Email" value={profile.email} />
                                <InfoCard icon={Phone} label="Phone" value={profile.phone} />
                                <InfoCard icon={MapPin} label="City" value={profile.city} />
                                <InfoCard icon={MapPin} label="State" value={profile.state} />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Address</h3>
                            <p className="text-gray-700 leading-relaxed">{profile.address}</p>
                        </div>

                        {/* Security */}
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Security</h3>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-semibold transition"
                            >
                                <Lock className="w-5 h-5" />
                                Change Password
                            </motion.button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-xl p-8"
                    >
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h3>
                        <div className="space-y-4">
                            {[
                                { name: 'name', label: 'Full Name' },
                                { name: 'email', label: 'Email' },
                                { name: 'phone', label: 'Phone' },
                                { name: 'address', label: 'Address' },
                                { name: 'city', label: 'City' },
                                { name: 'state', label: 'State' },
                                { name: 'pincode', label: 'Pincode' },
                            ].map((field) => (
                                <div key={field.name}>
                                    <label className="block text-gray-900 font-semibold mb-2">{field.label}</label>
                                    <input
                                        type="text"
                                        name={field.name}
                                        value={tempProfile[field.name]}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg border-2 border-green-200 focus:border-green-600 focus:outline-none"
                                    />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default UserProfile;
