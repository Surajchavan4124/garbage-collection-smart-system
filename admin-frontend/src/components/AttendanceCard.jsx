import { useNavigate } from 'react-router-dom'

export default function AttendanceCard({ total = 0, present = 0, recent = [] }) {
  const navigate = useNavigate()

  const handleNavigate = () => {
    navigate('/attendance')
  }

  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-6">Attendance Today</h3>
      
      {/* Percentage */}
      <p className="text-4xl font-bold text-[#1f9e9a] mb-4">{percentage}%</p>
      <p className="text-xs text-gray-500 mb-4">{present} of {total} Present</p>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
        <div className="h-full bg-[#1f9e9a] rounded-full" style={{ width: `${percentage}%` }}></div>
      </div>

      {/* Attendance Table */}
      <div className="space-y-3 mb-6">
        {recent.length > 0 ? recent.slice(0, 3).map((item, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{item.name}</span>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
              item.status === 'Present' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
            }`}>
              {item.status}
            </span>
          </div>
        )) : (
            <p className="text-xs text-gray-500 text-center">No attendance data yet.</p>
        )}
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
