// src/components/TopHeader.jsx - Updated with Logout Confirmation
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, User, Settings, LogOut } from 'lucide-react'
import LogoutConfirmation from './LogoutConfirmation'
import api from '../api/axios'

export default function TopHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleProfileSettings = () => {
    navigate('/profile-settings')
    setIsDropdownOpen(false)
  }

  const handleLogoutClick = () => {
    setIsDropdownOpen(false)
    setShowLogoutConfirm(true)
  }

  const handleLogoutConfirm = async () => {
    // Call Logout API
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout API failed", err);
    }

    // Clear all auth data
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.clear()
    
    // Redirect to login
    navigate('/login', { replace: true })
  }

  const handleStayLoggedIn = () => {
    setShowLogoutConfirm(false)
  }

  return (
    <>
      {/* Top Header */}
      <div className="fixed top-0 right-0 left-64 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-40">
        {/* Search Bar */}
        <div className="flex-1 flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2.5 max-w-2xl">
          <Search size={20} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search complaints, households, bins...."
            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6 ml-8">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
            <Bell size={20} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">3 Alerts</span>
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-10 h-10 rounded-full bg-[#1f9e9a] flex items-center justify-center hover:bg-[#198a87] transition shadow-sm"
            >
              <User size={20} className="text-white" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                <button
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  onClick={handleProfileSettings}
                >
                  <Settings size={16} className="text-gray-500" />
                  <span>Profile Settings</span>
                </button>
                <div className="h-px bg-gray-100 my-1" />
                <button
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                  onClick={handleLogoutClick}  // Updated to show confirmation
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmation
        isOpen={showLogoutConfirm}
        onClose={handleStayLoggedIn}
        onLogout={handleLogoutConfirm}
      />
    </>
  )
}
