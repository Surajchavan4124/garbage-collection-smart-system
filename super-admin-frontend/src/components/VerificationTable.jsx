import { useEffect, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import api from "../api/axios";
import { toast } from "react-toastify";
import ViewPanchayatModal from "./ViewPanchayatModal";


export default function VerificationTable({ refreshKey, onChange }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const [viewData, setViewData] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);

  useEffect(() => {
    fetchPanchayats();
  }, [refreshKey]);

  const fetchPanchayats = async () => {
    try {
      const res = await api.get("/company/panchayats?status=pending");
      setRows(res.data);
    } catch {
      toast.error("Failed to load panchayats");
    } finally {
      setLoading(false);
    }
  };
const normalizeStatus = (status) => {
  switch (status) {
    case "pending":
      return "Pending";
    case "active":
      return "Verified";
    case "rejected":
      return "Rejected";
    default:
      return status;
  }
};

const getStatusBadgeColor = (uiStatus) => {
  switch (uiStatus) {
    case "Rejected":
      return { bg: "#ffe5e5", text: "#d9534f", border: "#f5c6c6" };
    case "Verified":
      return { bg: "#e8f5e9", text: "#2D6A4F", border: "#c8e6c9" };
    case "Pending":
      return { bg: "#fff3e0", text: "#f0ad4e", border: "#ffe0b2" };
    default:
      return { bg: "#f5f5f5", text: "#666", border: "#ddd" };
  }
};

  const handleApprove = async (id) => {
    try {
      await api.patch(`/company/panchayats/${id}/approve`);
      toast.success("Panchayat approved");
      setViewOpen(false);
      fetchPanchayats();
      onChange?.();
    } catch {
      toast.error("Approval failed");
    }
  };

  const handleReject = async (id) => {
    try {
      await api.patch(`/company/panchayats/${id}/reject`);
      toast.success("Panchayat rejected");
      setViewOpen(false);
      fetchPanchayats();
      onChange?.();
    } catch {
      toast.error("Rejection failed");
    }
  };

  const handleViewClick = async (row) => {
    try {
      const res = await api.get(`/company/panchayats/${row._id}`);
      setViewData(res.data);
      setViewOpen(true);
    } catch {
      toast.error("Failed to load panchayat details");
    }
  };

  const filteredData = rows.filter(
    (row) =>
      row.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      row.address?.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search Panchayat"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
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
                  by Status
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 border-t border-gray-200">
                  by Date
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 border-t border-gray-200">
                  by Area
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-6 text-gray-500">
            Loading verification requests...
          </div>
        )}

        {/* Table */}
        {!loading && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left px-4 py-3 text-gray-700 font-semibold text-sm">
                    Panchayat Name
                  </th>
                  <th className="text-left px-4 py-3 text-gray-700 font-semibold text-sm">
                    Address
                  </th>
                  <th className="text-left px-4 py-3 text-gray-700 font-semibold text-sm">
                    Submitted Date
                  </th>
                  <th className="text-left px-4 py-3 text-gray-700 font-semibold text-sm">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-gray-700 font-semibold text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row) => {
                  const uiStatus = normalizeStatus(row.status);
                  const statusColor = getStatusBadgeColor(uiStatus);

                  return (
                    <tr
                      key={row._id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-4 py-4 text-gray-800 font-medium text-sm">
                        {row.name}
                      </td>
                      <td className="px-4 py-4 text-gray-600 text-sm">
                        {row.address || "—"}
                      </td>
                      <td className="px-4 py-4 text-gray-600 text-sm">
                        {new Date(row.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold border inline-block"
                          style={{
                            backgroundColor: statusColor.bg,
                            color: statusColor.text,
                            borderColor: statusColor.border,
                          }}
                        >
                          {uiStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {uiStatus === "Pending" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewClick(row)}
                              className="px-3 py-1 bg-purple-500 text-white rounded text-xs font-semibold hover:bg-purple-600"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleApprove(row._id)}
                              className="px-3 py-1 text-white rounded text-xs font-semibold hover:opacity-90"
                              style={{ backgroundColor: "#2D6A4F" }}
                            >
                              Verify
                            </button>
                            <button
                              onClick={() => handleReject(row._id)}
                              className="px-3 py-1 bg-red-500 text-white rounded text-xs font-semibold hover:bg-red-600"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleViewClick(row)}
                            className="px-3 py-1 bg-gray-400 text-white rounded text-xs font-semibold hover:bg-gray-500"
                          >
                            Details
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Modal */}
      <ViewPanchayatModal
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        data={viewData}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </>
  );
}
