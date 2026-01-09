import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import TicketOverviewCard from '../components/TicketOverviewCard';
import TicketsTable from '../components/TicketsTable';

export default function SupportQueries({ onPageChange }) {
  const overviewStats = [
    {
      id: 1,
      title: 'Open Tickets',
      count: '2',
      description: 'Unresolved issues needing attention',
      icon: 'open',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
    {
      id: 2,
      title: 'In Progress',
      count: '5',
      description: 'Currently being handled',
      icon: 'progress',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      id: 3,
      title: 'Solved',
      count: '10',
      description: 'Successfully closed tickets',
      icon: 'solved',
      color: 'text-teal-500',
      bgColor: 'bg-teal-50',
    },
  ];

  const [selectedFilter, setSelectedFilter] = useState('All');

  const ticketData = [
    {
      id: 1,
      ticketId: 'T-01',
      panchayatName: 'Mapusa Panchayat',
      issueType: 'Payment Issue',
      createdDate: 'Oct 25, 2025, 10:42 AM',
      status: 'Open',
    },
    {
      id: 2,
      ticketId: 'T-02',
      panchayatName: 'Verma Panchayat',
      issueType: 'Technical Bug',
      createdDate: 'Oct 25, 2025, 10:42 AM',
      status: 'In Progress',
    },
    {
      id: 3,
      ticketId: 'T-03',
      panchayatName: 'Navelim Panchayat',
      issueType: 'Subscription Inquiry',
      createdDate: 'Oct 25, 2025, 10:42 AM',
      status: 'Resolved',
    },
    {
      id: 4,
      ticketId: 'T-04',
      panchayatName: 'Varca Panchayat',
      issueType: 'Login Issue',
      createdDate: 'Oct 25, 2025, 10:42 AM',
      status: 'Resolved',
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onPageChange={onPageChange} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />

        {/* Breadcrumbs */}
        <div className="px-6 pt-4 pb-2 bg-gray-100 text-sm text-gray-600 border-t border-gray-200">
          Main &gt; Support &amp; Queries
        </div>
        <div className="flex-1 overflow-auto p-6">
          {/* Overview Stats Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Support Query Management
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {overviewStats.map((stat) => (
                <TicketOverviewCard key={stat.id} stat={stat} />
              ))}
            </div>
          </div>

          {/* Tickets Table Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Panchayat Payment Monitoring
            </h2>
            <TicketsTable
              ticketData={ticketData}
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
