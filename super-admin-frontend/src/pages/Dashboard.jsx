import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";
import VerificationTable from "../components/VerificationTable";
import AddPanchayatModal from "../components/AddPanchayatModal";
import api from "../api/axios";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
    
  const [stats, setStats] = useState({
    totalPanchayats: 0,
    activeSubscriptions: 0,
    pendingRequests: 0,
  });
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/company/dashboard");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [refreshKey]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader />

        <div className="px-6 pt-4 pb-2 bg-gray-100 text-sm text-gray-600 border-t border-gray-200">
          Main &gt; Panchayat Verification &amp; Registration
        </div>

        <div className="flex-1 overflow-auto p-6">
          {/* Overview */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 pb-2">Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <p className="text-sm text-gray-600 mb-2">
                  Total Panchayats Registered
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? "—" : stats.totalPanchayats}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <p className="text-sm text-gray-600 mb-2">
                  Active Subscription
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? "—" : stats.activeSubscriptions}
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <p className="text-sm text-gray-600 mb-2">Pending Requests</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? "—" : stats.pendingRequests}
                </p>
              </div>
            </div>
          </div>

          {/* Verification Requests */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Verification Requests
              </h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-md transition"
              >
                + Add Panchayat
              </button>
            </div>

            {/* refreshKey triggers re-fetch inside VerificationTable */}
            <VerificationTable refreshKey={refreshKey} onChange={() => setRefreshKey((prev) => prev + 1)} />
          </div>
        </div>
      </div>

      <AddPanchayatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setRefreshKey((prev) => prev + 1)}
      />
    </div>
  );
}
