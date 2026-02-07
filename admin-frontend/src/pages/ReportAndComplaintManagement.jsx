import { useState, useEffect } from 'react'
import { Search, Filter, Download, Eye, ImageIcon, FileText, Table } from 'lucide-react'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { toast } from 'react-toastify'
import Sidebar from '../components/Sidebar'
import TopHeader from '../components/TopHeader'
import ViewComplaintModal from '../components/ViewComplaintModal'
import api from '../api/axios'

export default function ReportAndComplaintManagement() {
  const [complaints, setComplaints] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  
  // Filter & Download States
  const [statusFilter, setStatusFilter] = useState('All')
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)
  
  const [metrics, setMetrics] = useState({
    new: 0,
    pending: 0,
    resolved: 0
  })

  useEffect(() => {
    fetchData()
    const interval = setInterval(() => {
      fetchData(true)
    }, 10000) // Poll every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const fetchData = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true)
      const [complaintsRes, employeesRes] = await Promise.all([
        api.get('/complaints'),
        api.get('/employees')
      ])

      const mappedComplaints = complaintsRes.data.map(c => ({
        originalId: c._id,
        id: c.complaintId || c._id, 
        createdAt: c.createdAt,
        dateSubmitted: new Date(c.createdAt).toLocaleDateString(),
        name: c.reporterName,
        mobile: c.reporterMobile,
        category: c.type,
        ward: c.ward || 'N/A', 
        photo: c.photo,
        status: c.status,
        assignedEmployee: c.assignedTo || null, // Keeping the whole object or null
        description: c.description
      }))

      setComplaints(mappedComplaints)
      setEmployees(employeesRes.data)
      calculateMetrics(mappedComplaints)
    } catch (error) {
      console.error('Failed to fetch data', error)
    } finally {
      if (!isBackground) setLoading(false)
    }
  }

  const calculateMetrics = (data) => {
    const newComplaints = data.filter(c => c.status === 'Received').length
    const pending = data.filter(c => c.status === 'In Progress' || (c.status === 'Received' && !c.assignedEmployee)).length
    const resolved = data.filter(c => c.status === 'Resolved').length

    setMetrics({
      new: newComplaints,
      pending: pending,
      resolved: resolved
    })
  }

  // Filter complaints based on search and status
  const filteredComplaints = complaints.filter(
    (complaint) => {
      const matchesSearch = complaint.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            complaint.name?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'All' || complaint.status === statusFilter
      
      return matchesSearch && matchesStatus
    }
  )

  // Download Handlers
  const handleDownloadCSV = () => {
    const headers = ['Complaint ID', 'Date', 'Name', 'Category', 'Ward', 'Status', 'Assigned To', 'Resolution Time']
    const rows = filteredComplaints.map(c => [
      c.id,
      c.dateSubmitted,
      c.name,
      c.category,
      c.ward,
      c.status,
      c.assignedEmployee ? c.assignedEmployee.name : 'Unassigned',
      c.resolutionTime || '-'
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(item => `"${item}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `complaints_report_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    setShowDownloadMenu(false)
  }

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF()
      
      doc.text('Complaints Report', 14, 15)
      doc.setFontSize(10)
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22)

      const tableColumn = ['ID', 'Date', 'Name', 'Category', 'Ward', 'Status', 'Assigned']
      const tableRows = filteredComplaints.map(c => [
        c.id,
        c.dateSubmitted,
        c.name,
        c.category,
        c.ward,
        c.status,
        c.assignedEmployee ? c.assignedEmployee.name : 'Unassigned'
      ])

      // Functional usage of autoTable with fallback
      if (typeof autoTable === 'function') {
        autoTable(doc, {
          startY: 25,
          head: [tableColumn],
          body: tableRows,
        })
      } else {
        doc.autoTable({
          startY: 25,
          head: [tableColumn],
          body: tableRows,
        })
      }

      doc.save(`complaints_report_${new Date().toISOString().split('T')[0]}.pdf`)
      setShowDownloadMenu(false)
    } catch (error) {
      console.error("PDF Export Error:", error)
      toast.error(`Failed to download PDF: ${error.message}`)
    }
  }

  // Get complaints by status
  const receivedComplaints = complaints.filter(c => c.status === 'Received')
  const inProgressComplaints = complaints.filter(c => c.status === 'In Progress')
  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved')

  // Handle view complaint details
  const handleViewComplaint = (complaint) => {
    setSelectedComplaint(complaint)
    setIsViewModalOpen(true)
  }

  // Handle status update from modal or kanban
  const handleStatusUpdate = async (complaintId, updatedData) => {
    try {
        await api.patch(`/complaints/${complaintId}`, updatedData)
        fetchData() // Refresh data
        toast.success("Complaint updated successfully")
    } catch (error) {
        console.error(error)
        toast.error('Failed to update complaint')
    }
  }

  const handleAssignEmployee = async (complaintId, employeeId) => {
    if (!employeeId) return
    try {
      await api.patch(`/complaints/${complaintId}`, {
        assignedTo: employeeId,
        status: 'In Progress' // Auto-move to In Progress on assignment? Optional but common.
      })
      fetchData()
      toast.success("Employee assigned successfully")
    } catch (err) {
      console.error(err)
      toast.error("Failed to assign employee")
    }
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Received': return 'bg-red-100 text-red-700'
      case 'In Progress': return 'bg-yellow-100 text-yellow-700'
      case 'Resolved': return 'bg-teal-100 text-teal-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getKanbanCardBorder = (status) => {
    switch (status) {
      case 'Received': return 'border-l-4 border-red-500 bg-red-50'
      case 'In Progress': return 'border-l-4 border-yellow-500 bg-yellow-50'
      case 'Resolved': return 'border-l-4 border-teal-500 bg-teal-50'
      default: return 'border-l-4 border-gray-500 bg-gray-50'
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col overflow-hidden">
        <TopHeader />
        <div className="mt-16 flex-1 overflow-y-auto p-6 bg-gray-100">
          
          <div className="mb-6 text-sm text-gray-600">
            <span>Reports & Complaints</span> &gt;{' '}
            <span className="font-semibold text-gray-800">Report & Complaint Management</span>
          </div>

          {/* ===== COMPLAINTS OVERVIEW (KPI CARDS) ===== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-md transition">
              <p className="text-sm font-semibold text-gray-600 mb-2">New Complaints</p>
              <p className="text-4xl font-bold text-gray-800 mb-1">
                {String(metrics.new).padStart(2, '0')}
              </p>
              <p className="text-xs text-gray-500">Status: Received</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-md transition">
              <p className="text-sm font-semibold text-gray-600 mb-2">Pending Complaints</p>
              <p className="text-4xl font-bold text-gray-800 mb-1">
                {String(metrics.pending).padStart(2, '0')}
              </p>
              <p className="text-xs text-gray-500">In Progress or Unassigned</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-md transition">
              <p className="text-sm font-semibold text-gray-600 mb-2">Resolved Complaints</p>
              <p className="text-4xl font-bold text-gray-800 mb-1">
                {metrics.resolved}
              </p>
              <p className="text-xs text-gray-500">Total Resolved</p>
            </div>
          </div>

          {/* ===== COMPLAINTS TABLE ===== */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4">COMPLAINTS TABLE</h2>
              <div className="flex items-center gap-3">
                <Search size={18} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Complaints by ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border-0 focus:outline-none text-sm"
                />
                {/* Filter Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setShowFilterMenu(!showFilterMenu)
                      setShowDownloadMenu(false)
                    }}
                    className={`flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition ${statusFilter !== 'All' ? 'bg-teal-50 text-teal-700 border-teal-500' : ''}`}
                  >
                    <Filter size={16} />
                    <span>Filter {statusFilter !== 'All' ? `(${statusFilter})` : ''}</span>
                  </button>
                  
                  {showFilterMenu && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-xl z-20">
                      {['All', 'Received', 'In Progress', 'Resolved'].map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setStatusFilter(status)
                            setShowFilterMenu(false)
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${statusFilter === status ? 'bg-teal-50 text-teal-600 font-bold' : 'text-gray-700'}`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Download Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => {
                      setShowDownloadMenu(!showDownloadMenu)
                      setShowFilterMenu(false)
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition"
                  >
                    <Download size={16} />
                    <span>Download</span>
                  </button>

                  {showDownloadMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-xl z-20">
                      <button
                        onClick={handleDownloadCSV}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Table size={16} /> Download CSV
                      </button>
                      <button
                        onClick={handleDownloadPDF}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <FileText size={16} /> Download PDF
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-teal-500 text-white">
                    <th className="px-4 py-3 text-left text-xs font-bold">Complaint ID</th>
                    <th className="px-4 py-3 text-left text-xs font-bold">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-bold">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-bold">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-bold">Ward</th>
                    <th className="px-4 py-3 text-left text-xs font-bold">Photo</th>
                    <th className="px-4 py-3 text-left text-xs font-bold">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-bold">Assigned</th>
                    <th className="px-4 py-3 text-left text-xs font-bold">View</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.map((complaint, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-4 text-sm font-semibold text-gray-800">{complaint.id}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{complaint.dateSubmitted}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{complaint.name}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{complaint.category}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{complaint.ward}</td>
                      <td className="px-4 py-4 text-center">
                        {complaint.photo ? (
                          <div className="flex justify-center gap-1">
                            <ImageIcon size={16} className="text-gray-500" />
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(complaint.status)}`}>
                          {complaint.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {complaint.assignedEmployee ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center text-xs text-white font-bold">
                              {complaint.assignedEmployee.name?.charAt(0)}
                            </div>
                            <span className="text-gray-700">{complaint.assignedEmployee.name}</span>
                          </div>
                        ) : (
                          <span className="text-red-600 font-medium text-xs">Unassigned</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => handleViewComplaint(complaint)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredComplaints.length === 0 && (
                    <tr>
                      <td colSpan="9" className="text-center py-4 text-gray-500">No complaints found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ===== UPDATE STATUS (KANBAN WORKFLOW) ===== */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">UPDATE STATUS</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* RECEIVED COLUMN */}
              <div className="space-y-4">
                <h3 className="text-md font-bold text-gray-700">Received</h3>
                {receivedComplaints.length > 0 ? (
                  receivedComplaints.map((complaint) => (
                    <div key={complaint.id} className={`${getKanbanCardBorder(complaint.status)} rounded-lg p-4 space-y-3 shadow-sm hover:shadow-md transition`}>
                      <div>
                        <p className="text-xs font-semibold text-gray-600">ID: {complaint.id}</p>
                        <p className="text-sm font-medium text-gray-800">Category: {complaint.category}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600">Ward: {complaint.ward}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2">Assigned To:</p>
                        <select
                          onChange={(e) => handleAssignEmployee(complaint.originalId, e.target.value)}
                          value={complaint.assignedEmployee ? complaint.assignedEmployee._id : ""}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <option value="">+ select employee</option>
                          {employees.map(emp => (
                            <option key={emp._id} value={emp._id}>{emp.name} - {emp.role}</option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={() => handleViewComplaint(complaint)}
                        className="text-red-600 text-xs font-semibold hover:underline cursor-pointer"
                      >
                        View more details
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-dashed">
                    <p className="text-sm">No received complaints</p>
                  </div>
                )}
              </div>

              {/* IN-PROGRESS COLUMN */}
              <div className="space-y-4">
                <h3 className="text-md font-bold text-gray-700">In-Progress</h3>
                {inProgressComplaints.length > 0 ? (
                  inProgressComplaints.map((complaint) => (
                    <div key={complaint.id} className={`${getKanbanCardBorder(complaint.status)} rounded-lg p-4 space-y-3 shadow-sm hover:shadow-md transition`}>
                      <div>
                        <p className="text-xs font-semibold text-gray-600">ID: {complaint.id.substring(0, 8)}...</p>
                        <p className="text-sm font-medium text-gray-800">Category: {complaint.category}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600">Assigned:</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center text-xs text-white font-bold">
                            {complaint.assignedEmployee?.name?.charAt(0)}
                          </div>
                          <span className="text-sm text-gray-800 font-medium">{complaint.assignedEmployee?.name || 'Unknown'}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewComplaint(complaint)}
                        className="text-yellow-600 text-xs font-semibold hover:underline cursor-pointer"
                      >
                        View more details
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-dashed">
                    <p className="text-sm">No in-progress complaints</p>
                  </div>
                )}
              </div>

              {/* RESOLVED COLUMN */}
              <div className="space-y-4">
                <h3 className="text-md font-bold text-gray-700">Resolved</h3>
                {resolvedComplaints.length > 0 ? (
                  resolvedComplaints.map((complaint) => (
                    <div key={complaint.id} className={`${getKanbanCardBorder(complaint.status)} rounded-lg p-4 space-y-3 shadow-sm hover:shadow-md transition`}>
                      <div>
                        <p className="text-xs font-semibold text-gray-600">ID: {complaint.id}</p>
                        <p className="text-sm font-medium text-gray-800">Category: {complaint.category}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600">Assigned:</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-6 h-6 bg-teal-400 rounded-full flex items-center justify-center text-xs text-white font-bold">
                            {complaint.assignedEmployee?.name?.charAt(0)}
                          </div>
                          <span className="text-sm text-gray-800 font-medium">{complaint.assignedEmployee?.name || 'Unknown'}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewComplaint(complaint)}
                        className="text-teal-600 text-xs font-semibold hover:underline cursor-pointer"
                      >
                        View more details
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-dashed">
                    <p className="text-sm">No resolved complaints</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ViewComplaintModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        complaint={selectedComplaint}
        onStatusUpdate={handleStatusUpdate}
        employees={employees}
      />
    </div>
  )
}
