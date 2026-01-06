import { useState } from 'react'
import { X, MapPin, Phone, Calendar, FileText } from 'lucide-react'

export default function ViewComplaintModal({ isOpen, onClose, complaint, onStatusUpdate, employees }) {
  const [selectedStatus, setSelectedStatus] = useState(complaint?.status || 'Received')
  const [selectedEmployee, setSelectedEmployee] = useState(complaint?.assignedEmployee || '')
  const [resolutionTime, setResolutionTime] = useState('')

  if (!isOpen || !complaint) return null

  const handleUpdateStatus = () => {
    onStatusUpdate(complaint.id, {
      status: selectedStatus,
      assignedEmployee: selectedEmployee,
      resolutionTime: resolutionTime
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0">
          <h2 className="text-xl font-bold text-gray-800">COMPLAIN DETAILS</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT COLUMN - Basic Information */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Basic Information Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Basic Information</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">Complaint ID</label>
                      <input
                        type="text"
                        value={complaint.id}
                        disabled
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded text-gray-700 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">Date Submitted</label>
                      <input
                        type="text"
                        value={complaint.dateSubmitted}
                        disabled
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded text-gray-700 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Submitted By</label>
                    <input
                      type="text"
                      value={complaint.name}
                      disabled
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded text-gray-700 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Contact Number</label>
                    <input
                      type="text"
                      value="XXXXXXXXXX"
                      disabled
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded text-gray-700 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Category</label>
                    <input
                      type="text"
                      value={complaint.category}
                      disabled
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded text-gray-700 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Message</label>
                    <textarea
                      value="The wet waste collection bin in my ward is broken. Kindly replace it at the earliest."
                      disabled
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded text-gray-700 text-sm resize-none h-20"
                    />
                  </div>

                  {/* Images Section */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Images</label>
                    <div className="flex gap-3">
                      {complaint.photo && (
                        <>
                          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center border border-gray-300">
                            <span className="text-2xl">📷</span>
                          </div>
                          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center border border-gray-300">
                            <span className="text-2xl">📷</span>
                          </div>
                          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center border border-gray-300">
                            <span className="text-2xl">📷</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - Ward & Location & Status */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Ward & Location Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Ward & Location</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Ward</label>
                    <input
                      type="text"
                      value={complaint.ward}
                      disabled
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded text-gray-700 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Location</label>
                    <div className="w-full h-40 bg-gray-200 rounded border border-gray-300 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-4xl">📍</span>
                        <p className="text-xs text-gray-600 mt-2">Map will be displayed here</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assigned To & Status Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Assigned To & Status</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Assigned To</label>
                    <select
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Search a employee</option>
                      {employees && employees.map(emp => (
                        <option key={emp.id} value={emp.name}>{emp.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">Status</label>
                    <div className="space-y-2">
                      {['Received', 'In Progress', 'Resolved'].map((status) => (
                        <label key={status} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="status"
                            value={status}
                            checked={selectedStatus === status}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-4 h-4 text-teal-500"
                          />
                          <span className="text-sm text-gray-700">{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {selectedStatus === 'Resolved' && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2">Resolution Time</label>
                      <input
                        type="text"
                        placeholder="time taken from received to resolved"
                        value={resolutionTime}
                        onChange={(e) => setResolutionTime(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded font-semibold text-sm hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateStatus}
            className="px-6 py-2 bg-teal-500 text-white rounded font-semibold text-sm hover:bg-teal-600 transition"
          >
            Update & Save
          </button>
        </div>
      </div>
    </div>
  )
}
