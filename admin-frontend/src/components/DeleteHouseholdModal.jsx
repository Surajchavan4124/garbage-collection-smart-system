import { X, AlertTriangle } from 'lucide-react'

export default function DeleteHouseholdModal({ isOpen, onClose, household, onConfirmDelete }) {
  if (!isOpen || !household) return null

  const handleConfirmDelete = () => {
    onConfirmDelete()
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-red-50">
            <h2 className="text-lg font-bold text-gray-800">REMOVE HOUSEHOLD</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Alert Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle size={32} className="text-red-500" />
              </div>
            </div>

            {/* Alert Text */}
            <div className="text-center space-y-4">
              <h3 className="text-lg font-bold text-gray-800">Alert</h3>
              <p className="text-gray-700 font-medium">
                Are you sure you want to remove the following household?
              </p>

              {/* Household Details */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3 text-left mt-6">
                <div>
                  <p className="text-xs font-semibold text-gray-600">Household ID:</p>
                  <p className="text-sm text-gray-800 font-medium">{household.id}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600">Address:</p>
                  <p className="text-sm text-gray-800 font-medium">
                    {household.address || 'Navelim, Street 1234, landmark: xyz (GPS coordinates)'}
                  </p>
                </div>
              </div>

              {/* Warning Text */}
              <p className="text-xs font-semibold text-red-600 mt-4">
                Note: This action is not reversible
              </p>
            </div>
          </div>

          {/* Footer - Action Buttons */}
          <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-center bg-gray-50">
            <button
              onClick={handleConfirmDelete}
              className="px-8 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition"
            >
              Remove
            </button>
            <button
              onClick={onClose}
              className="px-8 py-2 bg-teal-500 text-white rounded-lg text-sm font-semibold hover:bg-teal-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
