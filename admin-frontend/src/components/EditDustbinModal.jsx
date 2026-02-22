import { X, Edit2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import api from '../api/axios'
// Removed mock import

export default function EditDustbinModal({ isOpen, onClose, dustbin, onUpdate }) {
  const [editData, setEditData] = useState({
    location: '',
    ward: '',
    type: 'General',
    status: 'Good',
  })

  const [wards, setWards] = useState([])

  useEffect(() => {
    const fetchWards = async () => {
      try {
        const res = await api.get('/wards')
        setWards(res.data)
      } catch (error) {
        console.error('Failed to fetch wards', error)
      }
    }
    fetchWards()
  }, [])

  useEffect(() => {
    if (dustbin) {
      setEditData({
        location: dustbin.locationText || dustbin.location || '',
        ward: dustbin.ward || '',
        type: dustbin.type || 'General',
        status: dustbin.status || 'Good',
      })
    }
  }, [dustbin])

  const [editingFields, setEditingFields] = useState({
    location: false,
    ward: false,
    type: false,
    status: false,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditData(prev => ({ ...prev, [name]: value }))
  }

  const toggleEditing = (field) => {
    setEditingFields(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handleSave = () => {
    onUpdate(dustbin._id, editData)
    onClose()
  }

  if (!isOpen || !dustbin) return null

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${dustbin.id}`

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">EDIT BIN DETAILS</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            
            {/* Bin ID - Read Only */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Bin ID:
              </label>
              <input
                type="text"
                value={dustbin.id}
                disabled
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded text-gray-700 text-sm font-medium"
              />
            </div>

            {/* QR Code - Read Only */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Bin QR Code:
              </label>
              <div className="flex justify-center p-4 bg-gray-50 border border-gray-300 rounded">
                <img
                  src={qrCodeUrl}
                  alt={`QR Code for ${dustbin.id}`}
                  className="w-48 h-48 object-contain"
                />
              </div>
            </div>

            {/* Location - Editable */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Location:
                </label>
                <button
                  onClick={() => toggleEditing('location')}
                  className="p-1 hover:bg-gray-100 rounded transition"
                >
                  <Edit2 size={16} className="text-gray-600" />
                </button>
              </div>
              <textarea
                name="location"
                value={editData.location}
                onChange={handleInputChange}
                disabled={!editingFields.location}
                className={`w-full px-4 py-2 rounded text-sm resize-none h-16 border transition ${
                  editingFields.location
                    ? 'border-teal-500 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500'
                    : 'bg-gray-50 border-gray-300 text-gray-700'
                }`}
              />
            </div>

            {/* Map View - Read Only */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Map:
              </label>
              <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-blue-100 rounded border border-gray-300 flex items-center justify-center">
                <svg viewBox="0 0 300 250" className="w-full h-full">
                  {/* Grid lines */}
                  <line x1="0" y1="50" x2="300" y2="50" stroke="#d1d5db" strokeWidth="1" />
                  <line x1="0" y1="100" x2="300" y2="100" stroke="#d1d5db" strokeWidth="1" />
                  <line x1="0" y1="150" x2="300" y2="150" stroke="#d1d5db" strokeWidth="1" />
                  <line x1="0" y1="200" x2="300" y2="200" stroke="#d1d5db" strokeWidth="1" />
                  <line x1="75" y1="0" x2="75" y2="250" stroke="#d1d5db" strokeWidth="1" />
                  <line x1="150" y1="0" x2="150" y2="250" stroke="#d1d5db" strokeWidth="1" />
                  <line x1="225" y1="0" x2="225" y2="250" stroke="#d1d5db" strokeWidth="1" />

                  {/* Block shapes */}
                  <rect x="5" y="5" width="65" height="40" fill="#f3f4f6" stroke="#d1d5db" />
                  <rect x="80" y="5" width="65" height="40" fill="#f3f4f6" stroke="#d1d5db" />
                  <rect x="155" y="5" width="65" height="40" fill="#f3f4f6" stroke="#d1d5db" />
                  <rect x="230" y="5" width="65" height="40" fill="#f3f4f6" stroke="#d1d5db" />

                  <rect x="5" y="55" width="65" height="40" fill="#f3f4f6" stroke="#d1d5db" />
                  <rect x="80" y="55" width="65" height="40" fill="#f3f4f6" stroke="#d1d5db" />
                  <rect x="155" y="55" width="65" height="40" fill="#f3f4f6" stroke="#d1d5db" />
                  <rect x="230" y="55" width="65" height="40" fill="#f3f4f6" stroke="#d1d5db" />

                  {/* Center pin */}
                  <circle cx="150" cy="125" r="8" fill="#333" stroke="white" strokeWidth="2" />
                  <path d="M 150 133 L 145 145 L 155 145 Z" fill="#333" />
                </svg>
              </div>
            </div>
            {/* Ward - Editable */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Ward:
                </label>
                <button
                  onClick={() => toggleEditing('ward')}
                  className="p-1 hover:bg-gray-100 rounded transition"
                >
                  <Edit2 size={16} className="text-gray-600" />
                </button>
              </div>
              <select
                name="ward"
                value={editData.ward}
                onChange={handleInputChange}
                disabled={!editingFields.ward}
                className={`w-full px-4 py-2 rounded text-sm border transition ${
                  editingFields.ward
                    ? 'border-teal-500 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500'
                    : 'bg-gray-50 border-gray-300 text-gray-700'
                }`}
              >
                <option value="">Select Ward</option>
                {wards.map(ward => (
                  <option key={ward._id} value={ward.name}>{ward.name}</option>
                ))}
              </select>
            </div>

            {/* Type - Editable */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Type:
                </label>
                <button
                  onClick={() => toggleEditing('type')}
                  className="p-1 hover:bg-gray-100 rounded transition"
                >
                  <Edit2 size={16} className="text-gray-600" />
                </button>
              </div>
              <div className="flex gap-2">
                <select
                  name="type"
                  value={editData.type}
                  onChange={handleInputChange}
                  disabled={!editingFields.type}
                  className={`flex-1 px-4 py-2 rounded text-sm border transition ${
                    editingFields.type
                      ? 'border-teal-500 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500'
                      : 'bg-gray-50 border-gray-300 text-gray-700'
                  }`}
                >
                  <option value="General">General</option>
                  <option value="Recyclable">Recyclable</option>
                  <option value="Organic">Organic</option>
                </select>
              </div>
            </div>

            {/* Status - Editable */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Status:
                </label>
                <button
                  onClick={() => toggleEditing('status')}
                  className="p-1 hover:bg-gray-100 rounded transition"
                >
                  <Edit2 size={16} className="text-gray-600" />
                </button>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="Good"
                    checked={editData.status === 'Good'}
                    onChange={handleInputChange}
                    disabled={!editingFields.status}
                    className="w-4 h-4"
                  />
                  <span className="text-xs text-gray-700">Good</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="Damaged"
                    checked={editData.status === 'Damaged'}
                    onChange={handleInputChange}
                    disabled={!editingFields.status}
                    className="w-4 h-4"
                  />
                  <span className="text-xs text-gray-700">Damaged</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value="Need Replacement"
                    checked={editData.status === 'Need Replacement'}
                    onChange={handleInputChange}
                    disabled={!editingFields.status}
                    className="w-4 h-4"
                  />
                  <span className="text-xs text-gray-700">Need Replacement</span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer - Action Buttons */}
          <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-teal-500 text-white rounded-lg text-sm font-semibold hover:bg-teal-600 transition"
            >
              Update & Save
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
