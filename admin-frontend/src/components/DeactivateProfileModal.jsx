// src/components/DeactivateProfileModal.jsx
import { X } from 'lucide-react'

export default function DeactivateProfileModal({ isOpen, onClose, profile }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      {/* Center Card */}
      <div className="w-full max-w-xl bg-[#e1e7ee] border border-gray-400 rounded-lg shadow-2xl">
        {/* Top strip "Delete your profile" is part of page, so modal starts at inner box */}

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-2 border-b border-gray-400 bg-[#d3dae4] rounded-t-lg">
          <span className="text-xs font-bold text-gray-800 tracking-wide">
            DEACTIVATE YOUR PROFILE
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-200"
          >
            <X size={16} className="text-gray-700" />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6 text-center">
          <p className="text-sm font-semibold text-gray-800 mb-2">Alert</p>
          <p className="text-xs text-gray-700 mb-6">
            Are you sure you want to deactivate the your User Profile?
          </p>

          {/* User card */}
          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="w-20 h-20 bg-white border border-gray-300 rounded flex items-center justify-center">
              <div className="w-10 h-10 bg-gray-400 rounded" />
            </div>
            <div className="text-xs text-gray-800 space-y-1">
              <p>
                <span className="font-semibold">Name: </span>
                {profile.name}
              </p>
              <p>
                <span className="font-semibold">User ID: </span>
                U01
              </p>
              <p>
                <span className="font-semibold">Role: </span>
                {profile.role}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-4 mb-3">
            <button
              className="px-6 py-2 bg-red-600 text-white text-xs font-semibold rounded hover:bg-red-700"
              onClick={() => {
                // put real deactivate logic here
                alert('Profile deactivated')
                onClose()
              }}
            >
              Deactivate
            </button>
            <button
              className="px-6 py-2 bg-gray-300 text-gray-800 text-xs font-semibold rounded hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>

          <p className="text-[11px] text-red-700 font-semibold">
            Note: This action is not reversible
          </p>
        </div>
      </div>
    </div>
  )
}
