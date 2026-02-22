import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { AlertCircle, CheckCircle2, Clock, Users, Leaf } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import TopHeader from '../components/TopHeader'
import KPICard from '../components/KPICard'
import AttendanceCard from '../components/AttendanceCard'
import AttendanceChart from '../components/PieChart'
import WasteStats from '../components/WasteStats'
import api from '../api/axios'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Dashboard() {
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const res = await api.get('/complaints/stats')
      return res.data
    },
    onError: () => toast.error("Failed to fetch dashboard stats"),
    refetchInterval: 10000
  })

  const { data: attendanceStats, isLoading: attendanceLoading } = useQuery({
    queryKey: ['attendanceToday'],
    queryFn: async () => {
      const res = await api.get('/attendance/today')
      return res.data
    },
    select: (data) => {
      const total = data.length
      const present = data.filter(d => d.present).length
      const recent = data.slice(0, 5).map(d => ({
        name: d.labour.name,
        status: d.present ? 'Present' : 'Absent'
      }))
      return { total, present, recent }
    },
    refetchInterval: 10000
  })

  if (statsLoading || attendanceLoading) return <LoadingSpinner />

  const safeStats = stats || { newComplaints: 0, pendingComplaints: 0, resolvedComplaints: 0 }
  const safeAttendance = attendanceStats || { total: 0, present: 0, recent: [] }

  return (
    <div className="flex min-h-screen bg-mesh">
      <Sidebar />

      <div className="ml-64 flex-1">
        <TopHeader />

        <div className="pt-20 px-8 pb-10 animate-fade-in-up">

          {/* Page header */}
          <div className="mb-8 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1f9e9a] to-[#22c55e] flex items-center justify-center shadow-sm">
              <Leaf size={16} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Main › Central Admin Dashboard</p>
              <h1 className="text-lg font-bold text-gray-800 leading-tight">Overview</h1>
            </div>
          </div>

          {/* Row 1: Complaints KPI */}
          <section className="mb-8">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Complaints Overview</h2>
            <div className="grid grid-cols-3 gap-5">
              <KPICard
                title="New Complaints"
                value={safeStats.newComplaints}
                subtitle="In last 24 hours"
                icon={AlertCircle}
                color="blue"
              />
              <KPICard
                title="Pending Complaints"
                value={safeStats.pendingComplaints}
                subtitle="Status: Received"
                icon={Clock}
                color="orange"
              />
              <KPICard
                title="Resolved This Month"
                value={safeStats.resolvedComplaints}
                subtitle="Resolved complaints"
                icon={CheckCircle2}
                color="green"
              />
            </div>
          </section>

          {/* Row 2: Attendance */}
          <section className="mb-8">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Staff Attendance — Today</h2>
            <div className="grid grid-cols-5 gap-5">
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
          </section>

          {/* Row 3: Waste */}
          <section>
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Waste Collection Stats</h2>
            <WasteStats />
          </section>

        </div>
      </div>
    </div>
  )
}
