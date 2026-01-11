import Sidebar from "../components/Sidebar";
import TopHeader from "../components/TopHeader";
import PlanCard from "../components/PlanCard";
import SubscriptionTable from "../components/SubscriptionTable";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function SubscriptionPlanManagement({ onPageChange }) {
  const plans = [
    {
      id: 1,
      name: "Basic",
      price: "₹1,499",
      period: "/year",
      popular: false,
      features: [
        "Max 100 HH",
        "Max 10 Labourers",
        "Basic analytics dashboard",
        "Household registration",
        "Waste tracking",
        "Email support",
      ],
    },
    {
      id: 2,
      name: "Standard",
      price: "₹2,699",
      period: "/year",
      popular: true,
      badge: "Most Popular",
      features: [
        "Max 300 HH",
        "Max 30 Labourers",
        "Advanced analytics & insights",
        "Labour attendance tracking",
        "Complaint & support ticket system",
        "Monthly performance reports",
      ],
    },
    {
      id: 3,
      name: "Premium",
      price: "₹5,999",
      period: "/year",
      popular: false,
      features: [
        "Max 500 HH",
        "Max 50 Labourers",
        "AI-based waste trend prediction",
        "Route optimization for garbage",
        "Priority support team",
        "Dedicated account manager",
      ],
    },
  ];

  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/subscriptions") // backend listAllSubscriptions
      .then((res) => setSubscriptions(res.data))
      .catch((err) => {
        console.error("Failed to fetch subscriptions", err);
      })
      .finally(() => setLoading(false));
  }, []);
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

  useEffect(() => {
    fetchSubscriptions();
  }, []);

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

            {loading ? (
              <p>Loading...</p>
            ) : (
              <SubscriptionTable
                subscriptions={subscriptions}
                plans={plans}
                onSubscriptionUpdated={fetchSubscriptions}

              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
