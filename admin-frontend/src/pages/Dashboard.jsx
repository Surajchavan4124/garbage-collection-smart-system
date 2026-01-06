import Sidebar from '../components/Sidebar'
import TopHeader from '../components/TopHeader'
import KPICard from '../components/KPICard'
import AttendanceCard from '../components/AttendanceCard'
import AttendanceChart from '../components/PieChart'
import WasteStats from '../components/WasteStats'

export default function Dashboard() {
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
              <KPICard title="New Complaints" value="01" subtitle="In last 24 hours" />
              <KPICard title="Pending Complaints" value="01" subtitle="Waiting Assignment" />
              <KPICard title="Resolved Complaints" value="120" subtitle="This Month" />
            </div>
          </div>

          {/* Row 2: Attendance */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-4">Staff Attendance Summary</h2>
            <div className="grid grid-cols-5 gap-6">
              <div className="col-span-2">
                <AttendanceCard />
              </div>
              <div className="col-span-3">
                <AttendanceChart />
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
