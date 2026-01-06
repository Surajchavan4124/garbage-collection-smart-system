import { useState } from 'react'
import { Home, Settings, BarChart3, FileText, BookOpen, Image, TrendingUp, Users, Scale, ChevronDown, Users2, Clock, Trash2, Home as HomeIcon } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'


export default function Sidebar() {
  const location = useLocation()
  const [expandOperational, setExpandOperational] = useState(false)
  
  const isActive = (path) => location.pathname === path
  const isOperationalActive = location.pathname.startsWith('/employee') || location.pathname.startsWith('/attendance') || location.pathname.startsWith('/dustbin') || location.pathname.startsWith('/household')


  return (
    <div className="w-64 bg-[#f0f2f5] h-screen overflow-y-auto fixed left-0 top-0 border-r border-gray-200">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1f9e9a] rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xl">🌱</span>
          </div>
          <h1 className="text-lg font-bold text-[#333333]">Smart Waste Admin</h1>
        </div>
      </div>


      {/* Navigation */}
      <nav className="px-4 py-6">
        {/* Main */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3">Main</h3>
          <div className="space-y-2">
            <Link
              to="/dashboard"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive('/dashboard')
                  ? 'bg-[#1f9e9a] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home size={20} />
              <span className="font-medium">Central Admin Dashboard</span>
            </Link>


            {/* Operational Management - Collapsible */}
            <div>
              <button
                onClick={() => setExpandOperational(!expandOperational)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isOperationalActive || expandOperational
                    ? 'bg-[#1f9e9a] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Settings size={20} />
                <span className="font-medium flex-1 text-left">Operational Management</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform ${expandOperational ? 'rotate-180' : ''}`}
                />
              </button>


              {/* Dropdown Submenu */}
              {expandOperational && (
                <div className="mt-2 space-y-2 pl-4 border-l-2 border-[#1f9e9a]">
                  <Link
                    to="/employee"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive('/employee')
                        ? 'bg-[#1f9e9a] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Users2 size={18} />
                    <span className="font-medium text-sm">Employee Management</span>
                  </Link>


                  <Link
                    to="/attendance"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive('/attendance')
                        ? 'bg-[#1f9e9a] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Clock size={18} />
                    <span className="font-medium text-sm">Attendance Management</span>
                  </Link>


                  <Link
                    to="/dustbin"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive('/dustbin')
                        ? 'bg-[#1f9e9a] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Trash2 size={18} />
                    <span className="font-medium text-sm">Dustbin Management</span>
                  </Link>


                  <Link
                    to="/household"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive('/household')
                        ? 'bg-[#1f9e9a] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <HomeIcon size={18} />
                    <span className="font-medium text-sm">Household Management</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>


        {/* Reports & Complaints */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3">Reports & Complaints</h3>
          <div className="space-y-2">
            <Link
              to="/report-complaint"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive('/report-complaint')
                  ? 'bg-[#1f9e9a] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FileText size={20} />
              <span className="font-medium">Report & Complaint Management</span>
            </Link>
            <Link
              to="/waste-data"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive('/waste-data')
                  ? 'bg-[#1f9e9a] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart3 size={20} />
              <span className="font-medium">Waste Data Management</span>
            </Link>
          </div>
        </div>


        {/* Public Website CMS */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3">Public Website CMS</h3>
          <div className="space-y-2">
            <Link
              to="/edit-about-us"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive('/edit-about-us')
                  ? 'bg-[#1f9e9a] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BookOpen size={20} />
              <span className="font-medium">Edit About Us</span>
            </Link>
            <Link
              to="/edit-guide"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive('/edit-guide')
                  ? 'bg-[#1f9e9a] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BookOpen size={20} />
              <span className="font-medium">Edit Segregation Guide</span>
            </Link>
            <Link
              to="/gallery"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive('/gallery')
                  ? 'bg-[#1f9e9a] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Image size={20} />
              <span className="font-medium">Manage Photo Gallery</span>
            </Link>
          </div>
        </div>


        {/* Analytics & Settings */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3">Analytics & Settings</h3>
          <div className="space-y-2">
            <Link
              to="/reports"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive('/reports')
                  ? 'bg-[#1f9e9a] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <TrendingUp size={20} />
              <span className="font-medium">Report Generation & Analytics</span>
            </Link>
            <Link
              to="/settings"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive('/settings')
                  ? 'bg-[#1f9e9a] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users size={20} />
              <span className="font-medium">User Management & Settings</span>
            </Link>
            <Link
              to="/legal"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive('/legal')
                  ? 'bg-[#1f9e9a] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Scale size={20} />
              <span className="font-medium">Legal & Transparency</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}
