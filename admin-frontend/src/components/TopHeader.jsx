// src/components/TopHeader.jsx - Updated with Logout Confirmation
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, User, Settings, LogOut } from 'lucide-react'
import LogoutConfirmation from './LogoutConfirmation'
import api from '../api/axios'

export default function TopHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState({ 
    households: [], 
    dustbins: [], 
    complaints: [],
    employees: [],
    wards: [],
    routes: [],
    wasteRecords: [] 
  })
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const dropdownRef = useRef(null)
  const searchRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length >= 2) {
        performSearch()
      } else {
        setSearchResults({ 
          households: [], 
          dustbins: [], 
          complaints: [],
          employees: [],
          wards: [],
          routes: [],
          wasteRecords: [] 
        })
        setShowResults(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  const performSearch = async () => {
    setIsSearching(true)
    setShowResults(true)
    try {
      const res = await api.get(`/search?q=${searchQuery}`)
      setSearchResults(res.data)
    } catch (err) {
      console.error("Search failed", err)
    } finally {
      setIsSearching(false)
    }
  }

  const handleResultClick = (type, item) => {
    setSearchQuery('')
    setShowResults(false)
    switch (type) {
      case 'household':
        navigate('/household')
        break
      case 'dustbin':
        navigate('/dustbin')
        break
      case 'complaint':
        navigate('/report-complaint')
        break
      case 'employee':
        navigate('/employee')
        break
      case 'ward':
        navigate('/ward')
        break
      case 'route':
        navigate('/route')
        break
      case 'waste-record':
        navigate('/waste-data')
        break
      default:
        break
    }
  }

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
    navigate('/', { replace: true })
  }

  const handleStayLoggedIn = () => {
    setShowLogoutConfirm(false)
  }

  return (
    <>
      {/* Top Header */}
      <div className="fixed top-0 right-0 left-64 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-40">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl relative" ref={searchRef}>
          <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2.5">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search everything (Wards, Bins, Employees, etc.)...."
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
            />
            {isSearching && (
              <div className="animate-spin h-4 w-4 border-2 border-[#1f9e9a] border-t-transparent rounded-full" />
            )}
          </div>

          {/* Search Results Dropdown */}
          {showResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-[85vh] overflow-y-auto z-50">
              {/* Households */}
              {searchResults.households.length > 0 && (
                <div className="p-2">
                  <h3 className="text-xs font-bold text-gray-400 border-b pb-1 mb-1 uppercase px-3">Households</h3>
                  {searchResults.households.map(h => (
                    <button
                      key={h._id}
                      className="w-full text-left px-3 py-2 hover:bg-teal-50 rounded-md transition flex flex-col group"
                      onClick={() => handleResultClick('household', h)}
                    >
                      <span className="text-sm font-semibold text-gray-800 group-hover:text-teal-700">{h.ownerName}</span>
                      <span className="text-[11px] text-gray-500">Number: {h.houseNumber} | {h.address}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Employees */}
              {searchResults.employees.length > 0 && (
                <div className="p-2 border-t border-gray-50">
                  <h3 className="text-xs font-bold text-gray-400 border-b pb-1 mb-1 uppercase px-3">Employees</h3>
                  {searchResults.employees.map(e => (
                    <button
                      key={e._id}
                      className="w-full text-left px-3 py-2 hover:bg-teal-50 rounded-md transition flex flex-col group"
                      onClick={() => handleResultClick('employee', e)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-800 group-hover:text-teal-700">{e.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded-full text-gray-600 uppercase font-bold">{e.role}</span>
                      </div>
                      <span className="text-[11px] text-gray-500">ID: {e.employeeCode} | {e.phone}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Dustbins */}
              {searchResults.dustbins.length > 0 && (
                <div className="p-2 border-t border-gray-50">
                  <h3 className="text-xs font-bold text-gray-400 border-b pb-1 mb-1 uppercase px-3">Dustbins</h3>
                  {searchResults.dustbins.map(d => (
                    <button
                      key={d._id}
                      className="w-full text-left px-3 py-2 hover:bg-teal-50 rounded-md transition flex flex-col group"
                      onClick={() => handleResultClick('dustbin', d)}
                    >
                      <span className="text-sm font-semibold text-gray-800 group-hover:text-teal-700">{d.binCode}</span>
                      <span className="text-[11px] text-gray-500">{d.locationText} | {d.ward}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Wards & Routes */}
              {(searchResults.wards.length > 0 || searchResults.routes.length > 0) && (
                <div className="p-2 border-t border-gray-50 grid grid-cols-2 gap-2">
                  {searchResults.wards.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 border-b pb-1 mb-1 uppercase px-3">Wards</h3>
                      {searchResults.wards.map(w => (
                        <button
                          key={w._id}
                          className="w-full text-left px-3 py-2 hover:bg-teal-50 rounded-md transition group"
                          onClick={() => handleResultClick('ward', w)}
                        >
                          <span className="text-sm font-semibold text-gray-800 group-hover:text-teal-700">{w.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {searchResults.routes.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 border-b pb-1 mb-1 uppercase px-3">Routes</h3>
                      {searchResults.routes.map(r => (
                        <button
                          key={r._id}
                          className="w-full text-left px-3 py-2 hover:bg-teal-50 rounded-md transition flex flex-col group"
                          onClick={() => handleResultClick('route', r)}
                        >
                          <span className="text-sm font-semibold text-gray-800 group-hover:text-teal-700">{r.routeCode}</span>
                          <span className="text-[10px] text-gray-500 truncate">{r.routeName}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Waste Records */}
              {searchResults.wasteRecords.length > 0 && (
                <div className="p-2 border-t border-gray-50">
                  <h3 className="text-xs font-bold text-gray-400 border-b pb-1 mb-1 uppercase px-3">Waste Records</h3>
                  {searchResults.wasteRecords.map(wr => (
                    <button
                      key={wr._id}
                      className="w-full text-left px-3 py-2 hover:bg-teal-50 rounded-md transition flex flex-col group"
                      onClick={() => handleResultClick('waste-record', wr)}
                    >
                      <span className="text-sm font-semibold text-gray-800 group-hover:text-teal-700">{wr.entryId}</span>
                      <span className="text-[11px] text-gray-500">{wr.ward} | {new Date(wr.date).toLocaleDateString()}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Complaints */}
              {searchResults.complaints.length > 0 && (
                <div className="p-2 border-t border-gray-50">
                  <h3 className="text-xs font-bold text-gray-400 border-b pb-1 mb-1 uppercase px-3">Complaints</h3>
                  {searchResults.complaints.map(c => (
                    <button
                      key={c._id}
                      className="w-full text-left px-3 py-2 hover:bg-teal-50 rounded-md transition flex flex-col group"
                      onClick={() => handleResultClick('complaint', c)}
                    >
                      <span className="text-sm font-semibold text-gray-800 group-hover:text-teal-700">{c.complaintId}</span>
                      <span className="text-[11px] text-gray-500">{c.type} | {c.reporterName}</span>
                    </button>
                  ))}
                </div>
              )}

              {searchResults.households.length === 0 && 
               searchResults.dustbins.length === 0 && 
               searchResults.complaints.length === 0 && 
               searchResults.employees.length === 0 && 
               searchResults.wards.length === 0 && 
               searchResults.routes.length === 0 &&
               searchResults.wasteRecords.length === 0 && (
                <div className="p-6 text-center text-gray-500 text-sm">
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
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
