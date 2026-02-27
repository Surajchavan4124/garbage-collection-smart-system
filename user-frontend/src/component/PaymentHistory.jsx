import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Download, AlertCircle, CheckCircle } from 'lucide-react';
import Button from './shared/Button';

const PaymentHistory = ({ navigate }) => {
    const [payments] = useState([
        { id: 'INV-001', date: '2025-02-01', amount: 500, status: 'Paid', method: 'UPI' },
        { id: 'INV-002', date: '2025-01-01', amount: 500, status: 'Paid', method: 'Debit Card' },
        { id: 'INV-003', date: '2024-12-01', amount: 450, status: 'Paid', method: 'Net Banking' },
        { id: 'INV-004', date: '2024-11-01', amount: 500, status: 'Pending', method: '-' },
    ]);

    const [bills] = useState([
        { month: 'February 2025', amount: 500, dueDate: '2025-02-28', status: 'Unpaid' },
        { month: 'March 2025', amount: 500, dueDate: '2025-03-31', status: 'Not Generated' },
    ]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                {/* Header */}
                <div className="mb-8">
                    <button onClick={() => navigate('household-dashboard')} className="text-purple-600 hover:text-purple-700 mb-4">
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-bold text-gray-900">Payments & Billing</h1>
                    <p className="text-gray-600 mt-2">Manage your payments and view invoices</p>
                </div>

                {/* Summary Cards */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    {[
                        { label: 'Total Paid', value: '₹1,950', icon: <CheckCircle className="w-6 h-6" />, color: 'green' },
                        { label: 'Pending', value: '₹500', icon: <AlertCircle className="w-6 h-6" />, color: 'orange' },
                        { label: 'Next Due', value: '2025-02-28', icon: <CreditCard className="w-6 h-6" />, color: 'blue' },
                    ].map((card, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`bg-white rounded-xl shadow-lg p-6 border-l-4 border-${card.color}-500`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">{card.label}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
                                </div>
                                <div className={`text-${card.color}-500`}>{card.icon}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Pending Bills */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-xl p-6 mb-8"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Pending Bills</h2>
                    <div className="space-y-3">
                        {bills.map((bill, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ x: 4 }}
                                className="flex items-center justify-between p-4 rounded-lg border-2 border-purple-100 hover:border-purple-400 transition"
                            >
                                <div>
                                    <p className="font-semibold text-gray-900">{bill.month}</p>
                                    <p className="text-sm text-gray-600">Due: {bill.dueDate}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="text-2xl font-bold text-gray-900">₹{bill.amount}</p>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        bill.status === 'Unpaid'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {bill.status}
                                    </span>
                                    {bill.status === 'Unpaid' && (
                                        <Button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
                                            Pay Now
                                        </Button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Payment History */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl shadow-xl p-6"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment History</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b-2 border-gray-200">
                                <tr>
                                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Invoice</th>
                                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Date</th>
                                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Amount</th>
                                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Status</th>
                                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Method</th>
                                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((payment, i) => (
                                    <tr key={i} className="border-b border-gray-100 hover:bg-purple-50 transition">
                                        <td className="py-3 px-4 font-semibold text-gray-900">{payment.id}</td>
                                        <td className="py-3 px-4 text-gray-600">{payment.date}</td>
                                        <td className="py-3 px-4 font-semibold text-gray-900">₹{payment.amount}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                payment.status === 'Paid'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">{payment.method}</td>
                                        <td className="py-3 px-4">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                className="text-purple-600 hover:text-purple-800 transition"
                                            >
                                                <Download className="w-5 h-5" />
                                            </motion.button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default PaymentHistory;
