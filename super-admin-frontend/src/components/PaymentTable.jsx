import { useState } from 'react';
import { Search, ChevronDown, Download } from 'lucide-react';

export default function PaymentTable({ paymentData }) {
  const [searchValue, setSearchValue] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  const filteredData = paymentData.filter(
    (row) =>
      row.panchayatName.toLowerCase().includes(searchValue.toLowerCase()) ||
      row.transactionId.toLowerCase().includes(searchValue.toLowerCase())
  );

  const getPlanBadgeColor = (plan) => {
    switch (plan) {
      case 'Basic':
        return { bg: '#e0f2f1', text: '#00796b', border: '#b2dfdb' };
      case 'Standard':
        return { bg: '#e3f2fd', text: '#1565c0', border: '#bbdefb' };
      case 'Premium':
        return { bg: '#fce4ec', text: '#c2185b', border: '#f8bbd0' };
      default:
        return { bg: '#f5f5f5', text: '#666', border: '#ddd' };
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Successful':
        return { bg: '#e8f5e9', text: '#2D6A4F', border: '#c8e6c9' };
      case 'Failed':
        return { bg: '#ffebee', text: '#d32f2f', border: '#ffcdd2' };
      case 'Pending':
        return { bg: '#fff3e0', text: '#e65100', border: '#ffe0b2' };
      default:
        return { bg: '#f5f5f5', text: '#666', border: '#ddd' };
    }
  };

  const getActionButton = (status) => {
    if (status === 'Failed') {
      return {
        text: 'Retry',
        bgColor: 'bg-yellow-500 hover:bg-yellow-600',
      };
    }
    return {
      text: 'Details',
      bgColor: 'bg-gray-400 hover:bg-gray-500',
    };
  };

  return (
    <div>
      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search
            size={18}
            className="absolute left-3 top-3 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search Transaction ID"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative w-40">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between hover:bg-gray-50"
          >
            Filter
            <ChevronDown size={16} />
          </button>

          {filterOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700">
                Successful
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 border-t border-gray-200">
                Failed
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 border-t border-gray-200">
                Pending
              </button>
            </div>
          )}
        </div>

        {/* Export Button */}
        <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition">
          <Download size={16} />
          Export
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-6 py-3 text-gray-700 font-semibold text-sm">
                Panchayat Name
              </th>
              <th className="text-left px-6 py-3 text-gray-700 font-semibold text-sm">
                Plan Name
              </th>
              <th className="text-left px-6 py-3 text-gray-700 font-semibold text-sm">
                Amount
              </th>
              <th className="text-left px-6 py-3 text-gray-700 font-semibold text-sm">
                Payment Date
              </th>
              <th className="text-left px-6 py-3 text-gray-700 font-semibold text-sm">
                Transaction ID
              </th>
              <th className="text-left px-6 py-3 text-gray-700 font-semibold text-sm">
                Status
              </th>
              <th className="text-left px-6 py-3 text-gray-700 font-semibold text-sm">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => {
              const planColor = getPlanBadgeColor(row.planName);
              const statusColor = getStatusBadgeColor(row.status);
              const actionButton = getActionButton(row.status);

              return (
                <tr
                  key={row.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 text-gray-800 font-medium text-sm">
                    {row.panchayatName}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold border inline-block"
                      style={{
                        backgroundColor: planColor.bg,
                        color: planColor.text,
                        borderColor: planColor.border,
                      }}
                    >
                      {row.planName}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-800 font-medium text-sm">
                    {row.amount}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {row.paymentDate}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {row.transactionId}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold border inline-block"
                      style={{
                        backgroundColor: statusColor.bg,
                        color: statusColor.text,
                        borderColor: statusColor.border,
                      }}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className={`px-4 py-2 rounded text-xs font-semibold text-white transition ${actionButton.bgColor}`}
                    >
                      {actionButton.text}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No payments found matching your search.
        </div>
      )}
    </div>
  );
}
