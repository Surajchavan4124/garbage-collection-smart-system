import { X, Edit2 } from 'lucide-react'
import { useState } from 'react'

export default function EditHouseholdModal({ isOpen, onClose, household, onUpdate }) {
  const [editData, setEditData] = useState({
    headOfHousehold: household?.headOfHousehold || '',
    contact: household?.contact || '',
    segregationCompliance: household?.segregationCompliance || 'Compliant',
    complaints: household?.complaints || '',
  })

  const [editingFields, setEditingFields] = useState({
    headOfHousehold: false,
    contact: false,
    segregationCompliance: false,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditData(prev => ({ ...prev, [name]: value }))
  }

  const toggleEditing = (field) => {
    setEditingFields(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handleSave = () => {
    onUpdate(household.id, editData)
    onClose()
  }

  if (!isOpen || !household) return null

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
            <h2 className="text-lg font-bold text-gray-800">HOUSEHOLD DETAILS</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            
            {/* Household ID - Read Only */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Household ID:
              </label>
              <input
                type="text"
                value={household.id}
                disabled
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded text-gray-700 text-sm font-medium"
              />
            </div>

            {/* Household Head Name - Editable */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Household Head Name:
                </label>
                <button
                  onClick={() => toggleEditing('headOfHousehold')}
                  className="p-1 hover:bg-gray-100 rounded transition"
                >
                  <Edit2 size={16} className="text-gray-600" />
                </button>
              </div>
              <input
                type="text"
                name="headOfHousehold"
                value={editData.headOfHousehold}
                onChange={handleInputChange}
                disabled={!editingFields.headOfHousehold}
                className={`w-full px-4 py-2 rounded text-sm border transition ${
                  editingFields.headOfHousehold
                    ? 'border-teal-500 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500'
                    : 'bg-gray-50 border-gray-300 text-gray-700'
                }`}
              />
            </div>

            {/* Address - Read Only */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Address:
              </label>
              <textarea
                value={`Navelim, Street 1234, landmark: xyz (GPS coordinates)`}
                disabled
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded text-gray-700 text-sm resize-none h-20"
              />
            </div>

            {/* Assigned Ward - Read Only */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Assigned Ward:
              </label>
              <input
                type="text"
                value={household.ward}
                disabled
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded text-gray-700 text-sm font-medium"
              />
            </div>

            {/* Contact - Editable */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Contact:
                </label>
                <button
                  onClick={() => toggleEditing('contact')}
                  className="p-1 hover:bg-gray-100 rounded transition"
                >
                  <Edit2 size={16} className="text-gray-600" />
                </button>
              </div>
              <input
                type="text"
                name="contact"
                value={editData.contact}
                onChange={handleInputChange}
                disabled={!editingFields.contact}
                className={`w-full px-4 py-2 rounded text-sm border transition ${
                  editingFields.contact
                    ? 'border-teal-500 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500'
                    : 'bg-gray-50 border-gray-300 text-gray-700'
                }`}
              />
            </div>

            {/* Segregation Compliance - Editable */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Segregation Compliance:
                </label>
                <button
                  onClick={() => toggleEditing('segregationCompliance')}
                  className="p-1 hover:bg-gray-100 rounded transition"
                >
                  <Edit2 size={16} className="text-gray-600" />
                </button>
              </div>
              <select
                name="segregationCompliance"
                value={editData.segregationCompliance}
                onChange={handleInputChange}
                disabled={!editingFields.segregationCompliance}
                className={`w-full px-4 py-2 rounded text-sm border transition ${
                  editingFields.segregationCompliance
                    ? 'border-teal-500 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500'
                    : 'bg-gray-50 border-gray-300 text-gray-700'
                }`}
              >
                <option value="Compliant">Compliant</option>
                <option value="Non-Compliant">Non-Compliant</option>
              </select>
            </div>

            {/* Complaints - Read Only */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Complaints:
              </label>
              <textarea
                value={editData.complaints}
                disabled
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded text-gray-700 text-sm resize-none h-20"
              />
            </div>
          </div>

          {/* Footer - Action Buttons */}
          <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-center">
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
