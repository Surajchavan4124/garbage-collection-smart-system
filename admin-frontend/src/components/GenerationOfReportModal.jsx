import { useState } from 'react'
import { X, Calendar, Plus, FileText } from 'lucide-react'
import { toast } from 'react-toastify'
import api from '../api/axios'
import { generatePDF, generateExcel } from '../utils/reportGenerator'

export default function GenerationOfReportModal({ isOpen, onClose, reportType, onReportGenerated }) {
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    filterBy: '',
    appliedFilters: ['area'],
    outputFormat: 'screen',
    subType: 'waste'
  })
  const [loading, setLoading] = useState(false)

  const filterOptions = ['area', 'waste type']

  const handleDateChange = (e, dateType) => {
    setFilters(prev => ({
      ...prev,
      [dateType]: e.target.value
    }))
  }

  const handleFilterByChange = (e) => {
    setFilters(prev => ({
      ...prev,
      filterBy: e.target.value
    }))
  }

  const handleAddFilter = () => {
    if (filters.filterBy && !filters.appliedFilters.includes(filters.filterBy)) {
      setFilters(prev => ({
        ...prev,
        appliedFilters: [...prev.appliedFilters, filters.filterBy]
      }))
    }
  }

  const handleRemoveFilter = (filterToRemove) => {
    setFilters(prev => ({
      ...prev,
      appliedFilters: prev.appliedFilters.filter(f => f !== filterToRemove)
    }))
  }

  const handleOutputFormatChange = (e) => {
    setFilters(prev => ({
      ...prev,
      outputFormat: e.target.value
    }))
  }

  const handleGenerate = async () => {
    if (!filters.fromDate || !filters.toDate) {
      toast.error('Please select both From and To dates')
      return
    }

    setLoading(true)
    try {
      // 1. Fetch Data
      const res = await api.get('/reports/generate', {
        params: {
          type: reportType,
          from: filters.fromDate,
          to: filters.toDate,
          subType: filters.subType
          // panchayatId: ... (add context later if needed)
        }
      })

      const reportData = res.data

      const fullReportObject = {
        title: reportType,
        generatedAt: new Date().toLocaleString(),
        data: reportData
      }

      // 2. Handle Output Format
      if (filters.outputFormat === 'pdf') {
        generatePDF(fullReportObject)
        toast.success("PDF Downloaded")
      } else if (filters.outputFormat === 'excel') {
        generateExcel(fullReportObject)
        toast.success("Excel Downloaded")
      } else {
        // Screen View
        if (onReportGenerated) {
          onReportGenerated(reportData)
        }
        toast.success("Report Generated for Screen View")
      }

      handleCancel()

    } catch (error) {
      console.error("Generate Error", error)
      toast.error(error.response?.data?.message || "Failed to generate report")
    } finally {
      setLoading(false)
    }
  }



  const handleCancel = () => {
    setFilters({
      fromDate: '',
      toDate: '',
      filterBy: 'area',
      appliedFilters: ['area'],
      outputFormat: 'screen'
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
 <div className="fixed inset-0 modal-overlay bg-black/50 backdrop-blur-sm z-[9999]" onClick={handleCancel} /> 
 <div className="fixed inset-0 modal-overlay flex items-center justify-center z-[9999] p-4 pointer-events-none"> 
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-100 animate-fade-in-up overflow-hidden max-h-[90vh] flex flex-col pointer-events-auto">

          {/* Header */}
          <div className="px-6 py-5 flex items-center justify-between flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #1f9e9a, #16847f)' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <FileText size={18} className="text-white" />
              </div>
              <div>
                <p className="text-white/70 text-[10px] font-medium uppercase tracking-wider">Reports</p>
                <h2 className="text-white font-bold text-sm">Generate Report</h2>
              </div>
            </div>
            <button onClick={handleCancel} className="p-1.5 rounded-lg bg-white/15 text-white hover:bg-white/25 transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* Date Range Section */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-800">Date Range:</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700">From</label>
                  <input type="date" value={filters.fromDate} onChange={(e) => handleDateChange(e, 'fromDate')}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700">To</label>
                  <input type="date" value={filters.toDate} onChange={(e) => handleDateChange(e, 'toDate')}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" />
                </div>
              </div>
            </div>

            {/* Filter Section */}
            <div className="space-y-3">
              {reportType === 'Year-on-Year comparison charts' ? (
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-800">Select Data to Compare:</label>
                  <select value={filters.subType} onChange={(e) => setFilters(prev => ({ ...prev, subType: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm">
                    <option value="waste">Waste Collection (Total kg)</option>
                    <option value="complaint">Complaint Resolutions</option>
                    <option value="compliance">Segregation Compliance</option>
                    <option value="attendance">Employee Attendance</option>
                  </select>
                </div>
              ) : (
                <>
                  <label className="block text-sm font-bold text-gray-800">Filter by (Optional):</label>
                  <div className="flex gap-2">
                    <select value={filters.filterBy} onChange={handleFilterByChange}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm">
                      <option value="">Select Filter</option>
                      {filterOptions.map(option => (<option key={option} value={option}>{option}</option>))}
                    </select>
                    <button onClick={handleAddFilter}
                      className="p-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition flex items-center justify-center">
                      <Plus size={20} />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Applied Filters */}
            {filters.appliedFilters.length > 0 && (
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-800">Applied Filter:</label>
                <div className="flex flex-wrap gap-2">
                  {filters.appliedFilters.map((filter, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-3 py-1 bg-teal-100 border border-teal-500 rounded-full text-teal-700 text-sm font-medium">
                      {filter}
                      <button onClick={() => handleRemoveFilter(filter)} className="hover:text-teal-900 font-bold ml-1">×</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Output Format */}
            <div className="space-y-3 border-t border-gray-100 pt-5">
              <label className="block text-sm font-bold text-gray-800">Output Format:</label>
              <div className="flex gap-6">
                {[{ val: 'screen', label: 'View On-Screen' }, { val: 'pdf', label: 'Download PDF' }, { val: 'excel', label: 'Download Excel' }].map(({ val, label }) => (
                  <label key={val} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="output" value={val} checked={filters.outputFormat === val}
                      onChange={handleOutputFormatChange} className="w-4 h-4 accent-teal-500" />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 px-6 pb-6 pt-4 border-t border-gray-100 flex-shrink-0">
            <button onClick={handleCancel} disabled={loading}
              className="flex-1 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors">
              Cancel
            </button>
            <button onClick={handleGenerate} disabled={loading}
              className="flex-1 px-5 py-2.5 text-white rounded-xl text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #1f9e9a, #16847f)' }}>
              {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</> : 'Generate Report'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
