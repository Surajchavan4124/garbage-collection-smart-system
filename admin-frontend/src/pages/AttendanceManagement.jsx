import { useState } from 'react'
import { Search, BarChart3, Download, Clock, X } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import TopHeader from '../components/TopHeader'
import AttendanceChartModal from '../components/AttendanceChartModal'

export default function AttendanceManagement() {
  const [searchEmployee, setSearchEmployee] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('none')
  const [filterType, setFilterType] = useState('')
  const [filterEmployeeName, setFilterEmployeeName] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [isMarkingMode, setIsMarkingMode] = useState(false)
  const [isChartModalOpen, setIsChartModalOpen] = useState(false)
  const [monthlySearchEmployee, setMonthlySearchEmployee] = useState('')
  const [selectedMonthlyEmployee, setSelectedMonthlyEmployee] = useState(null)

  const [attendanceData, setAttendanceData] = useState([
    { id: 'E01', name: 'A. Sharma', role: 'Driver', area: 'Ward 1', status: 'present' },
    { id: 'E02', name: 'S. Kumar', role: 'Collector', area: 'Ward 5', status: 'absent' },
    { id: 'E03', name: 'R. Singh', role: 'Supervisor', area: 'Ward 3', status: 'present' },
    { id: 'E04', name: 'H. Bheem', role: 'Sanitation Worker', area: 'Ward 2', status: 'late' },
    { id: 'E05', name: 'M. Mukesh', role: 'Collector', area: 'Ward 6', status: 'present' },
    { id: 'E06', name: 'T. Taari', role: 'Collector', area: 'Ward 4', status: 'absent' },
    { id: 'E07', name: 'D. Dosta', role: 'Driver', area: 'Ward 8', status: 'present' },
    { id: 'E08', name: 'S. Nath', role: 'Sanitation Worker', area: 'Ward 7', status: 'leave' },
    { id: 'E09', name: 'N. Khan', role: 'Sanitation Worker', area: 'Ward 9', status: 'present' },
    { id: 'E10', name: 'P. Khan', role: 'Sanitation Worker', area: 'Ward 1', status: 'late' },
  ])

  const attendanceHistoryData = [
    { date: '11/01/2011', empId: 'E02', name: 'S. Kumar', reportingTime: '09:00 AM', status: 'Present' },
    { date: '12/01/2011', empId: 'E02', name: 'S. Kumar', reportingTime: '10:30 AM', status: 'Late' },
    { date: '13/01/2011', empId: 'E02', name: 'S. Kumar', reportingTime: '-', status: 'Absent' },
    { date: '14/01/2011', empId: 'E02', name: 'S. Kumar', reportingTime: '09:00 AM', status: 'Present' },
  ]

  const monthlyEmployeeData = [
    { id: 'E01', name: 'A. Sharma', totalDaysWorked: 24, totalAbsent: 3, totalLeave: 2, attendancePercent: 92 },
    { id: 'E02', name: 'S. Kumar', totalDaysWorked: 25, totalAbsent: 1, totalLeave: 1, attendancePercent: 96 },
    { id: 'E03', name: 'R. Singh', totalDaysWorked: 22, totalAbsent: 4, totalLeave: 1, attendancePercent: 88 },
    { id: 'E04', name: 'H. Bheem', totalDaysWorked: 23, totalAbsent: 2, totalLeave: 2, attendancePercent: 92 },
    { id: 'E05', name: 'M. Mukesh', totalDaysWorked: 26, totalAbsent: 0, totalLeave: 1, attendancePercent: 96 },
    { id: 'E06', name: 'T. Taari', totalDaysWorked: 24, totalAbsent: 2, totalLeave: 1, attendancePercent: 92 },
    { id: 'E07', name: 'D. Dosta', totalDaysWorked: 25, totalAbsent: 1, totalLeave: 1, attendancePercent: 96 },
    { id: 'E08', name: 'S. Nath', totalDaysWorked: 20, totalAbsent: 5, totalLeave: 2, attendancePercent: 80 },
  ]

  const presentCount = attendanceData.filter(d => d.status === 'present').length
  const absentCount = attendanceData.filter(d => d.status === 'absent').length
  const lateCount = attendanceData.filter(d => d.status === 'late').length
  const attendancePercentage = Math.round((presentCount / attendanceData.length) * 100)

  const handleStatusChange = (employeeId, newStatus) => {
    setAttendanceData(prev =>
      prev.map(emp =>
        emp.id === employeeId ? { ...emp, status: newStatus } : emp
      )
    )
  }

  const handleMarkAttendance = () => {
    setIsMarkingMode(!isMarkingMode)
  }

  const handleSaveAttendance = () => {
    console.log('Attendance saved:', attendanceData)
    setIsMarkingMode(false)
  }

  const handleViewChart = () => {
    setIsChartModalOpen(true)
  }

  const getFilteredHistory = () => {
    let filtered = attendanceHistoryData

    if (filterType === 'employeeName' && filterEmployeeName) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(filterEmployeeName.toLowerCase())
      )
    } else if (filterType === 'date' && filterDate) {
      filtered = filtered.filter(item => item.date === filterDate)
    }

    return filtered
  }

  const getRadioButtonStyle = (employeeStatus, buttonStatus, isDisabled) => {
    if (isMarkingMode) {
      return 'bg-white'
    }

    if (!isMarkingMode && employeeStatus === buttonStatus) {
      switch (buttonStatus) {
        case 'present':
          return 'bg-green-100'
        case 'absent':
          return 'bg-red-100'
        case 'late':
          return 'bg-yellow-100'
        case 'leave':
          return 'bg-blue-100'
        default:
          return 'bg-white'
      }
    }

    return 'bg-white'
  }

  const handleSearchMonthlyEmployee = (searchValue) => {
    setMonthlySearchEmployee(searchValue)
    const employee = monthlyEmployeeData.find(emp =>
      emp.name.toLowerCase().includes(searchValue.toLowerCase())
    )
    setSelectedMonthlyEmployee(employee || null)
  }

  return (
    <div className="flex bg-[#e5e9f0]">
      <Sidebar />

      <div className="ml-64 w-full">
        <TopHeader />

        <div className="pt-20 px-8 pb-8">
          <p className="text-sm text-gray-600 mb-6 font-medium">Main {'>'} Operational Management Dashboard {'>'} Attendance Management</p>

          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <p className="text-sm font-semibold text-gray-600 mb-2">Present Today</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">{presentCount}</p>
              <p className="text-xs text-gray-500">of {attendanceData.length} Scheduled</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <p className="text-sm font-semibold text-gray-600 mb-2">Absent Today</p>
              <p className="text-3xl font-bold text-gray-900">{absentCount}</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <p className="text-sm font-semibold text-gray-600 mb-2">Late Arrivals</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">{lateCount.toString().padStart(2, '0')}</p>
              <p className="text-xs text-gray-500">by 10:00 AM</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <p className="text-sm font-semibold text-gray-600 mb-2">Attendance Today</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{attendancePercentage}%</p>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#1f9e9a] rounded-full" style={{ width: `${attendancePercentage}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{presentCount} of {attendanceData.length} Present</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-8 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-4">Daily Attendance Marking</h2>

              <div className="flex items-center gap-4">
                <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2 border border-gray-300">
                  <Search size={18} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search Employee"
                    value={searchEmployee}
                    onChange={(e) => setSearchEmployee(e.target.value)}
                    className="flex-1 outline-none bg-transparent text-gray-700 text-sm"
                  />
                </div>

                <button
                  onClick={handleViewChart}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1f9e9a] text-white rounded-lg hover:bg-[#198a87] transition font-semibold text-sm"
                >
                  <BarChart3 size={16} />
                  View Chart
                </button>

                <button className="flex items-center gap-2 px-4 py-2 bg-[#1f9e9a] text-white rounded-lg hover:bg-[#198a87] transition font-semibold text-sm">
                  <Download size={16} />
                  Download Report
                </button>

                <button
                  onClick={handleMarkAttendance}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-semibold text-sm ${
                    isMarkingMode
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-[#1f9e9a] hover:bg-[#198a87] text-white'
                  }`}
                >
                  <Clock size={16} />
                  {isMarkingMode ? 'Cancel Marking' : 'Mark Attendance'}
                </button>

                {isMarkingMode && (
                  <button
                    onClick={handleSaveAttendance}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition font-semibold text-sm"
                  >
                    Save Attendance
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#1f9e9a] text-white">
                    <th className="px-6 py-3 text-left text-sm font-semibold">Employee ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Role/Responsibility</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Assigned Area</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((emp, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-800 font-medium">{emp.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{emp.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{emp.role}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{emp.area}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <label
                            className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg transition ${
                              getRadioButtonStyle(emp.status, 'present', !isMarkingMode)
                            } ${!isMarkingMode ? 'pointer-events-none' : ''}`}
                          >
                            <input
                              type="radio"
                              name={`status-${emp.id}`}
                              value="present"
                              checked={emp.status === 'present'}
                              onChange={() => handleStatusChange(emp.id, 'present')}
                              disabled={!isMarkingMode}
                              className="w-4 h-4"
                            />
                            <span className={`text-xs font-semibold flex items-center gap-1 ${
                              emp.status === 'present' ? 'text-green-700' : 'text-gray-600'
                            }`}>
                              <span>✓</span> Present
                            </span>
                          </label>

                          <label
                            className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg transition ${
                              getRadioButtonStyle(emp.status, 'absent', !isMarkingMode)
                            } ${!isMarkingMode ? 'pointer-events-none' : ''}`}
                          >
                            <input
                              type="radio"
                              name={`status-${emp.id}`}
                              value="absent"
                              checked={emp.status === 'absent'}
                              onChange={() => handleStatusChange(emp.id, 'absent')}
                              disabled={!isMarkingMode}
                              className="w-4 h-4"
                            />
                            <span className={`text-xs font-semibold flex items-center gap-1 ${
                              emp.status === 'absent' ? 'text-red-700' : 'text-gray-600'
                            }`}>
                              <span>✗</span> Absent
                            </span>
                          </label>

                          <label
                            className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg transition ${
                              getRadioButtonStyle(emp.status, 'late', !isMarkingMode)
                            } ${!isMarkingMode ? 'pointer-events-none' : ''}`}
                          >
                            <input
                              type="radio"
                              name={`status-${emp.id}`}
                              value="late"
                              checked={emp.status === 'late'}
                              onChange={() => handleStatusChange(emp.id, 'late')}
                              disabled={!isMarkingMode}
                              className="w-4 h-4"
                            />
                            <span className={`text-xs font-semibold flex items-center gap-1 ${
                              emp.status === 'late' ? 'text-yellow-700' : 'text-gray-600'
                            }`}>
                              <span>⏱</span> Late
                            </span>
                          </label>

                          <label
                            className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg transition ${
                              getRadioButtonStyle(emp.status, 'leave', !isMarkingMode)
                            } ${!isMarkingMode ? 'pointer-events-none' : ''}`}
                          >
                            <input
                              type="radio"
                              name={`status-${emp.id}`}
                              value="leave"
                              checked={emp.status === 'leave'}
                              onChange={() => handleStatusChange(emp.id, 'leave')}
                              disabled={!isMarkingMode}
                              className="w-4 h-4"
                            />
                            <span className={`text-xs font-semibold flex items-center gap-1 ${
                              emp.status === 'leave' ? 'text-blue-700' : 'text-gray-600'
                            }`}>
                              <span>📋</span> Leave
                            </span>
                          </label>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-8 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-4">Attendance History</h2>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700">Applied filter:</span>
                  {filterType === 'employeeName' && filterEmployeeName && (
                    <span className="px-3 py-1 bg-[#1f9e9a] text-white rounded-full text-xs font-medium flex items-center gap-2">
                      by employee name: {filterEmployeeName}
                      <button onClick={() => { setFilterType(''); setFilterEmployeeName(''); }} className="hover:opacity-80">
                        ×
                      </button>
                    </span>
                  )}
                  {filterType === 'date' && filterDate && (
                    <span className="px-3 py-1 bg-[#1f9e9a] text-white rounded-full text-xs font-medium flex items-center gap-2">
                      by date: {filterDate}
                      <button onClick={() => { setFilterType(''); setFilterDate(''); }} className="hover:opacity-80">
                        ×
                      </button>
                    </span>
                  )}
                  {!filterType && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">none</span>
                  )}
                </div>

                <div className="ml-auto flex items-center gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => {
                      setFilterType(e.target.value)
                      setFilterEmployeeName('')
                      setFilterDate('')
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#1f9e9a]"
                  >
                    <option value="">Filter</option>
                    <option value="employeeName">by employee name</option>
                    <option value="date">by date</option>
                  </select>

                  {filterType === 'employeeName' && (
                    <input
                      type="text"
                      placeholder="Enter employee name"
                      value={filterEmployeeName}
                      onChange={(e) => setFilterEmployeeName(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#1f9e9a]"
                    />
                  )}

                  {filterType === 'date' && (
                    <input
                      type="text"
                      placeholder="DD/MM/YYYY"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#1f9e9a]"
                    />
                  )}

                  <button
                    disabled={!filterType || (filterType === 'employeeName' && !filterEmployeeName) || (filterType === 'date' && !filterDate)}
                    className={`px-6 py-2 rounded-lg transition font-semibold text-sm flex items-center gap-2 ${
                      filterType && ((filterType === 'employeeName' && filterEmployeeName) || (filterType === 'date' && filterDate))
                        ? 'bg-[#1f9e9a] text-white hover:bg-[#198a87]'
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#1f9e9a] text-white">
                    <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Employee ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Reporting Time</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filterType ? (
                    getFilteredHistory().length > 0 ? (
                      getFilteredHistory().map((item, idx) => (
                        <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-800">{item.date}</td>
                          <td className="px-6 py-4 text-sm text-gray-800 font-medium">{item.empId}</td>
                          <td className="px-6 py-4 text-sm text-gray-800">{item.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-800">{item.reportingTime}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-3 py-1 rounded-full font-semibold text-xs ${
                              item.status === 'Present'
                                ? 'bg-green-100 text-green-700'
                                : item.status === 'Absent'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500 text-sm">
                          No records found
                        </td>
                      </tr>
                    )
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-500 text-sm">
                        Select a preferred filter to view details
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-4">Monthly Attendance Report</h2>

              <div className="flex items-center gap-4">
                <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2 border border-gray-300">
                  <Search size={18} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search Employee"
                    value={monthlySearchEmployee}
                    onChange={(e) => handleSearchMonthlyEmployee(e.target.value)}
                    className="flex-1 outline-none bg-transparent text-gray-700 text-sm"
                  />
                </div>

                <button
                  disabled={!selectedMonthlyEmployee}
                  className={`px-6 py-2 rounded-lg transition font-semibold text-sm flex items-center gap-2 ${
                    selectedMonthlyEmployee
                      ? 'bg-[#1f9e9a] text-white hover:bg-[#198a87]'
                      : 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-60'
                  }`}
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#1f9e9a] text-white">
                    <th className="px-6 py-3 text-left text-sm font-semibold">Employee ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Total Days Worked</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Total Absent</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Total Leave</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Attendance %</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedMonthlyEmployee ? (
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800 font-medium">{selectedMonthlyEmployee.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{selectedMonthlyEmployee.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{selectedMonthlyEmployee.totalDaysWorked}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{selectedMonthlyEmployee.totalAbsent}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{selectedMonthlyEmployee.totalLeave}</td>
                      <td className="px-6 py-4 text-sm text-gray-800 font-semibold">{selectedMonthlyEmployee.attendancePercent}%</td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500 text-sm">
                        Select a Employee to view the details
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {selectedMonthlyEmployee && (
              <div className="px-8 py-8 border-t border-gray-200 bg-gray-50">
                <h3 className="text-base font-bold text-gray-900 mb-6">Charts</h3>
                
                <div className="grid grid-cols-2 gap-8">
                  <div className="bg-[#E0F2F1] rounded-lg p-8 border border-[#1f9e9a]">
                    <h4 className="text-sm font-bold text-gray-900 mb-6 text-center">Bar chart (employee vs days present)</h4>
                    <div className="flex items-end justify-center gap-6 h-40">
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className="w-12 bg-gray-500 rounded"
                          style={{ height: `${(selectedMonthlyEmployee.totalDaysWorked / 26) * 120}px` }}
                        ></div>
                        <span className="text-xs text-gray-700 font-semibold text-center whitespace-nowrap">Days<br/>Worked</span>
                        <span className="text-xs text-gray-600">{selectedMonthlyEmployee.totalDaysWorked}</span>
                      </div>

                      <div className="flex flex-col items-center gap-2">
                        <div
                          className="w-12 bg-gray-400 rounded"
                          style={{ height: `${((selectedMonthlyEmployee.totalDaysWorked - selectedMonthlyEmployee.totalAbsent) / 26) * 120}px` }}
                        ></div>
                        <span className="text-xs text-gray-700 font-semibold text-center whitespace-nowrap">Days<br/>Present</span>
                        <span className="text-xs text-gray-600">{selectedMonthlyEmployee.totalDaysWorked - selectedMonthlyEmployee.totalAbsent}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#E0F2F1] rounded-lg p-8 border border-[#1f9e9a]">
                    <h4 className="text-sm font-bold text-gray-900 mb-6 text-center">Pie chart (overall % attendance for the month)</h4>
                    <div className="flex items-center justify-center">
                      <svg width="150" height="150" viewBox="0 0 150 150">
                        <circle
                          cx="75"
                          cy="75"
                          r="60"
                          fill="none"
                          stroke="#9CA3AF"
                          strokeWidth="30"
                          strokeDasharray={`${((selectedMonthlyEmployee.totalAbsent + selectedMonthlyEmployee.totalLeave) / 26) * 376.99} 376.99`}
                          transform="rotate(-90 75 75)"
                        />
                        <circle
                          cx="75"
                          cy="75"
                          r="60"
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="30"
                          strokeDasharray={`${(selectedMonthlyEmployee.attendancePercent / 100) * 376.99} 376.99`}
                          strokeDashoffset={`-${((selectedMonthlyEmployee.totalAbsent + selectedMonthlyEmployee.totalLeave) / 26) * 376.99}`}
                          transform="rotate(-90 75 75)"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AttendanceChartModal
        isOpen={isChartModalOpen}
        onClose={() => setIsChartModalOpen(false)}
        presentCount={presentCount}
        absentCount={absentCount}
        attendanceData={attendanceData}
      />
    </div>
  )
}
