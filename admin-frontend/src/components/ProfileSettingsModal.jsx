import { useState } from 'react'
import { X, Edit2 } from 'lucide-react'

export default function ProfileSettingsModal({ isOpen, onClose }) {
  const [isEditing, setIsEditing] = useState({})
  const [profile, setProfile] = useState({
    name: 'Aakash Singh',
    contact: 'xxxxxxxxxx',
    email: 'a@gmail.com',
    password: '••••••••',
    role: 'Admin',
    status: true,
    preferences: ['View', 'Edit', 'Delete'],
    notification: 'email/sms',
    theme: 'Dark'
  })

  const handleEditToggle = (field) => {
    setIsEditing(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handlePreferenceChange = (pref) => {
    setProfile(prev => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter(p => p !== pref)
        : [...prev.preferences, pref]
    }))
  }

  const handleDeleteProfile = () => {
    if (window.confirm('Are you sure you want to delete your profile?')) {
      alert('Profile deleted')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-800">Your Profile Settings</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Left Column - Form */}
          <div className="lg:col-span-3 space-y-4">
            {/* NAME */}
            <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded border border-gray-200">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-700 mb-1">Name:</label>
                {isEditing.name ? (
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                    onBlur={() => handleEditToggle('name')}
                  />
                ) : (
                  <span className="text-sm text-gray-800">{profile.name}</span>
                )}
              </div>
              <button onClick={() => handleEditToggle('name')} className="ml-4 p-2">
                <Edit2 size={18} />
              </button>
            </div>

            {/* CONTACT */}
            <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded border border-gray-200">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-700 mb-1">Contact:</label>
                {isEditing.contact ? (
                  <input
                    type="text"
                    value={profile.contact}
                    onChange={(e) => setProfile({...profile, contact: e.target.value})}
                    className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                    onBlur={() => handleEditToggle('contact')}
                  />
                ) : (
                  <span className="text-sm text-gray-800">{profile.contact}</span>
                )}
              </div>
              <button onClick={() => handleEditToggle('contact')} className="ml-4 p-2">
                <Edit2 size={18} />
              </button>
            </div>

            {/* EMAIL */}
            <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded border border-gray-200">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-700 mb-1">Email:</label>
                {isEditing.email ? (
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                    onBlur={() => handleEditToggle('email')}
                  />
                ) : (
                  <span className="text-sm text-gray-800">{profile.email}</span>
                )}
              </div>
              <button onClick={() => handleEditToggle('email')} className="ml-4 p-2">
                <Edit2 size={18} />
              </button>
            </div>

            {/* PASSWORD */}
            <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded border border-gray-200">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-700 mb-1">Password:</label>
                {isEditing.password ? (
                  <input
                    type="password"
                    value={profile.password}
                    onChange={(e) => setProfile({...profile, password: e.target.value})}
                    className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                    onBlur={() => handleEditToggle('password')}
                  />
                ) : (
                  <span className="text-sm text-gray-800">{profile.password}</span>
                )}
              </div>
              <button onClick={() => handleEditToggle('password')} className="ml-4 p-2">
                <Edit2 size={18} />
              </button>
            </div>

            {/* ROLE */}
            <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded border border-gray-200">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-700 mb-1">Role:</label>
                {isEditing.role ? (
                  <select
                    value={profile.role}
                    onChange={(e) => setProfile({...profile, role: e.target.value})}
                    className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                    onBlur={() => handleEditToggle('role')}
                  >
                    <option>Admin</option>
                    <option>Manager</option>
                    <option>Staff</option>
                  </select>
                ) : (
                  <span className="text-sm text-gray-800">{profile.role}</span>
                )}
              </div>
              <button onClick={() => handleEditToggle('role')} className="ml-4 p-2">
                <Edit2 size={18} />
              </button>
            </div>

            {/* STATUS */}
            <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded border border-gray-200">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-700 mb-1">Status:</label>
                <div className="flex items-center gap-2">
                  <div className={`relative w-12 h-6 rounded-full transition ${profile.status ? 'bg-teal-500' : 'bg-gray-300'}`}>
                    <button
                      onClick={() => setProfile({...profile, status: !profile.status})}
                      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${profile.status ? 'translate-x-6' : ''}`}
                    />
                  </div>
                  <span className="text-sm">{profile.status ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
              <button onClick={() => handleEditToggle('status')} className="ml-4 p-2">
                <Edit2 size={18} />
              </button>
            </div>

            {/* PREFERENCES */}
            <div className="flex items-start justify-between bg-gray-50 px-4 py-3 rounded border border-gray-200">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-700 mb-2">Preference:</label>
                <div className="flex gap-4">
                  {['View', 'Edit', 'Delete'].map(pref => (
                    <label key={pref} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.preferences.includes(pref)}
                        onChange={() => handlePreferenceChange(pref)}
                        className="w-4 h-4 accent-teal-500"
                      />
                      <span className="text-xs">{pref}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button onClick={() => handleEditToggle('preferences')} className="ml-4 p-2">
                <Edit2 size={18} />
              </button>
            </div>

            {/* NOTIFICATION */}
            <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded border border-gray-200">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-700 mb-1">Notifications:</label>
                {isEditing.notification ? (
                  <select
                    value={profile.notification}
                    onChange={(e) => setProfile({...profile, notification: e.target.value})}
                    className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                    onBlur={() => handleEditToggle('notification')}
                  >
                    <option>email/sms</option>
                    <option>email only</option>
                    <option>sms only</option>
                  </select>
                ) : (
                  <span className="text-sm">{profile.notification}</span>
                )}
              </div>
              <button onClick={() => handleEditToggle('notification')} className="ml-4 p-2">
                <Edit2 size={18} />
              </button>
            </div>

            {/* THEME */}
            <div className="flex items-start justify-between bg-gray-50 px-4 py-3 rounded border border-gray-200">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-700 mb-2">Theme:</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      checked={profile.theme === 'Dark'}
                      onChange={() => setProfile({...profile, theme: 'Dark'})}
                      className="w-4 h-4"
                    />
                    <span className="text-xs">Dark</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      checked={profile.theme === 'Light'}
                      onChange={() => setProfile({...profile, theme: 'Light'})}
                      className="w-4 h-4"
                    />
                    <span className="text-xs">Light</span>
                  </label>
                </div>
              </div>
              <button onClick={() => handleEditToggle('theme')} className="ml-4 p-2">
                <Edit2 size={18} />
              </button>
            </div>
          </div>

          {/* Right Column - Photo */}
          <div className="flex flex-col items-center">
            <label className="block text-xs font-bold text-gray-700 mb-3">Photo:</label>
            <div className="w-32 h-32 bg-white border-2 border-gray-400 rounded flex items-center justify-center mb-4">
              <div className="text-center">
                <div className="w-8 h-8 bg-gray-700 rounded-full mx-auto mb-2"></div>
                <div className="w-12 h-6 bg-gray-600 rounded mx-auto"></div>
              </div>
            </div>
            <button className="p-1 hover:bg-gray-100 rounded mb-3">
              <Edit2 size={16} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end border-t border-gray-200 px-6 py-4">
          <button
            onClick={handleDeleteProfile}
            className="px-6 py-2 bg-red-600 text-white rounded font-semibold text-sm hover:bg-red-700"
          >
            Delete Your Profile
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-teal-600 text-white rounded font-semibold text-sm hover:bg-teal-700"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  )
}
