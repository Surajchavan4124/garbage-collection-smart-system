import { useState } from 'react'
import { Search, Filter, Download, Eye, ImageIcon } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import TopHeader from '../components/TopHeader'
import ViewComplaintModal from '../components/ViewComplaintModal'
import { complaintsData, complaintMetrics, employeesList } from '../data/complaintMockData'

export default function ReportAndComplaintManagement() {
  const [complaints, setComplaints] = useState(complaintsData)
  const [searchTerm, setSearchTerm] = useState('')
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedComplaint, setSelectedComplaint] = useState(null)

  // Filter complaints based on search
  const filteredComplaints = complaints.filter(
    (complaint) =>
      complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Get complaints by status
  const receivedComplaints = complaints.filter(c => c.status === 'Received')
  const inProgressComplaints = complaints.filter(c => c.status === 'In Progress')
  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved')

  // Handle view complaint details
  const handleViewComplaint = (complaint) => {
    setSelectedComplaint(complaint)
    setIsViewModalOpen(true)
  }

  // Handle status update from modal
  const handleStatusUpdate = (complaintId, updatedData) => {
    setComplaints(complaints.map(complaint =>
      complaint.id === complaintId
        ? { ...complaint, ...updatedData }
        : complaint
    ))
    alert('Complaint updated successfully!')
  }

  const handleAssignEmployee = (complaintId, employeeName) => {
    setComplaints(complaints.map(complaint =>
      complaint.id === complaintId
        ? { ...complaint, assignedEmployee: employeeName }
        : complaint
    ))
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Received':
        return 'bg-red-100 text-red-700'
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-700'
      case 'Resolved':
        return 'bg-teal-100 text-teal-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getKanbanCardBorder = (status) => {
    switch (status) {
      case 'Received':
        return 'border-l-4 border-red-500 bg-red-50'
      case 'In Progress':
        return 'border-l-4 border-yellow-500 bg-yellow-50'
      case 'Resolved':
        return 'border-l-4 border-teal-500 bg-teal-50'
      default:
        return 'border-l-4 border-gray-500 bg-gray-50'
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Fixed */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 flex-1 flex flex-col overflow-hidden">
        {/* Top Header - Fixed */}
        <TopHeader />

        {/* Page Content - Scrollable below header */}
        <div className="mt-16 flex-1 overflow-y-auto p-6 bg-gray-100">
          
          {/* Breadcrumbs */}
          <div className="mb-6 text-sm text-gray-600">
            <span>Reports & Complaints</span> &gt;{' '}
            <span className="font-semibold text-gray-800">Report & Complaint Management</span>
          </div>

          {/* ===== COMPLAINTS OVERVIEW (KPI CARDS) ===== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* New Complaints */}
            <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-md transition">
              <p className="text-sm font-semibold text-gray-600 mb-2">New Complaints</p>
              <p className="text-4xl font-bold text-gray-800 mb-1">
                {String(complaintMetrics.newComplaints).padStart(2, '0')}
              </p>
              <p className="text-xs text-gray-500">In last 24 hours</p>
            </div>

            {/* Pending Complaints */}
            <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-md transition">
              <p className="text-sm font-semibold text-gray-600 mb-2">Pending Complaints</p>
              <p className="text-4xl font-bold text-gray-800 mb-1">
                {String(complaintMetrics.pendingComplaints).padStart(2, '0')}
              </p>
              <p className="text-xs text-gray-500">Waiting Assignment</p>
            </div>

            {/* Resolved Complaints */}
            <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-md transition">
              <p className="text-sm font-semibold text-gray-600 mb-2">Resolved Complaints</p>
              <p className="text-4xl font-bold text-gray-800 mb-1">
                {complaintMetrics.resolvedComplaints}
              </p>
              <p className="text-xs text-gray-500">This Month</p>
            </div>
          </div>

          {/* ===== COMPLAINTS TABLE ===== */}
          <div className="bg-white rounded-lg shadow mb-6">
            {/* Title & Search Toolbar */}
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
                <button className="p-2 hover:bg-gray-100 rounded transition">
                  <Filter size={18} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded transition">
                  <Download size={18} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Table */}
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
                            <div className="w-5 h-5 bg-gray-300 rounded text-xs flex items-center justify-center">📷</div>
                            <div className="w-5 h-5 bg-gray-300 rounded text-xs flex items-center justify-center">📷</div>
                            <div className="w-5 h-5 bg-gray-300 rounded text-xs flex items-center justify-center">📷</div>
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
                              {complaint.assignedEmployee.charAt(0)}
                            </div>
                            <span className="text-gray-700">{complaint.assignedEmployee}</span>
                          </div>
                        ) : (
                          <span className="text-red-600 font-medium">not assigned</span>
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
                          onChange={(e) => handleAssignEmployee(complaint.id, e.target.value)}
                          defaultValue=""
                          className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <option value="">+ select employee</option>
                          {employeesList.map(emp => (
                            <option key={emp.id} value={emp.name}>{emp.name}</option>
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
                  <div className="text-center py-8 text-gray-500">
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
                        <p className="text-xs font-semibold text-gray-600">ID: {complaint.id}</p>
                        <p className="text-sm font-medium text-gray-800">Category: {complaint.category}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600">Ward: {complaint.ward}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600">Assigned:</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center text-xs text-white font-bold">
                            {complaint.assignedEmployee?.charAt(0)}
                          </div>
                          <span className="text-sm text-gray-800 font-medium">{complaint.assignedEmployee}</span>
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
                  <div className="text-center py-8 text-gray-500">
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
                        <p className="text-xs font-semibold text-gray-600">Ward: {complaint.ward}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600">Assigned:</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-6 h-6 bg-teal-400 rounded-full flex items-center justify-center text-xs text-white font-bold">
                            {complaint.assignedEmployee?.charAt(0)}
                          </div>
                          <span className="text-sm text-gray-800 font-medium">{complaint.assignedEmployee}</span>
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
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No resolved complaints</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Complaint Modal */}
      <ViewComplaintModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        complaint={selectedComplaint}
        onStatusUpdate={handleStatusUpdate}
        employees={employeesList}
      />
    </div>
  )
}
