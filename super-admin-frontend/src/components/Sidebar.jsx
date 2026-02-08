import { Leaf, Home, CheckCircle, CreditCard, HelpCircle } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const navItems = [
    {
      id: 1,
      name: "Panchayat Verification & Registration",
      icon: Home,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Subscription Plan Management",
      icon: CheckCircle,
      path: "/subscriptions",
    },
    {
      id: 3,
      name: "Payment Monitoring",
      icon: CreditCard,
      path: "/payments",
    },
    {
      id: 4,
      name: "Support & Queries",
      icon: HelpCircle,
      path: "/support",
    },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-teal-600 to-teal-700 text-white shadow-lg flex flex-col h-screen shrink-0">
      <div className="px-6 py-6 border-b border-teal-500">
        <div className="flex items-center gap-3">
          <Leaf size={32} />
          <h1 className="text-xl font-bold">EcoSyz Super Admin</h1>
        </div>
      </div>

      <nav className="flex-1 mt-6">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `w-full px-6 py-4 flex items-center gap-3 transition text-left ${
                  isActive
                    ? "bg-teal-500 border-r-4 border-white"
                    : "hover:bg-teal-600"
                }`
              }
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
