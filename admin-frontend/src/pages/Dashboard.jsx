import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Sidebar from '../components/Sidebar'
import TopHeader from '../components/TopHeader'
import KPICard from '../components/KPICard'
import AttendanceCard from '../components/AttendanceCard'
import AttendanceChart from '../components/PieChart'
import WasteStats from '../components/WasteStats'
import api from '../api/axios'

export default function Dashboard() {
  const [stats, setStats] = useState({
    newComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0
  })

  const [attendanceStats, setAttendanceStats] = useState({
    total: 0,
    present: 0,
    recent: []
  })

  useEffect(() => {
    fetchStats()
    fetchAttendance()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await api.get('/complaints/stats')
      setStats(res.data)
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error)
      toast.error("Failed to fetch dashboard stats")
    }
  }

  const fetchAttendance = async () => {
    try {
      const res = await api.get('/attendance/today')
      const data = res.data
      const total = data.length
      const present = data.filter(d => d.present).length
      
      // Map for recent list (taking first 5)
      const recent = data.slice(0, 5).map(d => ({
        name: d.labour.name,
        status: d.present ? 'Present' : 'Absent'
      }))

      setAttendanceStats({
        total,
        present,
        recent
      })
    } catch (error) {
      console.error("Failed to fetch attendance", error)
    }
  }

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
              <KPICard title="New Complaints" value={stats.newComplaints} subtitle="In last 24 hours" />
              <KPICard title="Pending Complaints" value={stats.pendingComplaints} subtitle="Status: Received" />
              <KPICard title="Resolved Complaints" value={stats.resolvedComplaints} subtitle="This Month" />
            </div>
          </div>

          {/* Row 2: Attendance */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-4">Staff Attendance Summary</h2>
            <div className="grid grid-cols-5 gap-6">
              <div className="col-span-2">
                <AttendanceCard 
                  total={attendanceStats.total}
                  present={attendanceStats.present}
                  recent={attendanceStats.recent}
                />
              </div>
              <div className="col-span-3">
                <AttendanceChart 
                  present={attendanceStats.present}
                  absent={attendanceStats.total - attendanceStats.present}
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
