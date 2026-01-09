import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import PaymentOverviewCard from '../components/PaymentOverviewCard';
import PaymentTable from '../components/PaymentTable';

export default function PaymentMonitoring({ onPageChange }) {
  const overviewStats = [
    {
      id: 1,
      title: 'Successful Payments',
      count: '100',
      icon: 'check',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      id: 2,
      title: 'Pending Payments',
      count: '18',
      icon: 'pending',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      id: 3,
      title: 'Failed Payments',
      count: '5',
      icon: 'failed',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
  ];

  const paymentData = [
    {
      id: 1,
      panchayatName: 'Mapusa Panchayat',
      planName: 'Basic',
      amount: '₹1,499',
      paymentDate: 'Oct 25, 2025, 10:42 AM',
      transactionId: 'pay_0120',
      status: 'Successful',
    },
    {
      id: 2,
      panchayatName: 'Verma Panchayat',
      planName: 'Standard',
      amount: '₹2,699',
      paymentDate: 'Oct 25, 2025, 10:42 AM',
      transactionId: 'pay_0220',
      status: 'Successful',
    },
    {
      id: 3,
      panchayatName: 'Navelim Panchayat',
      planName: 'Standard',
      amount: '₹2,699',
      paymentDate: 'Oct 25, 2025, 10:42 AM',
      transactionId: 'pay_0320',
      status: 'Successful',
    },
    {
      id: 4,
      panchayatName: 'Varca Panchayat',
      planName: 'Premium',
      amount: '₹5,999',
      paymentDate: 'Oct 25, 2025, 10:42 AM',
      transactionId: 'pay_0420',
      status: 'Failed',
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onPageChange={onPageChange} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        {/* Breadcrumbs */}
                <div className="px-6 pt-4 pb-2 bg-gray-100 text-sm text-gray-600 border-t border-gray-200">
                    Main &gt; Payment Monitoring
                </div>
        <div className="flex-1 overflow-auto p-6">
          

          {/* Overview Stats Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Payment Monitoring Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {overviewStats.map((stat) => (
                <PaymentOverviewCard key={stat.id} stat={stat} />
              ))}
            </div>
          </div>

          {/* Payment Table Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Panchayat Payment Monitoring
            </h2>
            <PaymentTable paymentData={paymentData} />
          </div>
        </div>
      </div>
    </div>
  );
}
