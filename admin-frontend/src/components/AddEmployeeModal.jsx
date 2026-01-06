import { useState } from 'react'
import { X, Upload, Calendar } from 'lucide-react'

export default function AddEmployeeModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    contactNumber: '',
    address: '',
    joiningDate: '',
    passportPhoto: null,
    idProof: null,
    license: null,
    role: 'Collector',
    ward: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({ ...prev, [fileType]: file }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form Data:', formData)
    // Reset form
    setFormData({
      name: '',
      employeeId: '',
      contactNumber: '',
      address: '',
      joiningDate: '',
      passportPhoto: null,
      idProof: null,
      license: null,
      role: 'Collector',
      ward: '',
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-40"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 sticky top-0 bg-white">
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">Add New Employee Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-2 gap-8">
              {/* Left Column - Basic Information */}
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-6">Basic Information</h3>

                {/* Name */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter the full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#1f9e9a] focus:ring-2 focus:ring-[#1f9e9a] focus:ring-opacity-20 text-sm"
                  />
                </div>

                {/* Employee ID */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Employee ID</label>
                  <input
                    type="text"
                    name="employeeId"
                    placeholder="Enter Employee ID"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#1f9e9a] focus:ring-2 focus:ring-[#1f9e9a] focus:ring-opacity-20 text-sm"
                  />
                </div>

                {/* Contact Number */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
                  <input
                    type="tel"
                    name="contactNumber"
                    placeholder="Enter Contact Number"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#1f9e9a] focus:ring-2 focus:ring-[#1f9e9a] focus:ring-opacity-20 text-sm"
                  />
                </div>

                {/* Address */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                  <textarea
                    name="address"
                    placeholder="Enter Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#1f9e9a] focus:ring-2 focus:ring-[#1f9e9a] focus:ring-opacity-20 text-sm resize-none"
                  ></textarea>
                </div>

                {/* Joining Date */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Joining Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="joiningDate"
                      value={formData.joiningDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#1f9e9a] focus:ring-2 focus:ring-[#1f9e9a] focus:ring-opacity-20 text-sm"
                    />
                    <Calendar size={18} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Roles & Responsibilities */}
                <div className="mt-8">
                  <h3 className="text-base font-bold text-gray-900 mb-6">Roles & Responsibilities</h3>

                  {/* Assign Role */}
                  <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Assign Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#1f9e9a] focus:ring-2 focus:ring-[#1f9e9a] focus:ring-opacity-20 text-sm bg-white"
                    >
                      <option>Collector</option>
                      <option>Driver</option>
                      <option>Sanitation Worker</option>
                      <option>Supervisor</option>
                    </select>
                  </div>

                  {/* Assign Ward */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Assign Ward</label>
                    <input
                      type="text"
                      name="ward"
                      placeholder="Select a ward"
                      value={formData.ward}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#1f9e9a] focus:ring-2 focus:ring-[#1f9e9a] focus:ring-opacity-20 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Photo & Documents */}
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-6">Photo & Documents</h3>

                {/* Passport Photo */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Upload Passport Size Photo</label>
                  <label className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#1f9e9a] hover:bg-gray-50 transition">
                    <div className="flex flex-col items-center justify-center">
                      {formData.passportPhoto ? (
                        <>
                          <span className="text-sm font-semibold text-gray-700">{formData.passportPhoto.name}</span>
                        </>
                      ) : (
                        <>
                          <div className="text-4xl text-gray-400 mb-2">📄</div>
                          <span className="text-sm text-gray-500">JPG</span>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'passportPhoto')}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Upload ID Proof */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Upload ID proof</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Upload ID proof"
                      readOnly
                      value={formData.idProof ? formData.idProof.name : ''}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#1f9e9a] focus:ring-2 focus:ring-[#1f9e9a] focus:ring-opacity-20 text-sm bg-gray-50"
                    />
                    <label className="cursor-pointer">
                      <Upload size={20} className="text-gray-600 hover:text-[#1f9e9a] transition" />
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, 'idProof')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* License (only for drivers) */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">License (only for drivers)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Upload License"
                      readOnly
                      value={formData.license ? formData.license.name : ''}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#1f9e9a] focus:ring-2 focus:ring-[#1f9e9a] focus:ring-opacity-20 text-sm bg-gray-50"
                    />
                    <label className="cursor-pointer">
                      <Upload size={20} className="text-gray-600 hover:text-[#1f9e9a] transition" />
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, 'license')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-10 pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="flex-1 bg-[#1f9e9a] hover:bg-[#198a87] text-white font-bold py-3 rounded-lg transition"
              >
                Add & Save
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
