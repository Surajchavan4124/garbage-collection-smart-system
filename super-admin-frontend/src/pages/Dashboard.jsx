import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";
import VerificationTable from "../components/VerificationTable";
import AddPanchayatModal from "../components/AddPanchayatModal";
import api from "../api/axios";
import { Building2, CheckCircle2, Clock3, Plus } from "lucide-react";

function StatCard({ icon: Icon, label, value, loading, color, bg }) {
  return (
    <div style={{ background: "white", borderRadius: 16, padding: "22px 24px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)", border: "1px solid #f1f5f9" }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={24} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 30, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>{loading ? "—" : value}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({ totalPanchayats: 0, activeSubscriptions: 0, pendingRequests: 0 });
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
    <div style={{ display: "flex", height: "100vh", background: "#f8fafc", fontFamily: "Inter, sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopHeader />
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 28px 40px" }}>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
            <StatCard icon={Building2}     label="Total Panchayats"    value={stats.totalPanchayats}    loading={loading} color="#6366f1" bg="rgba(99,102,241,0.1)"  />
            <StatCard icon={CheckCircle2}  label="Active Subscriptions" value={stats.activeSubscriptions} loading={loading} color="#10b981" bg="rgba(16,185,129,0.1)"  />
            <StatCard icon={Clock3}        label="Pending Requests"    value={stats.pendingRequests}    loading={loading} color="#f59e0b" bg="rgba(245,158,11,0.1)"  />
          </div>

          {/* Table card */}
          <div style={{ background: "white", borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)", border: "1px solid #f1f5f9", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Verification Requests</div>
                <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>Review and process panchayat registrations</div>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", border: "none", borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer", boxShadow: "0 4px 12px rgba(99,102,241,0.3)", fontFamily: "inherit" }}
              >
                <Plus size={16} />
                Add Panchayat
              </button>
            </div>
            <div style={{ padding: "0 24px 24px" }}>
              <VerificationTable refreshKey={refreshKey} onChange={() => setRefreshKey((p) => p + 1)} />
            </div>
          </div>
        </div>
      </div>

      <AddPanchayatModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={() => setRefreshKey((p) => p + 1)} />
    </div>
  );
}
