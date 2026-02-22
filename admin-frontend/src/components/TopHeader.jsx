// src/components/TopHeader.jsx - Enhanced UI
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, User, Settings, LogOut, ChevronDown } from 'lucide-react'
import LogoutConfirmation from './LogoutConfirmation'
import api from '../api/axios'

export default function TopHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState({ 
    households: [], dustbins: [], complaints: [], employees: [], wards: [], routes: [], wasteRecords: [] 
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
        setSearchResults({ households: [], dustbins: [], complaints: [], employees: [], wards: [], routes: [], wasteRecords: [] })
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

  const handleResultClick = (type) => {
    setSearchQuery('')
    setShowResults(false)
    const routes = {
      household: '/household', dustbin: '/dustbin', complaint: '/report-complaint',
      employee: '/employee', ward: '/ward', route: '/route', 'waste-record': '/waste-data'
    }
    if (routes[type]) navigate(routes[type])
  }

  const handleProfileSettings = () => { navigate('/profile-settings'); setIsDropdownOpen(false) }
  const handleLogoutClick = () => { setIsDropdownOpen(false); setShowLogoutConfirm(true) }
  const handleLogoutConfirm = async () => {
    try { await api.post("/auth/logout"); } catch (err) { console.error("Logout API failed", err); }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.clear()
    navigate('/', { replace: true })
  }

  const ResultSection = ({ title, items, type, renderItem }) => items.length > 0 && (
    <div className="px-2 pb-1">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1.5">{title}</p>
      {items.map((item) => (
        <button
          key={item._id}
          className="w-full text-left px-3 py-2 hover:bg-teal-50 rounded-lg transition-colors group"
          onClick={() => handleResultClick(type, item)}
        >
          {renderItem(item)}
        </button>
      ))}
    </div>
  )

  const hasResults = Object.values(searchResults).some(arr => arr.length > 0)

  return (
    <>
      <div className="fixed top-0 right-0 left-64 h-16 flex items-center justify-between px-6 z-40"
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 1px 20px rgba(0,0,0,0.04)'
        }}
      >
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl relative" ref={searchRef}>
          <div className="flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all duration-200"
            style={{ background: '#f4f6fa', border: '1.5px solid transparent' }}
            onFocusCapture={(e) => e.currentTarget.style.borderColor = 'rgba(31,158,154,0.4)'}
            onBlurCapture={(e) => e.currentTarget.style.borderColor = 'transparent'}
          >
            <Search size={17} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search wards, bins, employees, complaints..."
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
            />
            {isSearching && (
              <div className="w-4 h-4 border-2 border-[#1f9e9a] border-t-transparent rounded-full animate-spin flex-shrink-0" />
            )}
          </div>

          {/* Search Results Dropdown */}
          {showResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl max-h-[80vh] overflow-y-auto z-50 border border-gray-100">
              {hasResults ? (
                <div className="py-2 divide-y divide-gray-50">
                  <ResultSection title="Employees" items={searchResults.employees} type="employee"
                    renderItem={(e) => (
                      <>
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-teal-700">{e.name}</p>
                        <p className="text-[11px] text-gray-400">ID: {e.employeeCode} · {e.phone}</p>
                      </>
                    )}
                  />
                  <ResultSection title="Households" items={searchResults.households} type="household"
                    renderItem={(h) => (
                      <>
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-teal-700">{h.ownerName}</p>
                        <p className="text-[11px] text-gray-400">{h.houseNumber} · {h.address}</p>
                      </>
                    )}
                  />
                  <ResultSection title="Dustbins" items={searchResults.dustbins} type="dustbin"
                    renderItem={(d) => (
                      <>
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-teal-700">{d.binCode}</p>
                        <p className="text-[11px] text-gray-400">{d.locationText} · {d.ward}</p>
                      </>
                    )}
                  />
                  <ResultSection title="Wards" items={searchResults.wards} type="ward"
                    renderItem={(w) => <p className="text-sm font-semibold text-gray-800 group-hover:text-teal-700">{w.name}</p>}
                  />
                  <ResultSection title="Complaints" items={searchResults.complaints} type="complaint"
                    renderItem={(c) => (
                      <>
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-teal-700">{c.complaintId}</p>
                        <p className="text-[11px] text-gray-400">{c.type} · {c.reporterName}</p>
                      </>
                    )}
                  />
                  <ResultSection title="Waste Records" items={searchResults.wasteRecords} type="waste-record"
                    renderItem={(wr) => (
                      <>
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-teal-700">{wr.entryId}</p>
                        <p className="text-[11px] text-gray-400">{wr.ward} · {new Date(wr.date).toLocaleDateString()}</p>
                      </>
                    )}
                  />
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-sm text-gray-400">No results for "<span className="font-semibold text-gray-600">{searchQuery}</span>"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 ml-6">
          {/* Notifications Bell */}
          <button className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors">
            <Bell size={18} />
            <span className="text-sm font-medium">3 Alerts</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          {/* Avatar / Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm"
                style={{ background: 'linear-gradient(135deg, #1f9e9a, #22c55e)' }}
              >
                A
              </div>
              <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-xl py-1.5 z-50">
                <div className="px-4 py-2.5 border-b border-gray-50">
                  <p className="text-sm font-bold text-gray-800">Panchayat Admin</p>
                  <p className="text-xs text-gray-400">ecosyz.in</p>
                </div>
                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors mt-1"
                  onClick={handleProfileSettings}
                >
                  <Settings size={15} className="text-gray-400" />
                  <span>Profile Settings</span>
                </button>
                <div className="h-px bg-gray-100 mx-3 my-1" />
                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  onClick={handleLogoutClick}
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <LogoutConfirmation
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onLogout={handleLogoutConfirm}
      />
    </>
  )
}
