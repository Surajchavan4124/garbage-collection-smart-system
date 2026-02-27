import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Truck, Info } from 'lucide-react';
import Breadcrumb from './shared/Breadcrumb';
import Footer from './shared/Footer';

const fullSchedule = [
    { ward: 'Ward 1', days: ['Mon', 'Wed', 'Fri'], time: '7:00 AM – 10:00 AM', area: 'Main Colony, Sector A', vehicle: 'GJ-05-TM-1234', color: 'from-blue-500 to-cyan-400', bg: 'bg-blue-50 border-blue-200' },
    { ward: 'Ward 2', days: ['Tue', 'Thu', 'Sat'], time: '8:00 AM – 11:00 AM', area: 'Market Area, Sector B', vehicle: 'GJ-05-TM-5678', color: 'from-green-500 to-emerald-400', bg: 'bg-green-50 border-green-200' },
    { ward: 'Ward 3', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], time: '6:30 AM – 9:30 AM', area: 'Industrial Zone, Sector C', vehicle: 'GJ-05-TM-9012', color: 'from-purple-500 to-violet-400', bg: 'bg-purple-50 border-purple-200' },
    { ward: 'Ward 4', days: ['Mon', 'Thu'], time: '9:00 AM – 12:00 PM', area: 'New Colony, Sector D', vehicle: 'GJ-05-TM-3456', color: 'from-amber-500 to-orange-400', bg: 'bg-amber-50 border-amber-200' },
    { ward: 'Ward 5', days: ['Tue', 'Fri', 'Sat'], time: '7:30 AM – 10:30 AM', area: 'Old Town, Sector E', vehicle: 'GJ-05-TM-7890', color: 'from-rose-500 to-pink-400', bg: 'bg-rose-50 border-rose-200' },
];

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.45 } })
};

const ViewSchedulePage = ({ navigate }) => {
    const [view, setView] = useState('cards'); // 'cards' | 'week'

    return (
        <div className="min-h-screen" style={{ background: 'var(--surface-2)' }}>
            <div className="max-w-5xl mx-auto px-4 py-10">
                <Breadcrumb path={[{ label: 'View Schedule', view: null }]} navigate={navigate} />

                {/* Header */}
                <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center mb-10">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 border border-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-7 h-7 text-green-600" />
                    </div>
                    <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">
                        Collection <span className="gradient-text">Schedule</span>
                    </h1>
                    <p className="text-gray-500">Know your ward's pickup days and never miss a collection.</p>
                </motion.div>

                {/* Notice Banner */}
                <motion.div
                    variants={fadeUp}
                    custom={1}
                    initial="hidden"
                    animate="visible"
                    className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl mb-8"
                >
                    <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-amber-700">
                        <span className="font-semibold">Note:</span> Schedule may change on public holidays. Check News & Updates for notifications.
                    </p>
                </motion.div>

                {/* View Toggle */}
                <motion.div variants={fadeUp} custom={2} initial="hidden" animate="visible" className="flex gap-2 mb-8">
                    {[['cards', 'Ward View'], ['week', 'Weekly Grid']].map(([val, label]) => (
                        <button
                            key={val}
                            onClick={() => setView(val)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                                view === val ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 bg-white text-gray-600'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </motion.div>

                {view === 'cards' ? (
                    <div className="space-y-4">
                        {fullSchedule.map((ward, i) => (
                            <motion.div
                                key={i}
                                custom={i}
                                variants={fadeUp}
                                initial="hidden"
                                animate="visible"
                                className={`card border ${ward.bg} overflow-hidden`}
                            >
                                <div className={`h-1.5 bg-gradient-to-r ${ward.color}`} />
                                <div className="p-6 flex flex-col sm:flex-row sm:items-center gap-5">
                                    <div className="flex-1">
                                        <h3 className="font-display font-bold text-gray-900 text-lg mb-1">{ward.ward}</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                                            <MapPin className="w-3.5 h-3.5 text-green-500" />
                                            {ward.area}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                            <Clock className="w-3.5 h-3.5 text-green-500" />
                                            {ward.time}
                                        </div>
                                        <div className="flex gap-1.5 flex-wrap">
                                            {weekDays.map(day => (
                                                <span
                                                    key={day}
                                                    className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                                                        ward.days.includes(day)
                                                            ? 'bg-green-600 text-white'
                                                            : 'bg-gray-100 text-gray-400'
                                                    }`}
                                                >
                                                    {day}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/60 rounded-xl px-3 py-2 border border-gray-100">
                                        <Truck className="w-4 h-4 text-green-500" />
                                        {ward.vehicle}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    /* Weekly Grid */
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card overflow-hidden"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">Ward</th>
                                        {weekDays.map(d => (
                                            <th key={d} className="py-3 px-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{d}</th>
                                        ))}
                                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fullSchedule.map((ward, i) => (
                                        <tr key={i} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-4 font-semibold text-gray-900 text-sm">{ward.ward}</td>
                                            {weekDays.map(day => (
                                                <td key={day} className="py-4 px-4 text-center">
                                                    {ward.days.includes(day) ? (
                                                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-green-600 text-white text-xs font-bold">✓</span>
                                                    ) : (
                                                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 text-gray-300 text-xs">—</span>
                                                    )}
                                                </td>
                                            ))}
                                            <td className="py-4 px-4 text-xs text-gray-500">{ward.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </div>
            <Footer navigate={navigate} />
        </div>
    );
};

export default ViewSchedulePage;
