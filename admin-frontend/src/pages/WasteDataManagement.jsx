import { useState, useEffect } from 'react'
import { Search, Filter, Download, BarChart3, Edit, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'
import Sidebar from '../components/Sidebar'
import TopHeader from '../components/TopHeader'
import api from '../api/axios'
// Removed mock import
import DeleteWasteEntryModal from '../components/DeleteWasteEntryModal'

export default function WasteDataManagement() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    collectionType: 'Daily',
    ward: '',
    biodegradable: '',
    recyclable: '',
    nonBiodegradable: '',
    mixed: ''
  })

  const [wasteRecords, setWasteRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedWard, setSelectedWard] = useState('')
  const [wards, setWards] = useState([])
  const [editingId, setEditingId] = useState(null)
  
  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  
  // Real-time View States
  const [viewMode, setViewMode] = useState('ward') // 'ward' or 'bin'
  const [allScans, setAllScans] = useState([])


  useEffect(() => {
    refreshData()
    const interval = setInterval(refreshData, 5000) // Poll every 5s
    return () => clearInterval(interval)
  }, [])

  const refreshData = () => {
    fetchWasteData()
    fetchAllScans()
    fetchWards()
  }

  const fetchWards = async () => {
    try {
      const res = await api.get('/wards')
      setWards(res.data)
      if (res.data.length > 0) {
        if (!selectedWard) setSelectedWard(res.data[0].name)
        if (!formData.ward) setFormData(prev => ({ ...prev, ward: res.data[0].name }))
      }
    } catch (error) {
      console.error("Failed to fetch wards", error)
    }
  }

  const fetchAllScans = async () => {
    try {
      const res = await api.get('/attendance/all-scans')
      setAllScans(res.data)
    } catch (error) {
      console.error("Failed to fetch all scans", error)
    }
  }


  const fetchWasteData = async () => {
    try {
      const res = await api.get('/waste-data')
      setWasteRecords(res.data)
    } catch (error) {
      console.error("Failed to fetch waste data", error)
      toast.error("Failed to fetch waste data")
    } finally {
      setLoading(false)
    }
  }

  // Filter records based on search
  const filteredRecords = wasteRecords.filter(record =>
    record.entryId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  // Handle form submission
  const handleSaveEntry = async (e) => {
    e.preventDefault()
    
    if (!formData.date || !formData.ward) {
      toast.error('Date and Ward are required')
      return
    }

    try {
      const payload = {
        date: formData.date,
        collectionType: formData.collectionType,
        ward: formData.ward,
        biodegradable: formData.biodegradable,
        recyclable: formData.recyclable,
        nonBiodegradable: formData.nonBiodegradable,
        mixed: formData.mixed
      }

      if (editingId) {
        await api.put(`/waste-data/${editingId}`, payload)
        toast.success('Waste entry updated successfully!')
      } else {
        await api.post('/waste-data', payload)
        toast.success('Waste entry saved successfully!')
      }
      
      fetchWasteData()
      handleReset()
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Failed to save entry')
    }
  }

  // Handle Edit Click
  const handleEdit = (record) => {
    setEditingId(record._id)
    setFormData({
      date: new Date(record.date).toISOString().split('T')[0],
      collectionType: record.collectionType,
      ward: record.ward,
      biodegradable: record.biodegradable,
      recyclable: record.recyclable,
      nonBiodegradable: record.nonBiodegradable,
      mixed: record.mixed
    })
    // Scroll to top to see form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle reset
  const handleReset = () => {
    setEditingId(null)
    setFormData({
      date: new Date().toISOString().split('T')[0],
      collectionType: 'Daily',
      ward: wards.length > 0 ? wards[0].name : '',
      biodegradable: '',
      recyclable: '',
      nonBiodegradable: '',
      mixed: ''
    })
  }

  // Handle Delete Click (Open Modal)
  const handleDeleteClick = (record) => {
    setEntryToDelete(record)
    setShowDeleteModal(true)
  }

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!entryToDelete) return

    setDeleteLoading(true)
    try {
      await api.delete(`/waste-data/${entryToDelete._id}`)
      toast.success("Record deleted successfully")
      fetchWasteData()
      setShowDeleteModal(false)
      setEntryToDelete(null)
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete record")
    } finally {
      setDeleteLoading(false)
    }
  }

  // Calculate chart data for selected ward
  const wardRecords = wasteRecords.filter(r => r.ward === selectedWard)
  const avgBiodegradable = wardRecords.length > 0 
    ? (wardRecords.reduce((sum, r) => sum + r.biodegradable, 0) / wardRecords.length).toFixed(0)
    : 0
  const avgNonBiodegradable = wardRecords.length > 0 
    ? (wardRecords.reduce((sum, r) => sum + r.nonBiodegradable, 0) / wardRecords.length).toFixed(0)
    : 0

  const maxValue = Math.max(avgBiodegradable, avgNonBiodegradable) || 100

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
            <span>Reports & Complaints</span> &gt; <span>Waste Data Management</span> &gt;{' '}
            <span className="font-semibold text-gray-800">Waste Collection Data Entry</span>
          </div>

          {/* TOP SECTION - Data Entry & Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            
            {/* LEFT CARD - WASTE COLLECTION DATA ENTRY */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-6">WASTE COLLECTION DATA ENTRY</h2>

              <form onSubmit={handleSaveEntry} className="space-y-4">
                {/* Date & Collection Type Row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Date */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Date:</label>
                    <div className="relative">
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* Collection Type */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Collection Type:</label>
                    <select
                      name="collectionType"
                      value={formData.collectionType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                    >
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                    </select>
                  </div>
                </div>

                {/* Ward */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Ward:</label>
                   <select
                    name="ward"
                    value={formData.ward}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  >
                    {wards.map(ward => (
                      <option key={ward._id} value={ward.name}>{ward.name}</option>
                    ))}
                  </select>
                </div>

                {/* Waste Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Biodegradable Waste */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Biodegradable Waste Collected:
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="biodegradable"
                        placeholder="0"
                        value={formData.biodegradable}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      />
                      <span className="absolute right-3 top-2 text-xs text-gray-600 font-semibold">kgs</span>
                    </div>
                  </div>

                  {/* Recyclable Waste */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Recyclable Waste:
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="recyclable"
                        placeholder="0"
                        value={formData.recyclable}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      />
                      <span className="absolute right-3 top-2 text-xs text-gray-600 font-semibold">kgs</span>
                    </div>
                  </div>

                  {/* Non-Biodegradable Waste */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Non-Biodegradable Waste Collected:
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="nonBiodegradable"
                        placeholder="0"
                        value={formData.nonBiodegradable}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      />
                      <span className="absolute right-3 top-2 text-xs text-gray-600 font-semibold">kgs</span>
                    </div>
                  </div>

                  {/* Mixed/Others */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Mixed/Others:
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="mixed"
                        placeholder="0"
                        value={formData.mixed}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                      />
                      <span className="absolute right-3 top-2 text-xs text-gray-600 font-semibold">kgs</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
            type="submit"
            className={`flex-1 py-3 px-4 ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-teal-600 hover:bg-teal-700'} text-white rounded font-bold shadow-md transition`}
          >
            {editingId ? 'Update Entry' : 'Save Entry'}
          </button>
          
          {editingId && (
             <button
              type="button"
              onClick={handleReset}
              className="px-4 py-3 bg-gray-500 text-white rounded font-bold hover:bg-gray-600 transition"
            >
              Cancel Edit
            </button>
          )}
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded font-semibold text-sm hover:bg-red-600 transition"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>

            {/* RIGHT CARD - DATA VISUALIZATION */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">DATA VISUALIZATION</h2>

              {/* Ward Selector */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-gray-700 mb-2">Select Ward:</label>
                 <select
                  value={selectedWard}
                  onChange={(e) => setSelectedWard(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                >
                  {wards.map(ward => (
                    <option key={ward._id} value={ward.name}>{ward.name}</option>
                  ))}
                </select>
              </div>

              {/* Bar Chart */}
              <div className="bg-cyan-50 rounded-lg p-8 min-h-64 flex flex-col items-center justify-center border border-cyan-200">
                {wardRecords.length > 0 ? (
                  <div className="w-full">
                    <div className="flex items-end justify-center gap-8 h-40 mb-6">
                      {/* Biodegradable Bar */}
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-end justify-center h-40">
                          <div
                            className="w-12 bg-teal-500 rounded-t"
                            style={{ height: `${(avgBiodegradable / maxValue) * 140}px` }}
                          ></div>
                        </div>
                        <p className="text-xs font-semibold text-gray-700">Bio</p>
                        <p className="text-sm font-bold text-gray-800">{avgBiodegradable} kgs</p>
                      </div>

                      {/* Non-Biodegradable Bar */}
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-end justify-center h-40">
                          <div
                            className="w-12 bg-gray-600 rounded-t"
                            style={{ height: `${(avgNonBiodegradable / maxValue) * 140}px` }}
                          ></div>
                        </div>
                        <p className="text-xs font-semibold text-gray-700">Non-Bio</p>
                        <p className="text-sm font-bold text-gray-800">{avgNonBiodegradable} kgs</p>
                      </div>
                    </div>
                    <p className="text-center text-sm font-semibold text-gray-700">
                      Bar Chart: Waste collected per ward (Bio vs Non-Bio)
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <BarChart3 size={48} className="text-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-gray-600">No data available for {selectedWard}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION - WASTE COLLECTION RECORDS TABLE */}
          <div className="bg-white rounded-lg shadow">
            {/* Title & Search Toolbar */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight">COLLECTION RECORDS</h2>
                <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                  <button 
                    onClick={() => setViewMode('ward')}
                    className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'ward' ? 'bg-teal-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
                  >
                    WARD WISE
                  </button>
                  <button 
                    onClick={() => setViewMode('bin')}
                    className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'bin' ? 'bg-teal-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
                  >
                    BIN WISE (LIVE)
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-3">

                <Search size={18} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Entry by ID"
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
              {viewMode === 'ward' ? (
                <table className="w-full">
                  <thead>
                    <tr className="bg-teal-500 text-white">
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase">Entry ID</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase">Date Entered</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase">Ward</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase">Bio Degradable (kgs)</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase">Non Bio (kgs)</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase">Recyclable (kgs)</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase">Others (kgs)</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase">Total (kgs)</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((record, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 text-sm font-bold text-teal-700">{record.entryId}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 font-medium">{new Date(record.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-800 font-bold">{record.ward}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{record.biodegradable}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{record.nonBiodegradable}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{record.recyclable}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{record.others}</td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">{record.total}</td>
                        <td className="px-6 py-4 flex gap-2">
                          <button 
                            onClick={() => handleEdit(record)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(record)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-800 text-white">
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase">Bin Code</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase">Ward</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase">Collector</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase">Weight (kgs)</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase">Scanned At</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allScans.map((scan, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">{scan.dustbin?.binCode || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-800 font-bold">{scan.dustbin?.ward || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 italic">{scan.dustbin?.locationText || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 font-medium">{scan.labour?.name || 'Unknown'}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                            scan.dustbin?.type === 'Organic' ? 'bg-green-100 text-green-700' :
                            scan.dustbin?.type === 'Recyclable' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {scan.dustbin?.type || 'Other'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-teal-600">{scan.estimatedWeight || 0}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(scan.scannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-center">
                           { (scan.action === 'collected' || (scan.estimatedWeight > 0 && !scan.action)) ? (
                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 border border-green-200 uppercase tracking-wider shadow-sm">
                               COLLECTED
                             </span>
                           ) : scan.action === 'issue' ? (
                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200 uppercase tracking-wider shadow-sm">
                               REPORTED
                             </span>
                           ) : (
                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200 uppercase tracking-wider shadow-sm">
                               SCANNED
                             </span>
                           )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteWasteEntryModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        entry={entryToDelete}
        onConfirmDelete={handleConfirmDelete}
        loading={deleteLoading}
      />
    </div>
  )
}
