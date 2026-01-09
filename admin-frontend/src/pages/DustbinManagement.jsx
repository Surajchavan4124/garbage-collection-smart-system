import { useState } from 'react'
import { Search, Filter, Download, Eye, Trash2, MapPin } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import TopHeader from '../components/TopHeader'
import ViewDustbinModal from '../components/ViewDustbinModal'
import EditDustbinModal from '../components/EditDustbinModal'
import DeleteDustbinConfirmModal from '../components/DeleteDustbinConfirmModal'
import { dustbinsData, mapPins } from '../data/dustbinMockData'

export default function DustbinManagement() {
  const [dustbins, setDustbins] = useState(dustbinsData)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    location: '',
    type: 'General',
    status: 'Good',
  })

  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedBin, setSelectedBin] = useState(null)

  // Filter dustbins based on search
  const filteredDustbins = dustbins.filter(
    (bin) =>
      bin.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bin.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // KPI calculations
  const kpis = {
    total: dustbins.length,
    good: dustbins.filter((b) => b.status === 'Good').length,
    damaged: dustbins.filter((b) => b.status === 'Damaged').length,
    needReplacement: dustbins.filter((b) => b.status === 'Need Replacement').length,
  }

  // Status badge styling
  const getStatusColor = (status) => {
    switch (status) {
      case 'Good':
        return 'bg-green-100 text-green-700 border border-green-300'
      case 'Damaged':
        return 'bg-orange-100 text-orange-700 border border-orange-300'
      case 'Need Replacement':
        return 'bg-red-100 text-red-700 border border-red-300'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  // Pin color for map
  const getPinColor = (status) => {
    switch (status) {
      case 'Good':
        return '#16a34a'
      case 'Damaged':
        return '#ea580c'
      case 'Need Replacement':
        return '#dc2626'
      default:
        return '#6b7280'
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveBin = (e) => {
    e.preventDefault()
    if (!formData.location.trim()) {
      alert('Please fill in location')
      return
    }

    const newBin = {
      id: 'B-0' + String(dustbins.length + 1),
      location: formData.location,
      type: formData.type,
      status: formData.status,
      fillLevel: 0,
      lastCleaned: new Date().toISOString().split('T')[0],
      gps: { lat: 15.3, lng: 73.8 },
    }

    setDustbins([...dustbins, newBin])
    setFormData({ location: '', type: 'General', status: 'Good' })
    alert('Bin added successfully!')
  }

  const handleViewBin = (bin) => {
    setSelectedBin(bin)
    setIsViewModalOpen(true)
  }

  const handleEditBin = () => {
    setIsViewModalOpen(false)
    setIsEditModalOpen(true)
  }

  const handleUpdateBin = (binId, updatedData) => {
    setDustbins(dustbins.map(bin =>
      bin.id === binId
        ? { ...bin, ...updatedData }
        : bin
    ))
    alert('Bin updated successfully!')
  }

  const handleDeleteBinClick = (bin) => {
    setSelectedBin(bin)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = (binId) => {
    setDustbins(dustbins.filter(b => b.id !== binId))
    alert('Bin deleted successfully!')
  }

  const handleDeleteFromViewModal = () => {
    setIsViewModalOpen(false)
    handleDeleteBinClick(selectedBin)
  }

  const handleDirectTableDelete = (bin) => {
    handleDeleteBinClick(bin)
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
            <span className="font-semibold text-gray-800">Dustbin Management</span>
          </div>

          {/* Main Container - 2 Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT COLUMN - TABLE & MAP (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* ===== DUSTBIN REGISTRY TABLE ===== */}
              <div className="bg-white rounded-lg shadow">
                {/* Title & Search Toolbar */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">DUSTBIN REGISTRY</h2>
                  
                  <div className="flex items-center gap-3">
                    <Search size={18} className="text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by Bin ID or location"
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
                        <th className="px-6 py-3 text-left text-xs font-bold">Bin ID</th>
                        <th className="px-6 py-3 text-left text-xs font-bold">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-bold">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-bold">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDustbins.map((bin, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-800">{bin.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{bin.location}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{bin.type}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(bin.status)}`}>
                              {bin.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 flex gap-2">
                            <button
                              onClick={() => handleViewBin(bin)}
                              className="p-2 text-blue-500 border border-blue-500 rounded hover:bg-blue-50 transition"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleDirectTableDelete(bin)}
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

              {/* ===== MAP VIEW ===== */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">MAP VIEW</h3>

                <div className="w-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg overflow-hidden" style={{ height: '300px' }}>
                  <svg viewBox="0 0 600 400" className="w-full h-full" style={{ background: '#e0e7ff' }}>
                    {/* Grid lines */}
                    <line x1="0" y1="100" x2="600" y2="100" stroke="#d1d5db" strokeWidth="2" />
                    <line x1="0" y1="200" x2="600" y2="200" stroke="#d1d5db" strokeWidth="2" />
                    <line x1="0" y1="300" x2="600" y2="300" stroke="#d1d5db" strokeWidth="2" />
                    <line x1="150" y1="0" x2="150" y2="400" stroke="#d1d5db" strokeWidth="2" />
                    <line x1="300" y1="0" x2="300" y2="400" stroke="#d1d5db" strokeWidth="2" />
                    <line x1="450" y1="0" x2="450" y2="400" stroke="#d1d5db" strokeWidth="2" />

                    {/* Blocks */}
                    <rect x="10" y="10" width="130" height="80" fill="#f3f4f6" stroke="#d1d5db" />
                    <rect x="160" y="10" width="130" height="80" fill="#f3f4f6" stroke="#d1d5db" />
                    <rect x="310" y="10" width="130" height="80" fill="#f3f4f6" stroke="#d1d5db" />
                    <rect x="460" y="10" width="130" height="80" fill="#f3f4f6" stroke="#d1d5db" />

                    <rect x="10" y="110" width="130" height="80" fill="#f3f4f6" stroke="#d1d5db" />
                    <rect x="160" y="110" width="130" height="80" fill="#f3f4f6" stroke="#d1d5db" />
                    <rect x="310" y="110" width="130" height="80" fill="#f3f4f6" stroke="#d1d5db" />
                    <rect x="460" y="110" width="130" height="80" fill="#f3f4f6" stroke="#d1d5db" />

                    <rect x="10" y="210" width="130" height="80" fill="#f3f4f6" stroke="#d1d5db" />
                    <rect x="160" y="210" width="130" height="80" fill="#f3f4f6" stroke="#d1d5db" />
                    <rect x="310" y="210" width="130" height="80" fill="#f3f4f6" stroke="#d1d5db" />
                    <rect x="460" y="210" width="130" height="80" fill="#f3f4f6" stroke="#d1d5db" />

                    {/* Compass */}
                    <text x="30" y="360" fontSize="16" fontWeight="bold" fill="#6b7280">N</text>
                    <line x1="40" y1="365" x2="40" y2="385" stroke="#6b7280" strokeWidth="2" />

                    {/* Pins */}
                    {mapPins.map((pin, idx) => {
                      const x = (idx % 3) * 150 + 75
                      const y = Math.floor(idx / 3) * 120 + 80
                      const color = getPinColor(pin.status)
                      return (
                        <g key={idx}>
                          <circle cx={x} cy={y} r="12" fill={color} stroke="white" strokeWidth="2" />
                          <path d={`M ${x} ${y + 12} L ${x - 8} ${y + 30} L ${x + 8} ${y + 30} Z`} fill={color} />
                        </g>
                      )
                    })}
                  </svg>
                </div>

                {/* Legend */}
                <div className="mt-4 flex justify-end gap-6 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Good</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700">Damaged</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700">Needs Replacement</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - FORM & SUMMARY (1/3 width) */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* ===== ADD BIN FORM ===== */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Add Bin</h3>

                <form onSubmit={handleSaveBin} className="space-y-4">
                  {/* Bin ID */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Bin ID</label>
                    <input
                      type="text"
                      value={`Auto Generated: B-0${dustbins.length + 1}`}
                      disabled
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded text-gray-600 text-xs"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Location</label>
                    <textarea
                      name="location"
                      placeholder="Enter location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs resize-none h-16"
                    ></textarea>
                  </div>

                  {/* GPS Picker */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">GPS picker</label>
                    <button
                      type="button"
                      className="w-full py-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 hover:bg-gray-100"
                    >
                      <MapPin size={28} />
                    </button>
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs"
                    >
                      <option value="General">General</option>
                      <option value="Recyclable">Recyclable</option>
                      <option value="Organic">Organic</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Status</label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="Good"
                        checked={formData.status === 'Good'}
                        onChange={handleInputChange}
                        className="w-4 h-4"
                      />
                      <span className="text-xs text-gray-700">Good</span>
                    </label>
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
                      onClick={() => setFormData({ location: '', type: 'General', status: 'Good' })}
                      className="flex-1 px-3 py-2 bg-red-500 text-white rounded font-semibold text-xs hover:bg-red-600 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>

              {/* ===== DUSTBIN SUMMARY ===== */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-800">DUSTBIN SUMMARY</h3>

                {/* Total Bins */}
                <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-700">Total Bins</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🗑</span>
                      <span className="text-2xl font-bold text-gray-800">{kpis.total}</span>
                    </div>
                  </div>
                </div>

                {/* Good */}
                <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-lg p-4 border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-700">Good</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">👍</span>
                      <span className="text-2xl font-bold text-gray-800">{kpis.good}</span>
                    </div>
                  </div>
                </div>

                {/* Damaged */}
                <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-lg p-4 border-l-4 border-red-500">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-700">Damaged</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">⚙️</span>
                      <span className="text-2xl font-bold text-gray-800">{kpis.damaged}</span>
                    </div>
                  </div>
                </div>

                {/* Needs Replacement */}
                <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-700">Needs</p>
                      <p className="text-xs font-semibold text-gray-700">Replacement</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🔄</span>
                      <span className="text-2xl font-bold text-gray-800">{kpis.needReplacement}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Dustbin Modal */}
      <ViewDustbinModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        dustbin={selectedBin}
        onEdit={handleEditBin}
        onDelete={handleDeleteFromViewModal}
      />

      {/* Edit Dustbin Modal */}
      <EditDustbinModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        dustbin={selectedBin}
        onUpdate={handleUpdateBin}
      />

      {/* Delete Confirmation Modal */}
      <DeleteDustbinConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        dustbin={selectedBin}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  )
}