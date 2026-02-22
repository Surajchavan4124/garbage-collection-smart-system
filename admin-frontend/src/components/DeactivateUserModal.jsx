import { X } from 'lucide-react'

export default function DeactivateUserModal({ isOpen, onClose, user, onDeactivate }) {
  if (!isOpen) return null

  const handleDeactivate = () => {
    if (onDeactivate) {
      onDeactivate(user)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-[#e1e7ee] border border-gray-400 rounded-lg shadow-2xl w-full max-w-md">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#d3dae4] rounded-t-lg border-b border-gray-400">
          <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
            DEACTIVATE USER
          </span>
          <button 
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-300"
          >
            <X size={16} className="text-gray-700" />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          
          {/* Alert */}
          <div className="text-center mb-6">
            <p className="text-sm font-semibold text-gray-800 mb-2">Alert</p>
            <p className="text-xs text-gray-700">
              Are you sure you want to deactivate the following user?
            </p>
          </div>

          {/* User Info Card */}
          <div className="flex flex-col items-center gap-3 mb-8 p-4 bg-white border border-gray-300 rounded-lg">
            <div className="w-16 h-16 bg-gray-400 rounded flex items-center justify-center">
              <span className="text-sm">👤</span>
            </div>
            <div className="text-center text-xs text-gray-800 space-y-1">
              <p><span className="font-semibold">Name: </span>{user?.name}</p>
              <p><span className="font-semibold">User ID: </span>{user?._id?.slice(-6).toUpperCase()}</p>
              <p><span className="font-semibold">Role: </span>{user?.role}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-center mb-4">
            <button
              onClick={handleDeactivate}
              className="px-8 py-2 bg-red-600 text-white text-xs font-semibold rounded hover:bg-red-700 transition"
            >
              Deactivate
            </button>
            <button
              onClick={onClose}
              className="px-8 py-2 bg-gray-300 text-gray-800 text-xs font-semibold rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>

          {/* Warning */}
          <p className="text-[11px] text-red-700 font-semibold text-center">
            Note: This action is not reversible
          </p>
        </div>
      </div>
    </div>
  )
}
