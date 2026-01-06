import { useState, useEffect } from 'react'
import { X, Edit2, Download, User } from 'lucide-react'

export default function EditEmployeeModal({ isOpen, onClose, employee }) {
  // Use a useEffect or direct initialization to ensure the form updates when a new employee is selected
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    contactNumber: '',
    address: '',
    joiningDate: '',
    passportPhoto: null,
    idProof: '',
    license: '',
    role: '',
    ward: '',
  })

  // Sync state with the selected employee whenever the modal opens or employee changes
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        employeeId: employee.id || '',
        contactNumber: employee.contact || '',
        address: employee.address || '',
        joiningDate: employee.joiningDate || '',
        passportPhoto: employee.photoUrl || null,
        idProof: employee.idProof || 'id.pdf',
        license: employee.license || 'license.pdf',
        role: employee.role || '',
        ward: employee.ward || '',
      })
    }
  }, [employee, isOpen])

  const [editingFields, setEditingFields] = useState({
    contactNumber: false,
    address: false,
    role: false,
    ward: false,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const toggleEditField = (fieldName) => {
    setEditingFields(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }))
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) setFormData(prev => ({ ...prev, passportPhoto: file.name }))
  }

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0]
    if (file) setFormData(prev => ({ ...prev, [fileType]: file.name }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Logic to save updated formData
    onClose()
  }

  if (!isOpen || !employee) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={onClose}></div>

      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 sticky top-0 bg-white">
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">Edit Employee Details</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-2 gap-12">
              {/* Left Column - Basic Info */}
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-6">Basic Information</h3>

                {/* Name - NO EDIT ICON */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name:</label>
                  <input
                    type="text"
                    value={formData.name}
                    disabled
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 text-sm cursor-not-allowed"
                  />
                </div>

                {/* Employee ID - NO EDIT ICON */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Employee ID:</label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    disabled
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 text-sm cursor-not-allowed"
                  />
                </div>

                {/* Contact Number - Editable */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      disabled={!editingFields.contactNumber}
                      className={`flex-1 px-4 py-2.5 border rounded-lg text-sm outline-none transition ${
                        editingFields.contactNumber ? 'border-[#1f9e9a] bg-white' : 'border-gray-300 bg-gray-50 cursor-not-allowed'
                      }`}
                    />
                    <button type="button" onClick={() => toggleEditField('contactNumber')} className="text-gray-600 hover:text-[#1f9e9a]">
                      <Edit2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Address - Editable */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address:</label>
                  <div className="flex gap-2">
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!editingFields.address}
                      rows="2"
                      className={`flex-1 px-4 py-2.5 border rounded-lg text-sm outline-none transition resize-none ${
                        editingFields.address ? 'border-[#1f9e9a] bg-white' : 'border-gray-300 bg-gray-50 cursor-not-allowed'
                      }`}
                    ></textarea>
                    <button type="button" onClick={() => toggleEditField('address')} className="text-gray-600 hover:text-[#1f9e9a] self-start mt-2">
                      <Edit2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Joining Date - NO EDIT ICON */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Joining Date:</label>
                  <input
                    type="text"
                    value={formData.joiningDate}
                    disabled
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 text-sm cursor-not-allowed"
                  />
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-6">Roles & Responsibilities</h3>
                {/* Role - Editable */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Assigned Role:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      disabled={!editingFields.role}
                      className={`flex-1 px-4 py-2.5 border rounded-lg text-sm outline-none transition ${
                        editingFields.role ? 'border-[#1f9e9a] bg-white' : 'border-gray-300 bg-gray-50 cursor-not-allowed'
                      }`}
                    />
                    <button type="button" onClick={() => toggleEditField('role')} className="text-gray-600 hover:text-[#1f9e9a]">
                      <Edit2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Ward - Editable */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Assigned Ward:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      name="ward"
                      value={formData.ward}
                      onChange={handleInputChange}
                      disabled={!editingFields.ward}
                      className={`flex-1 px-4 py-2.5 border rounded-lg text-sm outline-none transition ${
                        editingFields.ward ? 'border-[#1f9e9a] bg-white' : 'border-gray-300 bg-gray-50 cursor-not-allowed'
                      }`}
                    />
                    <button type="button" onClick={() => toggleEditField('ward')} className="text-gray-600 hover:text-[#1f9e9a]">
                      <Edit2 size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-6">Photo & Documents</h3>
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Employee Photo</label>
                  <label className="flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50">
                    <div className="flex flex-col items-center justify-center">
                      <User size={50} className="text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Click to upload photo</span>
                    </div>
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  </label>
                </div>

                {/* ID Proof - NO EDIT ICON */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">ID Proof</label>
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
                    <span className="text-gray-600 font-semibold">📄</span>
                    <span className="flex-1 text-sm text-gray-800">{formData.idProof}</span>
                    <button type="button" className="text-[#1f9e9a] hover:text-[#198a87]">
                      <Download size={18} />
                    </button>
                  </div>
                </div>

                {/* License - Editable only if Role is Driver */}
                {formData.role === 'Driver' && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">License (only for drivers)</label>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-3 flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
                        <span className="text-gray-600 font-semibold">📄</span>
                        <span className="flex-1 text-sm text-gray-800">{formData.license}</span>
                      </div>
                      <label className="cursor-pointer text-gray-600 hover:text-[#1f9e9a]">
                        <Edit2 size={18} />
                        <input type="file" onChange={(e) => handleFileChange(e, 'license')} className="hidden" />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 mt-10 pt-6 border-t border-gray-200 justify-end">
              <button type="submit" className="px-8 py-3 bg-[#1f9e9a] hover:bg-[#198a87] text-white font-bold rounded-lg transition">
                Update & Save
              </button>
              <button type="button" onClick={onClose} className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}