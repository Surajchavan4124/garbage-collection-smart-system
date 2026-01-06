import { X } from 'lucide-react'

export default function ViewProfileModal({ isOpen, onClose, user, onEdit, onDelete }) {

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">View profile</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 bg-gray-50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left - Photo & Actions */}
            <div className="flex flex-col items-center lg:items-start gap-6">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                <span className="text-4xl">👤</span>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                              <button
                                  onClick={() => onEdit(user)}
                                  className="px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded hover:bg-teal-700"
                              >
                                  Edit
</button>
                <button 
  onClick={() => onDelete(user)}
  className="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded hover:bg-red-700"
>
  Delete Profile
</button>
              </div>
            </div>

            {/* Right - Profile Details */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">
                  USER PROFILE
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Name:</label>
                    <p className="text-gray-800 font-medium">{user?.name || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Email:</label>
                    <p className="text-gray-800 font-medium">{user?.email || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Contact:</label>
                    <p className="text-gray-800 font-medium">{user?.contact || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Password:</label>
                    <p className="text-gray-800 font-medium">••••••••</p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Role:</label>
                    <p className="text-gray-800 font-medium">{user?.role || 'N/A'}</p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Status:</label>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${user?.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <span className="text-sm font-medium text-gray-800">
                        {user?.status || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <label className="text-xs font-semibold text-gray-600 mb-3 block uppercase tracking-wide">
                  Preference:
                </label>
                <div className="flex gap-3 flex-wrap">
                  {['View', 'Edit', 'Delete'].map(pref => (
                    <div key={pref} className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-medium rounded-full border border-teal-300">
                      {pref}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
