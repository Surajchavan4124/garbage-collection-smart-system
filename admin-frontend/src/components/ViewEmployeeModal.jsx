import { X, Download, Image as ImageIcon } from 'lucide-react'

export default function ViewEmployeeModal({ isOpen, onClose, employee, onEdit, onDeactivate }) {
  if (!isOpen || !employee) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-40"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 sticky top-0 bg-white">
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">Employee Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <X size={24} />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-8">
            <div className="grid grid-cols-2 gap-8">
              {/* Left Column - Basic Information */}
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-6">Basic Information</h3>

                {/* Name */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name:</label>
                  <input
                    type="text"
                    value={employee.name}
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-800"
                  />
                </div>

                {/* Employee ID */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Employee ID:</label>
                  <input
                    type="text"
                    value={employee.id}
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-800"
                  />
                </div>

                {/* Contact Number */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number:</label>
                  <input
                    type="text"
                    value={employee.contact}
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-800"
                  />
                </div>

                {/* Address */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address:</label>
                  <textarea
                    value={employee.address}
                    readOnly
                    rows="3"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-800 resize-none"
                  ></textarea>
                </div>

                {/* Joining Date */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Joining Date:</label>
                  <input
                    type="text"
                    value={employee.joiningDate}
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-800"
                  />
                </div>

                {/* Roles & Responsibilities */}
                <div className="mt-8">
                  <h3 className="text-base font-bold text-gray-900 mb-6">Roles & Responsibilities</h3>

                  {/* Assigned Role */}
                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Assigned Role:</label>
                    <input
                      type="text"
                      value={employee.role}
                      readOnly
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-800"
                    />
                  </div>

                  {/* Assigned Ward */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Assigned Ward:</label>
                    <input
                      type="text"
                      value={employee.ward}
                      readOnly
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Photo & Documents */}
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-6">Photo & Documents</h3>

                {/* Employee Photo */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Employee Photo</label>
                  <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    {employee.photoUrl ? (
                      <img
                        src={employee.photoUrl}
                        alt="Employee"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <ImageIcon size={40} />
                        <span className="text-xs mt-2">No photo</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* ID Proof */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">ID Proof</label>
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
                    <span className="text-gray-600 font-semibold">📄</span>
                    <span className="flex-1 text-sm text-gray-800">{employee.idProof || 'id.pdf'}</span>
                    <button className="text-[#1f9e9a] hover:text-[#198a87] transition">
                      <Download size={18} />
                    </button>
                  </div>
                </div>

                {/* License (only for drivers) */}
                {employee.role === 'Driver' && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">License (only for drivers)</label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
                      <span className="text-gray-600 font-semibold">📄</span>
                      <span className="flex-1 text-sm text-gray-800">{employee.license || 'license.pdf'}</span>
                      <button className="text-[#1f9e9a] hover:text-[#198a87] transition">
                        <Download size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-10 pt-6 border-t border-gray-200 justify-end">
              <button
                onClick={onEdit}
                className="px-6 py-3 bg-[#1f9e9a] hover:bg-[#198a87] text-white font-bold rounded-lg transition"
              >
                Edit
              </button>
              <button
                onClick={onDeactivate}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition"
              >
                Deactivate Employee
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
