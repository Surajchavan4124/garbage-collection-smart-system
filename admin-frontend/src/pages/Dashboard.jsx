import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import Sidebar from '../components/Sidebar'
import TopHeader from '../components/TopHeader'
import KPICard from '../components/KPICard'
import AttendanceCard from '../components/AttendanceCard'
import AttendanceChart from '../components/PieChart'
import WasteStats from '../components/WasteStats'
import api from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Dashboard() {
  
  // 1. Complaint Stats Query
  const { data: stats, isLoading: statsLoading, isError: statsError } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const res = await api.get('/complaints/stats')
      return res.data
    },
    onError: (err) => {
        console.error("Failed to fetch dashboard stats", err)
        toast.error("Failed to fetch dashboard stats")
    },
    refetchInterval: 10000
  })

  // 2. Attendance Query
  const { data: attendanceStats, isLoading: attendanceLoading } = useQuery({
    queryKey: ['attendanceToday'],
    queryFn: async () => {
      const res = await api.get('/attendance/today')
      return res.data
    },
    select: (data) => {
      const total = data.length
      const present = data.filter(d => d.present).length
      // Map for recent list (taking first 5)
      const recent = data.slice(0, 5).map(d => ({
        name: d.labour.name,
        status: d.present ? 'Present' : 'Absent'
      }))
      return { total, present, recent }
    },
    refetchInterval: 10000
  })

  if (statsLoading || attendanceLoading) {
    return <LoadingSpinner />
  }

  // Fallback values if data is missing or error occurred
  const safeStats = stats || { newComplaints: 0, pendingComplaints: 0, resolvedComplaints: 0 }
  const safeAttendance = attendanceStats || { total: 0, present: 0, recent: [] }

  return (
    <div className="flex bg-[#e5e9f0]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 w-full">
        {/* Top Header */}
        <TopHeader />

        {/* Content Area */}
        <div className="pt-20 px-8 pb-8">
          {/* Breadcrumb */}
          <p className="text-sm text-gray-600 mb-6 font-medium">Main {'>'} Central Admin Dashboard</p>

          {/* Row 1: Complaints KPI */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-4">Complaints Overview</h2>
            <div className="grid grid-cols-3 gap-6">
              <KPICard title="New Complaints" value={safeStats.newComplaints} subtitle="In last 24 hours" />
              <KPICard title="Pending Complaints" value={safeStats.pendingComplaints} subtitle="Status: Received" />
              <KPICard title="Resolved Complaints" value={safeStats.resolvedComplaints} subtitle="This Month" />
            </div>
          </div>

          {/* Row 2: Attendance */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-4">Staff Attendance Summary</h2>
            <div className="grid grid-cols-5 gap-6">
              <div className="col-span-2">
                <AttendanceCard 
                  total={safeAttendance.total}
                  present={safeAttendance.present}
                  recent={safeAttendance.recent}
                />
              </div>
              <div className="col-span-3">
                <AttendanceChart 
                  present={safeAttendance.present}
                  absent={safeAttendance.total - safeAttendance.present}
                />
              </div>
            </div>
          </div>

          {/* Row 3: Waste Collection */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-4">Quick Waste Collection Stats</h2>
            <WasteStats />
          </div>
        </div>
      </div>
    </div>
  )
}
