import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";
import PlanCard from "../components/PlanCard";
import SubscriptionTable from "../components/SubscriptionTable";
import { useEffect, useState } from "react";
import api from "../api/axios";

const plans = [
  { id: 1, name: "Basic",    price: "₹1,499", period: "/year", popular: false, features: ["Max 100 HH","Max 10 Labourers","Basic analytics dashboard","Household registration","Waste tracking","Email support"] },
  { id: 2, name: "Standard", price: "₹2,699", period: "/year", popular: true,  badge: "Most Popular", features: ["Max 300 HH","Max 30 Labourers","Advanced analytics & insights","Labour attendance tracking","Complaint & ticket system","Monthly performance reports"] },
  { id: 3, name: "Premium",  price: "₹5,999", period: "/year", popular: false, features: ["Max 500 HH","Max 50 Labourers","AI-based waste trend prediction","Route optimization","Priority support team","Dedicated account manager"] },
];

export default function SubscriptionPlanManagement() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = async () => {
    try {
      const res = await api.get("/subscriptions");
      setSubscriptions(res.data);
    } catch (err) {
      console.error("Failed to fetch subscriptions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubscriptions(); }, []);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f8fafc", fontFamily: "Inter, sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopHeader />
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 28px 40px" }}>

          {/* Plans */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Available Plans</div>
              <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>Choose the right tier for each panchayat</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {plans.map(p => <PlanCard key={p.id} plan={p} />)}
            </div>
          </div>

          {/* Subscriptions table */}
          <div style={{ background: "white", borderRadius: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)", border: "1px solid #f1f5f9", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>Panchayat Subscriptions</div>
              <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>Active & past subscriptions across all panchayats</div>
            </div>
            <div style={{ padding: "0 24px 24px" }}>
              {loading ? (
                <div style={{ padding: "40px 0", textAlign: "center", color: "#94a3b8" }}>Loading subscriptions…</div>
              ) : (
                <SubscriptionTable subscriptions={subscriptions} plans={plans} onSubscriptionUpdated={fetchSubscriptions} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
