import { useState } from 'react';
import { Search } from 'lucide-react';

export default function TicketsTable({
  ticketData,
  selectedFilter,
  onFilterChange,
}) {
  const [searchValue, setSearchValue] = useState('');

  const filterOptions = ['All', 'Open', 'In Progress', 'Resolved'];

  const filteredData = ticketData.filter((row) => {
    const matchesSearch =
      row.ticketId.toLowerCase().includes(searchValue.toLowerCase()) ||
      row.panchayatName.toLowerCase().includes(searchValue.toLowerCase());

    const matchesFilter =
      selectedFilter === 'All' || row.status === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return { bg: '#ffebee', text: '#d32f2f', border: '#ffcdd2' };
      case 'In Progress':
        return { bg: '#fff3e0', text: '#f57c00', border: '#ffe0b2' };
      case 'Resolved':
        return { bg: '#e0f2f1', text: '#00796b', border: '#b2dfdb' };
      default:
        return { bg: '#f5f5f5', text: '#666', border: '#ddd' };
    }
  };

  return (
    <div>
      {/* Search Input */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search
            size={18}
            className="absolute left-3 top-3 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search Panchayat"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-6">
        {filterOptions.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`px-4 py-2 rounded font-semibold text-sm transition ${
              selectedFilter === filter
                ? 'bg-teal-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-6 py-3 text-gray-700 font-semibold text-sm">
                Ticket ID
              </th>
              <th className="text-left px-6 py-3 text-gray-700 font-semibold text-sm">
                Panchayat Name
              </th>
              <th className="text-left px-6 py-3 text-gray-700 font-semibold text-sm">
                Issue Type
              </th>
              <th className="text-left px-6 py-3 text-gray-700 font-semibold text-sm">
                Created Date
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
              const statusColor = getStatusColor(row.status);

              return (
                <tr
                  key={row.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 text-gray-800 font-medium text-sm">
                    {row.ticketId}
                  </td>
                  <td className="px-6 py-4 text-gray-800 text-sm">
                    {row.panchayatName}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {row.issueType}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {row.createdDate}
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
                    <button className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded text-xs font-semibold transition">
                      Details
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
          No tickets found matching your search or filter.
        </div>
      )}
    </div>
  );
}
