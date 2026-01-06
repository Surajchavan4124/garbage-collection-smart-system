import { X, AlertTriangle } from 'lucide-react'

export default function DeleteDustbinConfirmModal({ isOpen, onClose, dustbin, onConfirmDelete }) {
  if (!isOpen || !dustbin) return null

  const handleConfirm = () => {
    onConfirmDelete(dustbin.id)
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
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">REMOVE BIN</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Alert Icon & Title */}
            <div className="flex flex-col items-center gap-3 mb-6">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle size={32} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Alert</h3>
            </div>

            {/* Message */}
            <p className="text-center text-gray-700 text-sm font-medium mb-6">
              Are you sure you want to remove the following bin?
            </p>

            {/* Bin Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs font-semibold text-gray-600">Bin ID:</span>
                  <span className="text-sm font-bold text-gray-800">{dustbin.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-semibold text-gray-600">Location:</span>
                  <span className="text-sm text-gray-700">{dustbin.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-semibold text-gray-600">Type:</span>
                  <span className="text-sm text-gray-700">{dustbin.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-semibold text-gray-600">Status:</span>
                  <span className="text-sm text-gray-700">{dustbin.status}</span>
                </div>
              </div>
            </div>

            {/* Warning Message */}
            <p className="text-center text-red-500 text-xs font-semibold mb-6">
              Note: This action is not reversible
            </p>
          </div>

          {/* Footer - Action Buttons */}
          <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-center">
            <button
              onClick={handleConfirm}
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
