import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, CheckCircle } from 'lucide-react';
import Button from './shared/Button';

const ScheduleBooking = ({ navigate }) => {
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        address: '',
        phone: '',
        wasteType: 'mixed',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            navigate('household-dashboard');
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto"
            >
                {/* Header */}
                <div className="mb-8">
                    <button onClick={() => navigate('household-dashboard')} className="text-green-600 hover:text-green-700 mb-4">
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-bold text-gray-900">Schedule a Pickup</h1>
                    <p className="text-gray-600 mt-2">Choose a convenient time for your waste collection</p>
                </div>

                {!submitted ? (
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleSubmit}
                        className="bg-white rounded-2xl shadow-xl p-8"
                    >
                        {/* Date */}
                        <div className="mb-6">
                            <label className="block text-gray-900 font-semibold mb-2">
                                <Calendar className="inline w-5 h-5 mr-2 text-green-600" />
                                Preferred Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-lg border-2 border-green-200 focus:border-green-600 focus:outline-none"
                            />
                        </div>

                        {/* Time */}
                        <div className="mb-6">
                            <label className="block text-gray-900 font-semibold mb-2">
                                <Clock className="inline w-5 h-5 mr-2 text-green-600" />
                                Preferred Time
                            </label>
                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-lg border-2 border-green-200 focus:border-green-600 focus:outline-none"
                            />
                        </div>

                        {/* Address */}
                        <div className="mb-6">
                            <label className="block text-gray-900 font-semibold mb-2">
                                <MapPin className="inline w-5 h-5 mr-2 text-green-600" />
                                Pickup Address
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                placeholder="Enter your full address"
                                rows="3"
                                className="w-full px-4 py-3 rounded-lg border-2 border-green-200 focus:border-green-600 focus:outline-none"
                            ></textarea>
                        </div>

                        {/* Waste Type */}
                        <div className="mb-6">
                            <label className="block text-gray-900 font-semibold mb-2">Waste Type</label>
                            <select
                                name="wasteType"
                                value={formData.wasteType}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border-2 border-green-200 focus:border-green-600 focus:outline-none"
                            >
                                <option value="mixed">Mixed Waste</option>
                                <option value="organic">Organic Waste</option>
                                <option value="recyclable">Recyclable</option>
                                <option value="hazardous">Hazardous Waste</option>
                            </select>
                        </div>

                        {/* Phone */}
                        <div className="mb-8">
                            <label className="block text-gray-900 font-semibold mb-2">Contact Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                placeholder="+91 XXXXX XXXXX"
                                className="w-full px-4 py-3 rounded-lg border-2 border-green-200 focus:border-green-600 focus:outline-none"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
                        >
                            Schedule Pickup
                        </Button>
                    </motion.form>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-xl p-12 text-center"
                    >
                        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pickup Scheduled!</h2>
                        <p className="text-gray-600 mb-4">
                            Your pickup has been confirmed for {formData.date} at {formData.time}
                        </p>
                        <p className="text-sm text-gray-500">You will receive a confirmation SMS shortly.</p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default ScheduleBooking;
