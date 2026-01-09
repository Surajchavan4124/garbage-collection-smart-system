import { Search, Bell, User, LogOut, Settings } from 'lucide-react';
import { useState } from 'react';

export default function TopHeader({ onLogout }) {
  const [searchValue, setSearchValue] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    setDropdownOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Top Bar */}
      <div className="px-8 py-4 flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl relative">
          <Search
            size={20}
            className="absolute left-3 top-3 text-gray-400"
          />
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
          {/* Alerts Badge */}
          <div className="flex items-center gap-2 bg-gray-200 rounded-full px-4 py-2">
            <Bell size={18} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">3 Alerts</span>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center hover:bg-teal-600 transition"
            >
              <User size={20} className="text-white" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {/* Profile Settings */}
                <button className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-200 transition">
                  <Settings size={18} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Profile Settings
                  </span>
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
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

      
    </div>
  );
}
