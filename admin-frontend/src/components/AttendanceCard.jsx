import { useNavigate } from 'react-router-dom'

export default function AttendanceCard() {
  const navigate = useNavigate()

  const handleNavigate = () => {
    navigate('/attendance')
  }

  const attendanceData = [
    { name: 'A. Sharma', status: 'Absent', color: 'bg-red-100 text-red-700' },
    { name: 'S. Kumar', status: 'Present', color: 'bg-yellow-100 text-yellow-700' },
    { name: 'R. Singh', status: 'Present', color: 'bg-yellow-100 text-yellow-700' },
  ]

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-6">Attendance Today</h3>
      
      {/* Percentage */}
      <p className="text-4xl font-bold text-[#1f9e9a] mb-4">92%</p>
      <p className="text-xs text-gray-500 mb-4">151 of 191 Present</p>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
        <div className="h-full w-[92%] bg-[#1f9e9a] rounded-full"></div>
      </div>

      {/* Attendance Table */}
      <div className="space-y-3 mb-6">
        {attendanceData.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{item.name}</span>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${item.color}`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>

      {/* Link - Navigate to Attendance Management */}
      <button
        onClick={handleNavigate}
        className="text-[#1f9e9a] hover:text-[#198a87] text-sm font-semibold flex items-center gap-2 transition"
      >
        Go to Attendance Management
        <span>→</span>
      </button>
    </div>
  )
}
