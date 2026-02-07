import { useState, useEffect } from 'react'
import { Search, Filter, Download, BarChart3 } from 'lucide-react'
import { toast } from 'react-toastify'
import Sidebar from '../components/Sidebar'
import TopHeader from '../components/TopHeader'
import { wardOptions } from '../data/wasteDataMockData'
import api from '../api/axios'

export default function WasteDataManagement() {
  const [formData, setFormData] = useState({
    date: '',
    collectionType: 'Daily',
    ward: 'Ward 1',
    biodegradable: '',
    recyclable: '',
    nonBiodegradable: '',
    mixed: ''
  })

  const [wasteRecords, setWasteRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedWard, setSelectedWard] = useState('Ward 1')

  useEffect(() => {
    fetchWasteData()
  }, [])

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
    
    if (!formData.date || !formData.biodegradable || !formData.recyclable || 
        !formData.nonBiodegradable || !formData.mixed) {
      toast.error('Please fill in all waste metrics')
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

      await api.post('/waste-data', payload)
      fetchWasteData()
      
      setFormData({
        date: '',
        collectionType: 'Daily',
        ward: 'Ward 1',
        biodegradable: '',
        recyclable: '',
        nonBiodegradable: '',
        mixed: ''
      })
      toast.success('Waste entry saved successfully!')
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Failed to save entry')
    }
  }

  // Handle reset
  const handleReset = () => {
    setFormData({
      date: '',
      collectionType: 'Daily',
      ward: 'Ward 1',
      biodegradable: '',
      recyclable: '',
      nonBiodegradable: '',
      mixed: ''
    })
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
                    {wardOptions.map(ward => (
                      <option key={ward.id} value={ward.name}>{ward.name}</option>
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
                    className="flex-1 px-4 py-2 bg-teal-500 text-white rounded font-semibold text-sm hover:bg-teal-600 transition"
                  >
                    Save
                  </button>
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
                  {wardOptions.map(ward => (
                    <option key={ward.id} value={ward.name}>{ward.name}</option>
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
              <h2 className="text-lg font-bold text-gray-800 mb-4">WASTE COLLECTION RECORDS</h2>
              
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
              <table className="w-full">
                <thead>
                  <tr className="bg-teal-500 text-white">
                    <th className="px-6 py-3 text-left text-xs font-bold">Entry ID</th>
                    <th className="px-6 py-3 text-left text-xs font-bold">Date Entered</th>
                    <th className="px-6 py-3 text-left text-xs font-bold">Ward</th>
                    <th className="px-6 py-3 text-left text-xs font-bold">Bio Degradable (kgs)</th>
                    <th className="px-6 py-3 text-left text-xs font-bold">Non Bio Degradable (kgs)</th>
                    <th className="px-6 py-3 text-left text-xs font-bold">Recyclable (kgs)</th>
                    <th className="px-6 py-3 text-left text-xs font-bold">Others (kgs)</th>
                    <th className="px-6 py-3 text-left text-xs font-bold">Total (kgs)</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">{record.entryId}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{new Date(record.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{record.ward}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{record.biodegradable}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{record.nonBiodegradable}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{record.recyclable}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{record.others}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">{record.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
