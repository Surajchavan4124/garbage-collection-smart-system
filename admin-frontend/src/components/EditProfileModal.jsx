import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export default function EditProfileModal({ isOpen, onClose, user, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    password: '',
    role: 'Admin',
    status: true,
    preferences: []
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        contact: user.contact || '',
        password: '',
        role: user.role || 'Admin',
        status: user.status === 'Active',
        preferences: ['View', 'Edit', 'Delete']
      })
    }
  }, [user])

  const handleSave = () => {
    const updatedUser = {
      ...user,
      ...formData,
      status: formData.status ? 'Active' : 'Inactive'
    }
    if (onSave) onSave(updatedUser)
    onClose()
  }

  const togglePreference = (pref) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter(p => p !== pref)
        : [...prev.preferences, pref]
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">USER PROFILE</h2>
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
            
            {/* Left - Photo */}
            <div className="flex flex-col items-center gap-6">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                <span className="text-4xl">👤</span>
              </div>
              <div className="text-center text-sm text-gray-600">
                <p>Upload Photo</p>
              </div>
            </div>

            {/* Right - Form */}
            <div className="space-y-4">
              
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Name:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Email:</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>

              {/* Contact */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Contact:</label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Reset Password:</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Role:</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                >
                  <option>Admin</option>
                  <option>Manager</option>
                  <option>Staff</option>
                  <option>Supervisor</option>
                </select>
              </div>

              {/* Status */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-gray-600">Status:</label>
                <div className="flex items-center gap-2">
                  <div className={`relative w-12 h-6 rounded-full transition cursor-pointer ${formData.status ? 'bg-green-500' : 'bg-gray-400'}`}>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, status: !formData.status})}
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${formData.status ? 'translate-x-6' : ''}`}
                    />
                  </div>
                  <span className="text-sm font-medium">{formData.status ? 'Active' : 'Inactive'}</span>
                </div>
              </div>

              {/* Preferences */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-3">Preference:</label>
                <div className="flex gap-3 flex-wrap">
                  {['View', 'Edit', 'Delete'].map(pref => (
                    <label key={pref} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.preferences.includes(pref)}
                        onChange={() => togglePreference(pref)}
                        className="w-4 h-4 rounded accent-teal-500"
                      />
                      <span className="text-xs text-gray-700">{pref}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Buttons */}
          <div className="flex justify-end gap-3 mt-12 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-8 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700"
            >
              Update & Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
