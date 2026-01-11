import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import ReactivateSubscriptionModal from "./ReactivateSubscriptionModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api/axios";

export default function SubscriptionTable({
  subscriptions,
  plans,
  onSubscriptionUpdated,
}) {
  const [searchValue, setSearchValue] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalMode, setModalMode] = useState(null);

  /* -------------------- FILTER -------------------- */
  const filteredData = subscriptions.filter((row) =>
    row.panchayatName?.toLowerCase().includes(searchValue.toLowerCase())
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

  /* -------------------- ACTION HANDLER -------------------- */
  const handleUpgrade = async (planName) => {
    try {
      const normalizedPlan = planName.toUpperCase();

      // guard
      if (
        modalMode === "change" &&
        normalizedPlan === selectedRow.planName
      ) {
        toast.info("This plan is already active");
        return;
      }

      if (modalMode === "activate") {
        // BACKEND HANDLES 30 DAYS LOGIC
        await api.post("/subscriptions", {
          panchayatId: selectedRow.panchayatId,
          planName: normalizedPlan,
        });

        toast.success("Subscription activated successfully");
      }

      if (modalMode === "change") {
        await api.put(
          `/subscriptions/${selectedRow.subscriptionId}/upgrade`,
          { planName: normalizedPlan }
        );

        toast.success(`Plan changed to ${planName}`);
      }

      if (modalMode === "reactivate") {
        await api.put(
          `/subscriptions/${selectedRow.subscriptionId}/reactivate`
        );

        toast.success("Subscription reactivated successfully");
      }

      await onSubscriptionUpdated();
      setShowModal(false);
    } catch (err) {
      console.error("SUBSCRIPTION ERROR:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  return (
    <div>
      {/* Search & Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search Panchayat"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="relative w-40">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between"
          >
            Filter
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Panchayat
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Current Plan
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Expiry Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((row) => {
              const planColor = getPlanBadgeColor(row.planName);
              const statusColor = getStatusBadgeColor(row.status);

              return (
                <tr key={row.panchayatId} className="border-b">
                  <td className="px-6 py-4">{row.panchayatName}</td>

                  <td className="px-6 py-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold border"
                      style={{
                        backgroundColor: planColor.bg,
                        color: planColor.text,
                        borderColor: planColor.border,
                      }}
                    >
                      {row.planName}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {row.endDate
                      ? new Date(row.endDate).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold border"
                      style={{
                        backgroundColor: statusColor.bg,
                        color: statusColor.text,
                        borderColor: statusColor.border,
                      }}
                    >
                      {row.status === "NOT_ACTIVE" ? "Not Active" : row.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setSelectedRow(row);
                        setModalMode(
                          row.status === "NOT_ACTIVE"
                            ? "activate"
                            : row.status === "Expired"
                            ? "reactivate"
                            : "change"
                        );
                        setShowModal(true);
                      }}
                      className={`px-4 py-2 text-xs font-semibold rounded text-white ${
                        row.status === "Active"
                          ? "bg-purple-500"
                          : row.status === "NOT_ACTIVE"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {row.status === "NOT_ACTIVE"
                        ? "Activate"
                        : row.status === "Active"
                        ? "Change Plan"
                        : "Reactivate"}
                    </button>
                  </td>
                </tr>
              );
            })}

            {filteredData.length === 0 && (
              <tr>
                <td colSpan="5" className="py-6 text-center text-gray-500">
                  No subscriptions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ReactivateSubscriptionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        plans={plans}
        currentPlan={selectedRow?.planName}
        panchayatName={selectedRow?.panchayatName}
        mode={modalMode}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
}
