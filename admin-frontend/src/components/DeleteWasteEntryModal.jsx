import { X, AlertTriangle } from 'lucide-react'

export default function DeleteWasteEntryModal({ isOpen, onClose, entry, onConfirmDelete, loading }) {
  if (!isOpen || !entry) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm transform transition-all scale-100">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-red-50 rounded-t-xl">
            <h2 className="text-lg font-bold text-red-700 flex items-center gap-2">
              <AlertTriangle size={20} />
              DELETE ENTRY
            </h2>
            <button
              onClick={onClose}
              disabled={loading}
              className="p-1 hover:bg-red-100 rounded-full transition text-gray-500 hover:text-red-700"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center space-y-3">
              <h3 className="text-lg font-bold text-gray-800">Confirm Deletion</h3>
              <p className="text-sm text-gray-600">
                Are you sure you want to delete this waste collection record? This action cannot be undone.
              </p>

              {/* Entry Details */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2 text-left mt-4 text-sm">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-600">Entry ID:</span>
                  <span className="font-mono text-gray-800 font-bold">{entry.entryId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-600">Date:</span>
                  <span className="text-gray-800">{new Date(entry.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-600">Ward:</span>
                  <span className="text-gray-800">{entry.ward}</span>
                </div>
                 <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                  <span className="font-bold text-gray-700">Total Waste:</span>
                  <span className="font-bold text-gray-900">{entry.total} kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Action Buttons */}
          <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={onConfirmDelete}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition shadow-md flex justify-center items-center"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
