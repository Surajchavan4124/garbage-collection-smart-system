import { Search, Bell, User, LogOut, Settings, Shield } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ProfileSettingsModal from "../components/ProfileSettingsModal";
import api from "../api/axios";
import LogoutConfirmation from "./LogoutConfirmation";

const PAGE_LABELS = {
  '/dashboard':    { title: 'Panchayat Verification', sub: 'Review and manage registration requests' },
  '/subscriptions':{ title: 'Subscription Plans',     sub: 'Manage plan tiers and active subscriptions' },
  '/payments':     { title: 'Payment Monitoring',     sub: 'Track transactions and payment status' },
  '/support':      { title: 'Support & Queries',      sub: 'Handle tickets and resolve panchayat issues' },
};

export default function TopHeader() {
  const [searchValue, setSearchValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const page = PAGE_LABELS[location.pathname] || { title: 'EcoSyz Admin', sub: '' };

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsDropdownOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoutConfirm = async () => {
    try { await api.post("/auth/logout"); } catch {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div style={{ background: "white", borderBottom: "1px solid #e2e8f0", padding: "0 28px", display: "flex", alignItems: "center", height: 68, flexShrink: 0, gap: 20 }}>

      {/* Page title */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }}>{page.title}</div>
        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>{page.sub}</div>
      </div>

      {/* Search */}
      <div style={{ position: "relative", width: 280 }}>
        <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
        <input
          type="text"
          placeholder="Search panchayats, tickets…"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{ width: "100%", paddingLeft: 36, paddingRight: 14, paddingTop: 8, paddingBottom: 8, border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, color: "#334155", outline: "none", background: "#f8fafc", fontFamily: "inherit" }}
          onFocus={e => e.target.style.borderColor = "#6366f1"}
          onBlur={e => e.target.style.borderColor = "#e2e8f0"}
        />
      </div>

      {/* Bell */}
      <div style={{ position: "relative" }}>
        <button style={{ width: 38, height: 38, borderRadius: 10, background: "#f8fafc", border: "1.5px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Bell size={17} color="#64748b" />
        </button>
        <div style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: "#ef4444", border: "2px solid white" }} />
      </div>

      {/* Avatar dropdown */}
      <div style={{ position: "relative" }} ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 10px 6px 6px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: isDropdownOpen ? "#f1f5f9" : "white", cursor: "pointer" }}
        >
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "white" }}>S</div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Super Admin</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>ecosyz.in</div>
          </div>
        </button>

        {isDropdownOpen && (
          <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: 220, background: "white", border: "1px solid #e2e8f0", borderRadius: 14, boxShadow: "0 10px 40px rgba(0,0,0,0.12)", overflow: "hidden", zIndex: 100 }}>
            {/* User info */}
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: "white" }}>S</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Super Admin</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                    <Shield size={10} color="#6366f1" />
                    <span style={{ fontSize: 11, color: "#6366f1", fontWeight: 600 }}>Full Access</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: "6px" }}>
              <button
                onClick={() => { setIsDropdownOpen(false); setOpenProfile(true); }}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, border: "none", background: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#374151", fontFamily: "inherit" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}
              >
                <Settings size={16} color="#64748b" />
                Profile Settings
              </button>
              <button
                onClick={() => { setIsDropdownOpen(false); setShowLogoutConfirm(true); }}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, border: "none", background: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#ef4444", fontFamily: "inherit" }}
                onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}
              >
                <LogOut size={16} color="#ef4444" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      <ProfileSettingsModal open={openProfile} onClose={() => setOpenProfile(false)} />
      <LogoutConfirmation isOpen={showLogoutConfirm} onClose={() => setShowLogoutConfirm(false)} onLogout={handleLogoutConfirm} />
    </div>
  );
}
