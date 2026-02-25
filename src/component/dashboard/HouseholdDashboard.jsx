import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Truck, Clock, AlertCircle, Plus, LogOut } from 'lucide-react';
import Button from '../shared/Button';

const HouseholdDashboard = ({ navigate }) => {
    const [schedules, setSchedules] = useState([
        { id: 1, date: '2025-03-01', time: '08:00 AM', status: 'Confirmed' },
        { id: 2, date: '2025-03-08', time: '08:00 AM', status: 'Pending' },
    ]);
    const [complaints, setComplaints] = useState([
        { id: 1, title: 'Missed Collection', date: '2025-02-20', status: 'Resolved' },
        { id: 2, title: 'Driver Behavior', date: '2025-02-18', status: 'In Progress' },
    ]);

    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4 md:p-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex justify-between items-center"
            >
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Welcome Back!</h1>
                    <p className="text-gray-600 mt-2">Your household waste management dashboard</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate('home')}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </motion.button>
            </motion.div>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Pickups', value: '12', icon: <Truck className="w-6 h-6" /> },
                    { label: 'This Month', value: '3', icon: <Calendar className="w-6 h-6" /> },
                    { label: 'Active Complaints', value: '1', icon: <AlertCircle className="w-6 h-6" /> },
                    { label: 'Member Since', value: '2024', icon: <Clock className="w-6 h-6" /> },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                            </div>
                            <div className="text-green-500">{stat.icon}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Upcoming Schedules */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Upcoming Schedules</h2>
                        <Button
                            onClick={() => navigate('schedule-booking')}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                        >
                            <Plus className="w-5 h-5" />
                            Schedule Pickup
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {schedules.map((schedule, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ x: 4 }}
                                className="flex items-center justify-between bg-green-50 p-4 rounded-xl border border-green-200 hover:border-green-400 transition"
                            >
                                <div className="flex items-center gap-4">
                                    <Calendar className="w-5 h-5 text-green-600" />
                                    <div>
                                        <p className="font-semibold text-gray-900">{schedule.date}</p>
                                        <p className="text-sm text-gray-600">{schedule.time}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    schedule.status === 'Confirmed'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {schedule.status}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl shadow-xl p-6"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                    <div className="space-y-3">
                        {[
                            { label: 'View Schedule', action: 'viewSchedule', color: 'blue' },
                            { label: 'Submit Complaint', action: 'complaint', color: 'red' },
                            { label: 'View Statistics', action: 'statisticsReports', color: 'green' },
                            { label: 'Payment History', action: 'payments', color: 'purple' },
                        ].map((action, i) => (
                            <motion.button
                                key={i}
                                whileHover={{ x: 4 }}
                                onClick={() => navigate(action.action)}
                                className={`w-full text-left px-4 py-3 rounded-lg border-2 border-${action.color}-200 hover:bg-${action.color}-50 transition font-medium text-gray-900`}
                            >
                                {action.label}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Recent Complaints */}
            <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 }}
                className="mt-8 bg-white rounded-2xl shadow-xl p-6"
            >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Complaints</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b-2 border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Title</th>
                                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Date</th>
                                <th className="text-left py-3 px-4 text-gray-600 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {complaints.map((complaint, i) => (
                                <tr key={i} className="border-b border-gray-100 hover:bg-green-50 transition">
                                    <td className="py-3 px-4 text-gray-900">{complaint.title}</td>
                                    <td className="py-3 px-4 text-gray-600">{complaint.date}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            complaint.status === 'Resolved'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {complaint.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default HouseholdDashboard;
