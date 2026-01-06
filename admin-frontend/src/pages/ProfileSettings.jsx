import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import TopHeader from '../components/TopHeader'
import { Edit2 } from 'lucide-react'
import DeactivateProfileModal from '../components/DeactivateProfileModal'

export default function ProfileSettings() {
  const [profile, setProfile] = useState({
    name: 'Aakash Singh',
    contact: 'xxxxxxxxxx',
    email: 'a@gmail.com',
    password: '••••••••',
    role: 'Admin',
    status: true,
    preferences: ['View', 'Edit', 'Delete'],
    notification: 'email/sms',
    theme: 'Dark',
  })

  const [isEditing, setIsEditing] = useState({})

  const handleEditToggle = (field) => {
    setIsEditing(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handlePreferenceChange = (pref) => {
    setProfile(prev => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter(p => p !== pref)
        : [...prev.preferences, pref],
    }))
  }

  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false)
  const handleDeleteProfile = () => {
  setIsDeactivateOpen(true)
}

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="ml-64 flex-1 flex flex-col overflow-hidden">
        <TopHeader />

        {/* Page Content */}
        <div className="mt-16 flex-1 overflow-y-auto p-6 bg-gray-100">
          <div className="mb-4 text-sm text-gray-600">
            <span>Analytics & Settings</span> &gt;{' '}
            <span>User Management & Settings</span> &gt;{' '}
            <span className="font-semibold text-gray-800">Profile Settings</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-700 mb-6">Your profile settings</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left: Form */}
            <div className="lg:col-span-3 bg-white rounded-lg shadow p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-800 bg-gray-200 px-4 py-3 rounded -m-6 mb-4">
                YOUR PROFILE
              </h2>

              {/* Name */}
              <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded border border-gray-200">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Name:</label>
                  {isEditing.name ? (
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      onBlur={() => handleEditToggle('name')}
                      className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      autoFocus
                    />
                  ) : (
                    <span className="text-sm text-gray-800">{profile.name}</span>
                  )}
                </div>
                <button
                  onClick={() => handleEditToggle('name')}
                  className="ml-4 p-2 text-gray-600 hover:text-gray-800"
                >
                  <Edit2 size={18} />
                </button>
              </div>

              {/* Contact */}
              <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded border border-gray-200">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Contact:</label>
                  {isEditing.contact ? (
                    <input
                      type="text"
                      value={profile.contact}
                      onChange={(e) => setProfile({ ...profile, contact: e.target.value })}
                      onBlur={() => handleEditToggle('contact')}
                      className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      autoFocus
                    />
                  ) : (
                    <span className="text-sm text-gray-800">{profile.contact}</span>
                  )}
                </div>
                <button
                  onClick={() => handleEditToggle('contact')}
                  className="ml-4 p-2 text-gray-600 hover:text-gray-800"
                >
                  <Edit2 size={18} />
                </button>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded border border-gray-200">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email:</label>
                  {isEditing.email ? (
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      onBlur={() => handleEditToggle('email')}
                      className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      autoFocus
                    />
                  ) : (
                    <span className="text-sm text-gray-800">{profile.email}</span>
                  )}
                </div>
                <button
                  onClick={() => handleEditToggle('email')}
                  className="ml-4 p-2 text-gray-600 hover:text-gray-800"
                >
                  <Edit2 size={18} />
                </button>
              </div>

              {/* Password */}
              <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded border border-gray-200">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Password:</label>
                  {isEditing.password ? (
                    <input
                      type="password"
                      value={profile.password}
                      onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                      onBlur={() => handleEditToggle('password')}
                      className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      autoFocus
                    />
                  ) : (
                    <span className="text-sm text-gray-800">{profile.password}</span>
                  )}
                </div>
                <button
                  onClick={() => handleEditToggle('password')}
                  className="ml-4 p-2 text-gray-600 hover:text-gray-800"
                >
                  <Edit2 size={18} />
                </button>
              </div>

              {/* Role */}
              <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded border border-gray-200">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Role:</label>
                  {isEditing.role ? (
                    <select
                      value={profile.role}
                      onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                      onBlur={() => handleEditToggle('role')}
                      className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      autoFocus
                    >
                      <option>Admin</option>
                      <option>Manager</option>
                      <option>Staff</option>
                      <option>Supervisor</option>
                    </select>
                  ) : (
                    <span className="text-sm text-gray-800">{profile.role}</span>
                  )}
                </div>
                <button
                  onClick={() => handleEditToggle('role')}
                  className="ml-4 p-2 text-gray-600 hover:text-gray-800"
                >
                  <Edit2 size={18} />
                </button>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded border border-gray-200">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Status:</label>
                  <div className="flex items-center gap-2">
                    <div
                      className={`relative w-12 h-6 rounded-full transition ${
                        profile.status ? 'bg-teal-500' : 'bg-gray-300'
                      }`}
                    >
                      <button
                        onClick={() => setProfile({ ...profile, status: !profile.status })}
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${
                          profile.status ? 'translate-x-6' : ''
                        }`}
                      />
                    </div>
                    <span className="text-sm text-gray-800">
                      {profile.status ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleEditToggle('status')}
                  className="ml-4 p-2 text-gray-600 hover:text-gray-800"
                >
                  <Edit2 size={18} />
                </button>
              </div>

              {/* Preference */}
              <div className="flex items-start justify-between bg-gray-50 px-4 py-3 rounded border border-gray-200">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-700 mb-2">Preference:</label>
                  <div className="flex gap-4">
                    {['View', 'Edit', 'Delete'].map((pref) => (
                      <label key={pref} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={profile.preferences.includes(pref)}
                          onChange={() => handlePreferenceChange(pref)}
                          className="w-4 h-4 accent-teal-500"
                        />
                        <span className="text-xs text-gray-700">{pref}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleEditToggle('preferences')}
                  className="ml-4 p-2 text-gray-600 hover:text-gray-800"
                >
                  <Edit2 size={18} />
                </button>
              </div>

              {/* Notification preferences */}
              <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded border border-gray-200">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Notification Preferences:
                  </label>
                  {isEditing.notification ? (
                    <select
                      value={profile.notification}
                      onChange={(e) =>
                        setProfile({ ...profile, notification: e.target.value })
                      }
                      onBlur={() => handleEditToggle('notification')}
                      className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      autoFocus
                    >
                      <option>email/sms</option>
                      <option>email only</option>
                      <option>sms only</option>
                      <option>none</option>
                    </select>
                  ) : (
                    <span className="text-sm text-gray-800">{profile.notification}</span>
                  )}
                </div>
                <button
                  onClick={() => handleEditToggle('notification')}
                  className="ml-4 p-2 text-gray-600 hover:text-gray-800"
                >
                  <Edit2 size={18} />
                </button>
              </div>

              {/* Theme */}
              <div className="flex items-start justify-between bg-gray-50 px-4 py-3 rounded border border-gray-200">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-700 mb-2">
                    Theme Settings:
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="theme"
                        checked={profile.theme === 'Dark'}
                        onChange={() => setProfile({ ...profile, theme: 'Dark' })}
                        className="w-4 h-4"
                      />
                      <span className="text-xs text-gray-700">Dark</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="theme"
                        checked={profile.theme === 'Light'}
                        onChange={() => setProfile({ ...profile, theme: 'Light' })}
                        className="w-4 h-4"
                      />
                      <span className="text-xs text-gray-700">Light</span>
                    </label>
                  </div>
                </div>
                <button
                  onClick={() => handleEditToggle('theme')}
                  className="ml-4 p-2 text-gray-600 hover:text-gray-800"
                >
                  <Edit2 size={18} />
                </button>
              </div>
            </div>

            {/* Right: Photo */}
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <label className="block text-xs font-bold text-gray-700 mb-3">Photo:</label>
              <div className="w-40 h-40 bg-white border-2 border-gray-400 rounded flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="w-10 h-10 bg-gray-700 rounded-full mx-auto mb-2" />
                  <div className="w-16 h-8 bg-gray-600 rounded mx-auto" />
                </div>
              </div>
              <button className="p-2 text-gray-600 hover:text-gray-800 mb-6">
                <Edit2 size={18} />
              </button>
            </div>
          </div>

          {/* Bottom buttons */}
          <div className="flex gap-3 mt-8 justify-end">
            <button
              onClick={handleDeleteProfile}
              className="px-6 py-2 bg-red-600 text-white rounded font-semibold text-sm hover:bg-red-700 transition"
            >
              Delete Your Profile
            </button>
            <button className="px-6 py-2 bg-teal-600 text-white rounded font-semibold text-sm hover:bg-teal-700 transition">
              Save changes
            </button>
          </div>
        </div>
      </div>
      <DeactivateProfileModal
  isOpen={isDeactivateOpen}
  onClose={() => setIsDeactivateOpen(false)}
  profile={profile}
/>
    </div>
  )
}
