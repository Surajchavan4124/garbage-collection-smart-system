import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function WasteStats() {
  const [filterDay, setFilterDay] = useState('All')
  const [filterWard, setFilterWard] = useState('Ward 1')
  const [showDayDropdown, setShowDayDropdown] = useState(false)
  const [showWardDropdown, setShowWardDropdown] = useState(false)

  const days = ['All', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const wards = ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5']

  const tableData = [
    { day: 'Mon', ward: 'Ward 1', volume: '50kg' },
    { day: 'Tue', ward: 'Ward 1', volume: '61kg' },
    { day: 'Wed', ward: 'Ward 1', volume: '61kg' },
    { day: 'Thu', ward: 'Ward 1', volume: '31kg' },
  ]

  // Filter table data based on selected filters
  const filteredData = tableData.filter(item => {
    const dayMatch = filterDay === 'All' || item.day === filterDay
    const wardMatch = item.ward === filterWard
    return dayMatch && wardMatch
  })

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Weekly Collection */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Weekly collection</h3>
        <p className="text-4xl font-bold text-gray-900 mb-1">10</p>
        <p className="text-xs text-gray-500 mb-6">tons collected this week</p>
        <div className="h-20 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-xs text-gray-500 font-medium">Line/Bar chart 📊</p>
        </div>
      </div>

      {/* Monthly Collection */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Monthly collection</h3>
        <p className="text-4xl font-bold text-gray-900 mb-1">100</p>
        <p className="text-xs text-gray-500 mb-6">tons collected this month<br />vs last month 50 tons</p>
        <div className="h-20 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-xs text-gray-500 font-medium">Pie chart 📈</p>
        </div>
      </div>

      {/* Collection Summary with Filters */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Waste collection summary</h3>
          
          {/* Filter Buttons */}
          <div className="flex gap-2">
            {/* Day Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDayDropdown(!showDayDropdown)}
                className="px-3 py-2 bg-gray-100 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-200 transition flex items-center gap-1"
              >
                {filterDay}
                <ChevronDown size={14} className={`transition-transform ${showDayDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Day Dropdown Menu */}
              {showDayDropdown && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32">
                  {days.map((day) => (
                    <button
                      key={day}
                      onClick={() => {
                        setFilterDay(day)
                        setShowDayDropdown(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-medium transition ${
                        filterDay === day
                          ? 'bg-[#1f9e9a] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Ward Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowWardDropdown(!showWardDropdown)}
                className="px-3 py-2 bg-gray-100 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-200 transition flex items-center gap-1"
              >
                {filterWard}
                <ChevronDown size={14} className={`transition-transform ${showWardDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Ward Dropdown Menu */}
              {showWardDropdown && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32">
                  {wards.map((ward) => (
                    <button
                      key={ward}
                      onClick={() => {
                        setFilterWard(ward)
                        setShowWardDropdown(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-medium transition ${
                        filterWard === ward
                          ? 'bg-[#1f9e9a] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {ward}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="space-y-2 text-xs">
          <div className="grid grid-cols-3 gap-4 font-semibold text-gray-700 pb-2 border-b border-gray-200">
            <span>Day</span>
            <span>Ward</span>
            <span>Volume(kg)</span>
          </div>
          {filteredData.length > 0 ? (
            filteredData.map((item, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-4 text-gray-700">
                <span>{item.day}</span>
                <span>{item.ward}</span>
                <span>{item.volume}</span>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No data available for selected filters
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
