import { useState } from 'react'
import { X, Calendar, Plus } from 'lucide-react'

export default function GenerationOfReportModal({ isOpen, onClose, reportType }) {
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    filterBy: '',
    appliedFilters: ['area'],
    outputFormat: 'screen'
  })

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

  const handleGenerate = () => {
    if (!filters.fromDate || !filters.toDate) {
      alert('Please select both From and To dates')
      return
    }
    alert(`Report Generated!\n\nReport Type: ${reportType}\nFilters Applied:\n- ${filters.appliedFilters.join('\n- ')}\nOutput: ${filters.outputFormat}`)
    handleCancel()
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
          <h2 className="text-2xl font-bold text-gray-800">SELECT FILTER</h2>
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

            {/* From Date */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700">From</label>
              <div className="relative">
                <input
                  type="date"
                  value={filters.fromDate}
                  onChange={(e) => handleDateChange(e, 'fromDate')}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  placeholder="dd - mm - yyyy"
                />
                <Calendar size={18} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
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
                  placeholder="dd - mm - yyyy"
                />
                <Calendar size={18} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-800">Filter by:</label>
            <div className="flex gap-2">
              <select
                value={filters.filterBy}
                onChange={handleFilterByChange}
                className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              >
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
          </div>

          {/* Applied Filters Section */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-800">Applied Filter:</label>
            <div className="flex flex-wrap gap-2">
              {filters.appliedFilters.map((filter, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1 bg-teal-100 border border-teal-500 rounded-full text-teal-700 text-sm font-medium"
                >
                  {filter}
                  {filters.appliedFilters.length > 1 && (
                    <button
                      onClick={() => handleRemoveFilter(filter)}
                      className="hover:text-teal-900 transition font-bold"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

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
                <span className="text-sm text-gray-700">Download pdf</span>
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
                <span className="text-sm text-gray-700">Download excel</span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="flex-1 px-6 py-2 bg-red-500 text-white rounded font-semibold text-sm hover:bg-red-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            className="flex-1 px-6 py-2 bg-teal-500 text-white rounded font-semibold text-sm hover:bg-teal-600 transition"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  )
}
