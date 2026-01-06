import { X } from 'lucide-react'

export default function ViewHouseholdModal({ isOpen, onClose, household, onEdit, onDelete }) {
  if (!isOpen || !household) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">HOUSEHOLD DETAILS</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            
            {/* Household ID */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Household ID:
              </label>
              <input
                type="text"
                value={household.id}
                disabled
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded text-gray-700 text-sm font-medium"
              />
            </div>

            {/* Household Head Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Household Head Name:
              </label>
              <input
                type="text"
                value={household.headOfHousehold}
                disabled
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded text-gray-700 text-sm font-medium"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Address:
              </label>
              <textarea
                value={`Navelim, Street 1234, landmark: xyz (GPS coordinates)`}
                disabled
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded text-gray-700 text-sm resize-none h-20"
              />
            </div>

            {/* Assigned Ward */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Assigned Ward:
              </label>
              <input
                type="text"
                value={household.ward}
                disabled
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded text-gray-700 text-sm font-medium"
              />
            </div>

            {/* Contact */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Contact:
              </label>
              <input
                type="text"
                value={household.contact}
                disabled
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded text-gray-700 text-sm font-medium"
              />
            </div>

            {/* Segregation Compliance */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Segregation Compliance:
              </label>
              <input
                type="text"
                value={household.segregationCompliance}
                disabled
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded text-gray-700 text-sm font-medium"
              />
            </div>

            {/* Complaints */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Complaints:
              </label>
              <textarea
                value={household.complaints}
                disabled
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded text-gray-700 text-sm resize-none h-20"
              />
            </div>
          </div>

          {/* Footer - Action Buttons */}
          <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
            <button
              onClick={onEdit}
              className="px-6 py-2 bg-teal-500 text-white rounded-lg text-sm font-semibold hover:bg-teal-600 transition"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="px-6 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition"
            >
              Remove Household
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
