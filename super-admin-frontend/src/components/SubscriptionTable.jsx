import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";

export default function SubscriptionTable({ subscriptions }) {
  const [searchValue, setSearchValue] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  /* -------------------- FILTER -------------------- */
  const filteredData = subscriptions.filter((row) =>
    row.panchayatName
      ?.toLowerCase()
      .includes(searchValue.toLowerCase())
  );

  /* -------------------- BADGE COLORS -------------------- */
  const getPlanBadgeColor = (plan) => {
    switch (plan) {
      case "BASIC":
        return { bg: "#e0f2f1", text: "#00796b", border: "#b2dfdb" };
      case "STANDARD":
        return { bg: "#e3f2fd", text: "#1565c0", border: "#bbdefb" };
      case "PREMIUM":
        return { bg: "#fce4ec", text: "#c2185b", border: "#f8bbd0" };
      default:
        return { bg: "#f5f5f5", text: "#666", border: "#ddd" };
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Active":
        return { bg: "#e8f5e9", text: "#2D6A4F", border: "#c8e6c9" };
      case "Expired":
        return { bg: "#fff3e0", text: "#e65100", border: "#ffe0b2" };
      default:
        return { bg: "#f5f5f5", text: "#666", border: "#ddd" };
    }
  };

  return (
    <div>
      {/* Search & Filter */}
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
                Active Plans
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 border-t border-gray-200">
                Expired Plans
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-6 py-3 text-gray-700 font-semibold text-sm">
                Panchayat
              </th>
              <th className="text-left px-6 py-3 text-gray-700 font-semibold text-sm">
                Current Plan
              </th>
              <th className="text-left px-6 py-3 text-gray-700 font-semibold text-sm">
                Expiry Date
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

              return (
                <tr
                  key={row._id}
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

                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {new Date(row.endDate).toLocaleDateString()}
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
                      className={`px-4 py-2 rounded text-xs font-semibold text-white transition ${
                        row.status === "Active"
                          ? "bg-purple-500 hover:bg-purple-600"
                          : "bg-yellow-500 hover:bg-yellow-600"
                      }`}
                    >
                      {row.status === "Active"
                        ? "Change Plan"
                        : "Reactivate"}
                    </button>
                  </td>
                </tr>
              );
            })}

            {filteredData.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500"
                >
                  No subscriptions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
