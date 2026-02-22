import { useState, useEffect } from 'react'
import { X, Upload } from 'lucide-react'
import { toast } from 'react-toastify'

export default function EditProfileModal({ isOpen, onClose, user, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    role: '',
    isActive: true,
    permissions: [],
    photo: null
  })
  const [errors, setErrors] = useState({})

  const validateField = (name, value) => {
    let error = ""
    switch (name) {
      case 'name':
        if (!value.trim()) error = "Name is required"
        break
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!value.trim()) error = "Email is required"
        else if (!emailRegex.test(value)) error = "Invalid email format"
        break
      case 'mobile':
        const mobileRegex = /^\d{10}$/
        if (!value.trim()) error = "Contact is required"
        else if (!mobileRegex.test(value)) error = "Must be 10 digits"
        break
      default:
        break
    }
    setErrors(prev => ({ ...prev, [name]: error }))
    return error
  }

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        role: user.role || 'ADMIN',
        isActive: user.isActive,
        permissions: user.permissions || []
      })
      setErrors({})
    }
  }, [user])

  const handleSave = () => {
    const e1 = validateField('name', formData.name)
    const e2 = validateField('email', formData.email)
    const e3 = validateField('mobile', formData.mobile)

    if (e1 || e2 || e3) {
      toast.error('Please fix error codes in the form')
      return
    }

    const updatedUser = {
      ...user,
      ...formData,
    }
    if (onSave) onSave(updatedUser)
  }

  const togglePermission = (perm) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm]
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
              
              {/* Photo Upload */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Profile Photo
                </label>
                <div 
                  onClick={() => document.getElementById('edit-user-photo').click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
                >
                   {formData.photo ? (
                     <div className="flex items-center gap-3">
                        <img 
                          src={formData.photo instanceof File ? URL.createObjectURL(formData.photo) : formData.photo} 
                          alt="preview" 
                          className="w-12 h-12 rounded-full object-cover border" 
                        />
                        <span className="text-xs text-gray-500">{formData.photo instanceof File ? formData.photo.name : 'Current Photo'}</span>
                     </div>
                   ) : (
                     <>
                        <Upload size={24} className="text-gray-400 mb-2" />
                        <span className="text-xs text-gray-500">Click to upload new photo (jpg/png)</span>
                     </>
                   )}
                </div>
                <input 
                  id="edit-user-photo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      setFormData({...formData, photo: file})
                    }
                  }}
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Name:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({...formData, name: e.target.value})
                    validateField('name', e.target.value)
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                />
                {errors.name && <p className="text-[10px] text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Email:</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({...formData, email: e.target.value})
                    validateField('email', e.target.value)
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                />
                {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email}</p>}
              </div>

              {/* Contact */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Contact:</label>
                <input
                  type="text"
                  value={formData.mobile}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                    setFormData({...formData, mobile: val})
                    validateField('mobile', val)
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm ${errors.mobile ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                />
                {errors.mobile && <p className="text-[10px] text-red-500 mt-1">{errors.mobile}</p>}
              </div>


              {/* Role */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Role:</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="MANAGER">Manager</option>
                  <option value="STAFF">Staff</option>
                  <option value="SUPERVISOR">Supervisor</option>
                  <option value="EMPLOYEE">Employee</option>
                </select>
              </div>

              {/* Status */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-gray-600">Status:</label>
                <div className="flex items-center gap-2">
                  <div className={`relative w-12 h-6 rounded-full transition cursor-pointer ${formData.isActive ? 'bg-green-500' : 'bg-gray-400'}`}>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${formData.isActive ? 'translate-x-6' : ''}`}
                    />
                  </div>
                  <span className="text-sm font-medium">{formData.isActive ? 'Active' : 'Inactive'}</span>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-3">Permission:</label>
                <div className="flex gap-3 flex-wrap">
                  {['View', 'Edit', 'Delete'].map(perm => (
                    <label key={perm} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(perm)}
                        onChange={() => togglePermission(perm)}
                        className="w-4 h-4 rounded accent-teal-500"
                      />
                      <span className="text-xs text-gray-700">{perm}</span>
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
