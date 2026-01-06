import { useState } from 'react'
import { Search, Filter, Download, Eye, Trash2 } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import TopHeader from '../components/TopHeader'
import ViewHouseholdModal from '../components/ViewHouseholdModal'
import EditHouseholdModal from '../components/EditHouseholdModal'
import DeleteHouseholdModal from '../components/DeleteHouseholdModal'
import { householdsData, complianceMetrics, wardOptions } from '../data/householdMockData'

export default function HouseholdManagement() {
  const [households, setHouseholds] = useState(householdsData)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    address: '',
    wardAssigned: 'Ward 1',
    headName: '',
    contact: '',
  })

  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedHousehold, setSelectedHousehold] = useState(null)

  // Filter households based on search
  const filteredHouseholds = households.filter(
    (household) =>
      household.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      household.headOfHousehold.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Compliance percentage for pie chart
  const compliancePercentage = (complianceMetrics.totalHouseholds - complianceMetrics.nonCompliant) / complianceMetrics.totalHouseholds * 100
  const nonCompliancePercentage = 100 - compliancePercentage

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveHousehold = (e) => {
    e.preventDefault()
    if (!formData.address.trim() || !formData.headName.trim() || !formData.contact.trim()) {
      alert('Please fill in all fields')
      return
    }

    const newHousehold = {
      id: 'H-0' + String(households.length + 1),
      headOfHousehold: formData.headName,
      ward: formData.wardAssigned,
      contact: formData.contact,
      segregationCompliance: 'Compliant',
      address: formData.address,
      complaints: 'No complaints',
    }

    setHouseholds([...households, newHousehold])
    setFormData({ address: '', wardAssigned: 'Ward 1', headName: '', contact: '' })
    alert('Household added successfully!')
  }

  const handleViewHousehold = (household) => {
    setSelectedHousehold(household)
    setIsViewModalOpen(true)
  }

  const handleEditHousehold = () => {
    setIsViewModalOpen(false)
    setIsEditModalOpen(true)
  }

  const handleUpdateHousehold = (householdId, updatedData) => {
    setHouseholds(households.map(household =>
      household.id === householdId
        ? { ...household, ...updatedData }
        : household
    ))
    setSelectedHousehold(prev => ({ ...prev, ...updatedData }))
    alert('Household updated successfully!')
  }

  const handleOpenDeleteModal = (household) => {
    setSelectedHousehold(household)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteFromViewModal = () => {
    setIsViewModalOpen(false)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (selectedHousehold) {
      setHouseholds(households.filter(h => h.id !== selectedHousehold.id))
    }
  }

  const getComplianceColor = (compliance) => {
    return compliance === 'Compliant'
      ? 'bg-green-100 text-green-700 border border-green-300'
      : 'bg-red-100 text-red-700 border border-red-300'
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Fixed */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 flex-1 flex flex-col overflow-hidden">
        {/* Top Header - Fixed */}
        <TopHeader />

        {/* Page Content - Scrollable below header */}
        <div className="mt-16 flex-1 overflow-y-auto p-6 bg-gray-100">
          
          {/* Breadcrumbs */}
          <div className="mb-6 text-sm text-gray-600">
            <span>Main</span> &gt; <span>Operational Management Dashboard</span> &gt;{' '}
            <span className="font-semibold text-gray-800">Household Management</span>
          </div>

          {/* Main Container - 2 Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT COLUMN - TABLE & METRICS (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* ===== HOUSEHOLD REGISTRY TABLE ===== */}
              <div className="bg-white rounded-lg shadow">
                {/* Title & Search Toolbar */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">HOUSEHOLD REGISTRY</h2>
                  
                  <div className="flex items-center gap-3">
                    <Search size={18} className="text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search household by ID"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border-0 focus:outline-none text-sm"
                    />
                    <button className="p-2 hover:bg-gray-100 rounded transition">
                      <Filter size={18} className="text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded transition">
                      <Download size={18} className="text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-teal-500 text-white">
                        <th className="px-6 py-3 text-left text-xs font-bold">Household ID</th>
                        <th className="px-6 py-3 text-left text-xs font-bold">Head of Household</th>
                        <th className="px-6 py-3 text-left text-xs font-bold">Ward</th>
                        <th className="px-6 py-3 text-left text-xs font-bold">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-bold">Segregation Compliance</th>
                        <th className="px-6 py-3 text-left text-xs font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredHouseholds.map((household, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-800">{household.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{household.headOfHousehold}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{household.ward}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{household.contact}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getComplianceColor(household.segregationCompliance)}`}>
                              {household.segregationCompliance}
                            </span>
                          </td>
                          <td className="px-6 py-4 flex gap-2">
                            <button
                              onClick={() => handleViewHousehold(household)}
                              className="p-2 text-blue-500 border border-blue-500 rounded hover:bg-blue-50 transition"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleOpenDeleteModal(household)}
                              className="p-2 text-red-500 border border-red-500 rounded hover:bg-red-50 transition"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ===== COMPLIANCE METRICS ===== */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-800">COMPLIANCE METRICS</h2>
                
                {/* Quick Stats */}
                <p className="text-sm text-gray-600 font-medium">Quick stats summary:</p>
                <div className="grid grid-cols-3 gap-4">
                  {/* Total Households */}
                  <div className="bg-gray-100 rounded-lg p-4 border border-gray-300 text-center">
                    <p className="text-xs text-gray-600 font-semibold mb-2">Total Household Registered</p>
                    <p className="text-2xl font-bold text-gray-800">{complianceMetrics.totalHouseholds}</p>
                  </div>

                  {/* Complaints */}
                  <div className="bg-gray-100 rounded-lg p-4 border border-gray-300 text-center">
                    <p className="text-xs text-gray-600 font-semibold mb-2">Complaints</p>
                    <p className="text-2xl font-bold text-gray-800">{complianceMetrics.complaints}</p>
                  </div>

                  {/* Non-Compliant */}
                  <div className="bg-gray-100 rounded-lg p-4 border border-gray-300 text-center">
                    <p className="text-xs text-gray-600 font-semibold mb-2">Non-Compliant</p>
                    <p className="text-2xl font-bold text-gray-800">{complianceMetrics.nonCompliant}</p>
                  </div>
                </div>

                {/* Pie Chart */}
                <p className="text-sm text-gray-600 font-medium mt-4">Visuals:</p>
                <div className="bg-cyan-100 rounded-lg p-8 min-h-96 flex flex-col items-center justify-center">
                  <svg viewBox="0 0 200 200" className="w-56 h-56">
                    {/* Background circle */}
                    <circle cx="100" cy="100" r="80" fill="#f0f0f0" />
                    
                    {/* Compliance (large pie slice - teal) */}
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#2c5f5f"
                      strokeWidth="60"
                      strokeDasharray={`${(compliancePercentage / 100) * 502.65} 502.65`}
                      strokeDashoffset="0"
                      transform="rotate(-90 100 100)"
                    />
                    
                    {/* Non-Compliance (small pie slice - dark grey) */}
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#4a4a4a"
                      strokeWidth="60"
                      strokeDasharray={`${(nonCompliancePercentage / 100) * 502.65} 502.65`}
                      strokeDashoffset={`-${(compliancePercentage / 100) * 502.65}`}
                      transform="rotate(-90 100 100)"
                    />
                  </svg>
                  <h3 className="text-center font-bold text-gray-800 mt-4">
                    Pie Chart — Compliance vs Non-Compliance
                  </h3>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - ADD HOUSEHOLD FORM (1/3 width) */}
            <div className="lg:col-span-1">
              {/* ===== ADD HOUSEHOLD FORM ===== */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">ADD HOUSEHOLD</h3>

                <form onSubmit={handleSaveHousehold} className="space-y-4">
                  {/* Household ID */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Household ID
                    </label>
                    <input
                      type="text"
                      value={`Auto Generated: H-0${households.length + 1}`}
                      disabled
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded text-gray-600 text-xs"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      name="address"
                      placeholder="Enter address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs resize-none h-16"
                    ></textarea>
                  </div>

                  {/* Ward Assigned */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Ward Assigned
                    </label>
                    <select
                      name="wardAssigned"
                      value={formData.wardAssigned}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs"
                    >
                      {wardOptions.map(ward => (
                        <option key={ward.id} value={ward.name}>
                          {ward.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Name of the Head */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Name of the Head
                    </label>
                    <input
                      type="text"
                      name="headName"
                      placeholder="Enter name"
                      value={formData.headName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs"
                    />
                  </div>

                  {/* Contact */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Contact
                    </label>
                    <input
                      type="text"
                      name="contact"
                      placeholder="Enter contact number"
                      value={formData.contact}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 px-3 py-2 bg-teal-500 text-white rounded font-semibold text-xs hover:bg-teal-600 transition"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ address: '', wardAssigned: 'Ward 1', headName: '', contact: '' })}
                      className="flex-1 px-3 py-2 bg-red-500 text-white rounded font-semibold text-xs hover:bg-red-600 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Household Modal */}
      <ViewHouseholdModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        household={selectedHousehold}
        onEdit={handleEditHousehold}
        onDelete={handleDeleteFromViewModal}
      />

      {/* Edit Household Modal */}
      <EditHouseholdModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        household={selectedHousehold}
        onUpdate={handleUpdateHousehold}
      />

      {/* Delete Household Modal */}
      <DeleteHouseholdModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        household={selectedHousehold}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  )
}
