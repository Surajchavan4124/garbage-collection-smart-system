import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import PlanCard from '../components/PlanCard';
import SubscriptionTable from '../components/SubscriptionTable';

export default function SubscriptionPlanManagement({ onPageChange }) {
  const plans = [
    {
      id: 1,
      name: 'Basic',
      price: '₹1,499',
      period: '/year',
      popular: false,
      features: [
        'Max 100 HH',
        'Max 10 Labourers',
        'Basic analytics dashboard',
        'Household registration',
        'Waste tracking',
        'Email support',
      ],
      actions: ['Edit', 'Disable'],
    },
    {
      id: 2,
      name: 'Standard',
      price: '₹2,699',
      period: '/year',
      popular: true,
      badge: 'Most Popular',
      features: [
        'Max 2,600 HH',
        'Max 30 Labourers',
        'Advanced analytics & insights',
        'Labour attendance tracking',
        'Complaint & support ticket system',
        'Monthly performance reports',
      ],
      actions: ['Edit', 'Disable'],
    },
    {
      id: 3,
      name: 'Premium',
      price: '₹5,999',
      period: '/year',
      popular: false,
      features: [
        'Max 5,000 HH',
        'Max 91 Labourers',
        'AI-based waste trend prediction',
        'Route optimization for garbage',
        'Priority support team',
        'Dedicated account manager',
      ],
      actions: ['Edit', 'Disable'],
    },
  ];

  const subscriptions = [
    {
      id: 1,
      panchayat: 'Mapusa Panchayat',
      currentPlan: 'Basic',
      expiryDate: '12 Apr 2026',
      status: 'Active',
      action: 'Change Plan',
      actionType: 'primary',
    },
    {
      id: 2,
      panchayat: 'Verma Panchayat',
      currentPlan: 'Standard',
      expiryDate: '15 Apr 2026',
      status: 'Active',
      action: 'Change Plan',
      actionType: 'primary',
    },
    {
      id: 3,
      panchayat: 'Navelim Panchayat',
      currentPlan: 'Standard',
      expiryDate: '01 Apr 2026',
      status: 'Active',
      action: 'Change Plan',
      actionType: 'primary',
    },
    {
      id: 4,
      panchayat: 'Varca Panchayat',
      currentPlan: 'Premium',
      expiryDate: '22 Apr 2025',
      status: 'Expired',
      action: 'Reactivate',
      actionType: 'warning',
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onPageChange={onPageChange} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />
              {/* Breadcrumbs */}
              <div className="px-6 pt-4 pb-2 bg-gray-100 text-sm text-gray-600 border-t border-gray-200">
                  Main &gt; Subscription Plan Management
              </div>
        <div className="flex-1 overflow-auto p-6">

          {/* Available Plans Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Available Plans
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          </div>

          {/* Panchayat Subscriptions Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Panchayat Subscriptions
            </h2>
            <SubscriptionTable subscriptions={subscriptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
