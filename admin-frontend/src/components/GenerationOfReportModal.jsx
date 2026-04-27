import { useState, useEffect } from 'react'
import { X, Calendar, FileText, Filter, Eye, FileSpreadsheet } from 'lucide-react'
import { toast } from 'react-toastify'
import api from '../api/axios'
import { generatePDF, generateExcel } from '../utils/reportGenerator'

export default function GenerationOfReportModal({ isOpen, onClose, reportType, onReportGenerated }) {
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    ward: 'All',
    category: 'All',
    status: 'All',
    role: 'All',
    employeeId: 'All',
    outputFormat: 'screen',
    subType: 'waste'
  })
  const [loading, setLoading] = useState(false)
  const [wards, setWards] = useState([])
  const [employees, setEmployees] = useState([])

  useEffect(() => {
    if (isOpen) {
      fetchWards()
      fetchEmployees()
    }
  }, [isOpen])

  const fetchWards = async () => {
    try {
      const res = await api.get('/wards')
      setWards(res.data)
    } catch (error) { console.error("Failed to fetch wards", error) }
  }

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees')
      setEmployees(res.data)
    } catch (error) { console.error("Failed to fetch employees", error) }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const handleGenerate = async () => {
    if (!filters.fromDate || !filters.toDate) {
      toast.error('Please select both From and To dates')
      return
    }

    setLoading(true)
    try {
      const res = await api.get('/reports/generate', {
        params: {
          type: reportType,
          from: filters.fromDate,
          to: filters.toDate,
          subType: filters.subType,
          ward: filters.ward !== 'All' ? filters.ward : undefined,
          category: filters.category !== 'All' ? filters.category : undefined,
          status: filters.status !== 'All' ? filters.status : undefined,
          role: filters.role !== 'All' ? filters.role : undefined,
          employeeId: filters.employeeId !== 'All' ? filters.employeeId : undefined,
        }
      })

      const reportData = res.data.data

      const fullReportObject = {
        title: reportType,
        generatedAt: new Date().toLocaleString(),
        data: reportData,
        period: { from: filters.fromDate, to: filters.toDate },
        appliedFilters: {
          ward: filters.ward,
          category: filters.category,
          status: filters.status,
          role: filters.role,
          employee: filters.employeeId !== 'All' ? employees.find(e => e._id === filters.employeeId)?.name : 'All'
        }
      }

      if (filters.outputFormat === 'pdf') {
        generatePDF(fullReportObject)
        toast.success("PDF Downloaded")
      } else if (filters.outputFormat === 'excel') {
        generateExcel(fullReportObject)
        toast.success("Excel Downloaded")
      } else {
        if (onReportGenerated) {
          onReportGenerated(reportData)
        }
        toast.success("Report Generated for Screen View")
      }
      onClose()
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
      ward: 'All',
      category: 'All',
      status: 'All',
      role: 'All',
      employeeId: 'All',
      outputFormat: 'screen',
      subType: 'waste'
    })
    onClose()
  }

  if (!isOpen) return null

  const inputCls = "w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm bg-gray-50/50"
  const labelCls = "block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1"

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999]" onClick={handleCancel} />
      <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4 pointer-events-none">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl border border-gray-100 overflow-hidden flex flex-col pointer-events-auto animate-in fade-in zoom-in duration-200">
          
          {/* Header */}
          <div className="px-8 py-6 flex items-center justify-between bg-gradient-to-r from-teal-600 to-teal-700">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                <FileText size={22} className="text-white" />
              </div>
              <div>
                <p className="text-teal-100 text-[10px] font-bold uppercase tracking-[0.2em]">Generate Analytics</p>
                <h2 className="text-white font-black text-lg leading-tight">{reportType}</h2>
              </div>
            </div>
            <button onClick={handleCancel} className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all">
              <X size={20} />
            </button>
          </div>

          <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Date Range Section */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>From Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input type="date" name="fromDate" value={filters.fromDate} onChange={handleFilterChange} className={`${inputCls} pl-10`} />
                </div>
              </div>
              <div>
                <label className={labelCls}>To Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input type="date" name="toDate" value={filters.toDate} onChange={handleFilterChange} className={`${inputCls} pl-10`} />
                </div>
              </div>
            </div>

            {/* Dynamic Filters based on Report Type */}
            <div className="pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Year-on-Year specific */}
              {reportType === 'Year-on-Year comparison charts' && (
                <div className="md:col-span-2">
                  <label className={labelCls}>Comparison Type</label>
                  <select name="subType" value={filters.subType} onChange={handleFilterChange} className={inputCls}>
                    <option value="waste">Waste Collection Volumes</option>
                    <option value="complaint">Complaint Resolution Rates</option>
                    <option value="compliance">Segregation Compliance %</option>
                    <option value="attendance">Staff Presence Stats</option>
                  </select>
                </div>
              )}

              {/* Ward Filter - Relevant for most reports */}
              {(reportType.includes('Waste') || reportType.includes('Complaint') || reportType.includes('Segregation')) && (
                <div>
                  <label className={labelCls}>Ward Selection</label>
                  <select name="ward" value={filters.ward} onChange={handleFilterChange} className={inputCls}>
                    <option value="All">All Wards</option>
                    {wards.map(w => <option key={w._id} value={w.name}>{w.name}</option>)}
                  </select>
                </div>
              )}

              {/* Complaint Category - Specific to Complaint reports */}
              {reportType.includes('Complaint') && (
                <>
                  <div>
                    <label className={labelCls}>Category</label>
                    <select name="category" value={filters.category} onChange={handleFilterChange} className={inputCls}>
                      <option value="All">All Categories</option>
                      {['Waste Collection', 'Streetlight', 'Water Supply', 'Drainage', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Status</label>
                    <select name="status" value={filters.status} onChange={handleFilterChange} className={inputCls}>
                      <option value="All">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                </>
              )}

              {/* Attendance specific filters */}
              {reportType.includes('Attendance') && (
                <>
                  <div>
                    <label className={labelCls}>Staff Role</label>
                    <select name="role" value={filters.role} onChange={handleFilterChange} className={inputCls}>
                      <option value="All">All Roles</option>
                      <option value="Driver">Driver</option>
                      <option value="Labour">Labour</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Specific Employee</label>
                    <select name="employeeId" value={filters.employeeId} onChange={handleFilterChange} className={inputCls}>
                      <option value="All">All Employees</option>
                      {employees
                        .filter(e => filters.role === 'All' || e.role === filters.role)
                        .map(e => <option key={e._id} value={e._id}>{e.name} ({e.employeeCode})</option>)
                      }
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Output Format */}
            <div className="pt-6 border-t border-gray-100">
              <label className={labelCls}>Report Output Format</label>
              <div className="flex bg-gray-100/50 p-1.5 rounded-2xl gap-2">
                {[
                  { id: 'screen', label: 'View On Screen', icon: Eye },
                  { id: 'pdf', label: 'PDF Document', icon: FileText },
                  { id: 'excel', label: 'Excel Sheet', icon: FileSpreadsheet }
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setFilters(prev => ({ ...prev, outputFormat: fmt.id }))}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      filters.outputFormat === fmt.id ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <fmt.icon size={14} />
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="p-8 bg-gray-50/50 flex gap-4">
            <button onClick={handleCancel} disabled={loading}
              className="flex-1 py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all">
              Cancel
            </button>
            <button onClick={handleGenerate} disabled={loading}
              className="flex-[2] py-4 bg-teal-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-teal-600/20 hover:bg-teal-700 transition-all flex items-center justify-center gap-2">
              {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</> : 'Generate Report'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
