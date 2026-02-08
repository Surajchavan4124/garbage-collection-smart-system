import { Search, Bell, User, LogOut, Settings } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileSettingsModal from "../components/ProfileSettingsModal";
import api from "../api/axios";
import LogoutConfirmation from "./LogoutConfirmation";

export default function TopHeader() {
  const [searchValue, setSearchValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoutConfirm = async () => {
    // Call Logout API
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout API failed", err);
    }

    // Clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    
    // Redirect to login
    window.location.href = '/login';
  }

  const handleStayLoggedIn = () => {
    setShowLogoutConfirm(false);
  }

  // Trigger modal
  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    setShowLogoutConfirm(true);
  }

  const handleProfileOpen = () => {
    setIsDropdownOpen(false);
    setOpenProfile(true);
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-8 py-4 flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl relative">
          <Search size={20} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search complaints, households, bins...."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 ml-6">
          <div className="flex items-center gap-2 bg-gray-200 rounded-full px-4 py-2">
            <Bell size={18} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">3 Alerts</span>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center hover:bg-teal-600 transition"
            >
              <User size={20} className="text-white" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <button
                  onClick={handleProfileOpen}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-200 transition"
                >
                  <Settings size={18} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Profile Settings
                  </span>
                </button>

                <button
                  onClick={handleLogoutClick}
                  className="w-full text-left px-4 py-3 hover:bg-red-50 flex items-center gap-3 transition"
                >
                  <LogOut size={18} className="text-red-600" />
                  <span className="text-sm font-medium text-red-600">
                    Logout
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}
      <ProfileSettingsModal
        open={openProfile}
        onClose={() => setOpenProfile(false)}
      />
      
      <LogoutConfirmation
        isOpen={showLogoutConfirm}
        onClose={handleStayLoggedIn}
        onLogout={handleLogoutConfirm}
      />
    </div>
  );
}
