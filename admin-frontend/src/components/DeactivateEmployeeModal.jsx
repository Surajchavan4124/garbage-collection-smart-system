import { X, User } from 'lucide-react'

export default function DeactivateEmployeeModal({ isOpen, onClose, employee, onConfirm }) {
  if (!isOpen || !employee) return null

  const handleDeactivate = () => {
    console.log('Deactivate employee:', employee.id)
    onConfirm()
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-40"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-white">
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Deactivate Employee</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Alert Section */}
            <div className="text-center">
              <h3 className="text-base font-bold text-gray-900 mb-4">Alert</h3>
              <p className="text-sm text-gray-700 mb-8">
                Are you sure you want to deactivate the following employee?
              </p>

              {/* Employee Snapshot */}
              <div className="flex flex-col items-center gap-6 mb-8 py-6 px-6 bg-gray-50 rounded-lg">
                {/* Profile Image */}
                <div className="flex items-center justify-center w-24 h-24 bg-gray-200 rounded-lg">
                  <User size={50} className="text-gray-400" />
                </div>

                {/* Employee Details */}
                <div className="w-full space-y-3">
                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-1">Name:</p>
                    <p className="text-sm font-bold text-gray-900">{employee.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-1">Employee ID:</p>
                    <p className="text-sm font-bold text-gray-900">{employee.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold mb-1">Joining Date:</p>
                    <p className="text-sm font-bold text-gray-900">{employee.joiningDate}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-4">
                <button
                  onClick={handleDeactivate}
                  className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition"
                >
                  Deactivate
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-[#1f9e9a] hover:bg-[#198a87] text-white font-bold rounded-lg transition"
                >
                  Cancel
                </button>
              </div>

              {/* Warning Text */}
              <p className="text-xs font-bold text-red-500">
                Note: This action is not revertible
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
