import { X, AlertTriangle } from 'lucide-react'

export default function DeleteRouteModal({ isOpen, onClose, route, onConfirmDelete, loading }) {
  if (!isOpen || !route) return null

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
            <h2 className="text-lg font-bold text-gray-800">DELETE ROUTE</h2>
            <button
              onClick={onClose}
              disabled={loading}
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
              <h3 className="text-lg font-bold text-gray-800">Are you sure?</h3>
              <p className="text-gray-700 font-medium">
                Do you really want to delete this route? This process cannot be undone.
              </p>

              {/* Route Details */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3 text-left mt-6">
                <div>
                  <p className="text-xs font-semibold text-gray-600">Route Name:</p>
                  <p className="text-sm text-gray-800 font-bold">{route.routeName}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600">Route Code:</p>
                  <p className="text-sm text-gray-800 font-mono bg-white inline-block px-1 rounded border border-gray-200">
                    {route.routeCode}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Action Buttons */}
          <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-center bg-gray-50">
            <button
              onClick={onConfirmDelete}
              disabled={loading}
              className="px-8 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
            <button
              onClick={onClose}
              disabled={loading}
              className="px-8 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
