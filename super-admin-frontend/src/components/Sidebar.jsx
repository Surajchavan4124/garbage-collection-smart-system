import { LayoutDashboard, CreditCard, HelpCircle, Layers, Leaf, ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { id: 1, name: "Panchayat Verification", sub: "Review & approve registrations", icon: LayoutDashboard, path: "/dashboard" },
  { id: 2, name: "Subscription Plans",     sub: "Manage plan tiers & pricing",    icon: Layers,          path: "/subscriptions" },
  { id: 3, name: "Payment Monitoring",     sub: "Track payments & transactions",  icon: CreditCard,      path: "/payments" },
  { id: 4, name: "Support & Queries",      sub: "Handle tickets & issues",        icon: HelpCircle,      path: "/support" },
];

export default function Sidebar() {
  return (
    <div style={{ width: 260, background: "#0f172a", color: "white", display: "flex", flexDirection: "column", height: "100vh", flexShrink: 0, position: "relative", overflow: "hidden" }}>
      {/* Subtle top glow */}
      <div style={{ position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)", width: 300, height: 200, background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Logo */}
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 15px rgba(99,102,241,0.4)", flexShrink: 0 }}>
            <Leaf size={20} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: "-0.3px", color: "white" }}>EcoSyz</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 500, marginTop: 1 }}>Super Admin Portal</div>
          </div>
        </div>
      </div>

      {/* Nav label */}
      <div style={{ padding: "20px 20px 8px", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "1px", textTransform: "uppercase" }}>
        Navigation
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: "0 12px", overflow: "auto" }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 12px",
                borderRadius: 10,
                marginBottom: 4,
                cursor: "pointer",
                textDecoration: "none",
                position: "relative",
                background: isActive ? "rgba(99,102,241,0.18)" : "transparent",
                border: isActive ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent",
                transition: "all 0.15s ease",
              })}
              className={({ isActive }) => isActive ? "" : "sidebar-nav-item"}
            >
              {({ isActive }) => (
                <>
                  {/* Active left bar */}
                  {isActive && (
                    <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: "60%", background: "#6366f1", borderRadius: "0 3px 3px 0" }} />
                  )}
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: isActive ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                    <Icon size={17} color={isActive ? "#818cf8" : "rgba(255,255,255,0.45)"} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? "#e0e7ff" : "rgba(255,255,255,0.7)", lineHeight: 1.2 }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.sub}</div>
                  </div>
                  {isActive && <ChevronRight size={14} color="#6366f1" style={{ flexShrink: 0 }} />}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom bar */}
      <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: "white", flexShrink: 0 }}>S</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>Super Admin</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>ecosyz.in</div>
          </div>
        </div>
      </div>

      <style>{`
        .sidebar-nav-item:hover {
          background: rgba(255,255,255,0.05) !important;
          border-color: rgba(255,255,255,0.08) !important;
        }
      `}</style>
    </div>
  );
}
