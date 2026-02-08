import { useState } from 'react'
import { X, Calendar, Plus } from 'lucide-react'
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl max-h-screen overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-bold text-gray-800">GENERATE REPORT</h2>
          <button
            onClick={handleCancel}
            className="p-1 hover:bg-gray-100 rounded transition"
          >
            <X size={28} className="text-gray-600" />
          </button>
        </div>

        {/* Form Content */}
        <div className="space-y-6">

          {/* Date Range Section */}
          <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-800">Date Range:</label>

            <div className="grid grid-cols-2 gap-4">
                {/* From Date */}
                <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700">From</label>
                <div className="relative">
                    <input
                    type="date"
                    value={filters.fromDate}
                    onChange={(e) => handleDateChange(e, 'fromDate')}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                    />
                </div>
                </div>

                {/* To Date */}
                <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700">To</label>
                <div className="relative">
                    <input
                    type="date"
                    value={filters.toDate}
                    onChange={(e) => handleDateChange(e, 'toDate')}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                    />
                </div>
                </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="space-y-3">
             {reportType === 'Year-on-Year comparison charts' ? (
                <div className="space-y-3">
                     <label className="block text-sm font-bold text-gray-800">Select Data to Compare:</label>
                     <select
                        value={filters.subType}
                        onChange={(e) => setFilters(prev => ({ ...prev, subType: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                    >
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
                    <select
                        value={filters.filterBy}
                        onChange={handleFilterByChange}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                    >
                        <option value="">Select Filter</option>
                        {filterOptions.map(option => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                        ))}
                    </select>
                    <button
                        onClick={handleAddFilter}
                        className="p-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition flex items-center justify-center"
                        title="Add filter"
                    >
                        <Plus size={20} />
                    </button>
                    </div>
                </>
             )}
          </div>

          {/* Applied Filters Section */}
          {filters.appliedFilters.length > 0 && (
            <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-800">Applied Filter:</label>
                <div className="flex flex-wrap gap-2">
                {filters.appliedFilters.map((filter, idx) => (
                    <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-1 bg-teal-100 border border-teal-500 rounded-full text-teal-700 text-sm font-medium"
                    >
                    {filter}
                    <button
                        onClick={() => handleRemoveFilter(filter)}
                        className="hover:text-teal-900 transition font-bold ml-1"
                    >
                        ×
                    </button>
                    </div>
                ))}
                </div>
            </div>
          )}

          {/* Output Format Section */}
          <div className="space-y-3 border-t border-gray-200 pt-6">
            <label className="block text-sm font-bold text-gray-800">Output Format:</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="output"
                  value="screen"
                  checked={filters.outputFormat === 'screen'}
                  onChange={handleOutputFormatChange}
                  className="w-4 h-4 accent-teal-500"
                />
                <span className="text-sm text-gray-700">View On-Screen</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="output"
                  value="pdf"
                  checked={filters.outputFormat === 'pdf'}
                  onChange={handleOutputFormatChange}
                  className="w-4 h-4 accent-teal-500"
                />
                <span className="text-sm text-gray-700">Download PDF</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="output"
                  value="excel"
                  checked={filters.outputFormat === 'excel'}
                  onChange={handleOutputFormatChange}
                  className="w-4 h-4 accent-teal-500"
                />
                <span className="text-sm text-gray-700">Download Excel</span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 px-6 py-2 bg-red-500 text-white rounded font-semibold text-sm hover:bg-red-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex-1 px-6 py-2 bg-teal-500 text-white rounded font-semibold text-sm hover:bg-teal-600 transition disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>
    </div>
  )
}
