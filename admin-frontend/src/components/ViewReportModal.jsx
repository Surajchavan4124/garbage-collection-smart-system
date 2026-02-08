import { useRef } from 'react'
import { X, Download, FileSpreadsheet, ImageIcon } from 'lucide-react'
import { generatePDF, generateExcel } from '../utils/reportGenerator'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import html2canvas from 'html2canvas'
import { toast } from 'react-toastify'

export default function ViewReportModal({ isOpen, onClose, report }) {
  const chartRef = useRef(null)

  if (!isOpen || !report) return null

  const handleDownloadPDF = async () => {
    let chartImage = null
    if (chartRef.current) {
        try {
            await new Promise(resolve => setTimeout(resolve, 500)) // Wait for chart to stabilize
            const canvas = await html2canvas(chartRef.current, { 
                backgroundColor: '#ffffff',
                useCORS: true,
                scale: 2,
                logging: true
            })
            chartImage = canvas.toDataURL('image/png')
        } catch (error) {
            console.error("Error capturing chart", error)
            toast.error(`Chart Error: ${error.message}`)
        }
    }
    generatePDF({ ...report, chartImage })
  }

  const handleDownloadImage = async () => {
    if (!chartRef.current) return
    try {
        await new Promise(resolve => setTimeout(resolve, 500))
        const canvas = await html2canvas(chartRef.current, { 
            backgroundColor: '#ffffff',
            useCORS: true,
            scale: 2,
            logging: true
        })
        const image = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.href = image
        link.download = `${report.title.replace(/\s+/g, '_')}_Chart_${Date.now()}.png`
        link.click()
    } catch (error) {
        console.error("Error downloading chart image", error)
        toast.error(`Download Error: ${error.message}`)
    }
  }

  const getTableContent = () => {
    if (!report.data) return <p className="text-gray-500">No data available for this report.</p>

    const { reportType, data } = report.data // This destructuring might be wrong if report.data IS the data
    // Let's rely on report.title for type
    const type = report.title
    
    // Access data safely. 
    // If we passed `data` prop from modal as `status: 'Success', data: res.data`
    // Then `report.data` IS the `res.data` from controller.
    
    // Case 1: Waste Collection
    if (type === 'Waste Collection Summaries') {
        const rows = Array.isArray(data) ? data : (data.data || [])
        return (
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="border p-2 text-left text-sm">Ward</th>
                            <th className="border p-2 text-right text-sm">Bio (kg)</th>
                            <th className="border p-2 text-right text-sm">Recyclable (kg)</th>
                            <th className="border p-2 text-right text-sm">Non-Bio (kg)</th>
                            <th className="border p-2 text-right text-sm">Mixed (kg)</th>
                            <th className="border p-2 text-right text-sm">Total (kg)</th>
                            <th className="border p-2 text-center text-sm">Collections</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row._id}>
                                <td className="border p-2 text-sm font-medium">{row._id}</td>
                                <td className="border p-2 text-right text-sm">{row.totalBiodegradable}</td>
                                <td className="border p-2 text-right text-sm">{row.totalRecyclable}</td>
                                <td className="border p-2 text-right text-sm">{row.totalNonBiodegradable}</td>
                                <td className="border p-2 text-right text-sm">{row.totalMixed}</td>
                                <td className="border p-2 text-right text-sm font-bold">{row.totalWaste}</td>
                                <td className="border p-2 text-center text-sm">{row.collectionCount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }

    if (type === 'Complaint & Grievance Resolution Times') {
        // data already extracted from report.data
        const stats = data.statusBreakdown || []
        return (
            <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-bold text-blue-800">Average Resolution Time</h3>
                    <p className="text-2xl font-bold text-blue-600">{data.avgResolutionTimeHours} Hours</p>
                </div>
                <h4 className="font-bold text-gray-700">Status Breakdown</h4>
                <table className="w-full border-collapse border border-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="border p-2 text-left text-sm">Status</th>
                            <th className="border p-2 text-right text-sm">Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.map((row) => (
                            <tr key={row._id}>
                                <td className="border p-2 text-sm">{row._id}</td>
                                <td className="border p-2 text-right text-sm">{row.count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }

    if (type === 'Segregation Compliance Percentage') {
        const list = Array.isArray(data) ? data : (data.data || [])

        return (
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="border p-2 text-left text-sm">Ward</th>
                            <th className="border p-2 text-right text-sm">Compliance (%)</th>
                            <th className="border p-2 text-right text-sm">Total Collections</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((row) => (
                            <tr key={row.ward}>
                                <td className="border p-2 text-sm">{row.ward}</td>
                                <td className="border p-2 text-right text-sm font-bold text-teal-600">
                                    {row.compliancePercentage?.toFixed(2)}%
                                </td>
                                <td className="border p-2 text-right text-sm">{row.totalCollections}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }

    if (type === 'Employee Attendance Summaries') {
        const rows = Array.isArray(data) ? data : (data.data || [])
        // Controller returns [{ _id: true/false, count: N }]
        return (
            <table className="w-full border-collapse border border-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="border p-2 text-left text-sm">Status</th>
                        <th className="border p-2 text-right text-sm">Count</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={String(row._id)}>
                            <td className="border p-2 text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${row._id ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {row._id ? 'Present' : 'Absent'}
                                </span>
                            </td>
                            <td className="border p-2 text-right text-sm">{row.count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }

    if (type === 'Year-on-Year comparison charts') {
        const subType = data.subType || 'waste'
        const stats = data.stats || []

        let dataKey = "totalWaste"
        let label = "Total Waste (kg)"
        let color = "#0d9488" // teal-600

        if (subType === 'complaint') {
            dataKey = "totalComplaints"
            label = "Total Complaints"
            color = "#ef4444" // red-500
        } else if (subType === 'attendance') {
            dataKey = "totalPresent"
            label = "Total Present Days"
            color = "#f59e0b" // amber-500
        } else if (subType === 'compliance') {
            dataKey = "avgCompliance"
            label = "Avg Compliance %"
            color = "#8b5cf6" // violet-500
        }

        return (
            <div className="space-y-6">
                <div 
                    ref={chartRef}
                    className="h-64 w-full rounded-lg p-4"
                    style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={stats}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="year" stroke="#374151" tick={{ fill: '#374151' }} />
                            <YAxis stroke="#374151" tick={{ fill: '#374151' }} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', color: '#111827' }} 
                                itemStyle={{ color: '#111827' }}
                            />
                            <Legend wrapperStyle={{ color: '#374151' }} />
                            <Bar dataKey={dataKey} name={label} fill={color} isAnimationActive={false} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="border p-2 text-left text-sm">Year</th>
                                <th className="border p-2 text-right text-sm">{label}</th>
                                {subType === 'waste' && <th className="border p-2 text-right text-sm">Avg Daily (kg)</th>}
                                {subType === 'complaint' && <th className="border p-2 text-right text-sm">Resolved</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {stats.map((row) => (
                                <tr key={row.year}>
                                    <td className="border p-2 text-sm font-bold">{row.year}</td>
                                    <td className="border p-2 text-right text-sm font-semibold" style={{ color: color }}>
                                        {typeof row[dataKey] === 'number' && subType === 'compliance' 
                                            ? row[dataKey].toFixed(2) + '%' 
                                            : row[dataKey]}
                                    </td>
                                    {subType === 'waste' && (
                                        <td className="border p-2 text-right text-sm">{row.avgDailyWaste}</td>
                                    )}
                                    {subType === 'complaint' && (
                                        <td className="border p-2 text-right text-sm">{row.resolvedCount}</td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    return <p className="text-gray-500 italic">Preview not available for this report type.</p>
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{report.title}</h2>
            <p className="text-sm text-gray-500 mt-1">Generated: {report.generatedAt}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition"
          >
            <X size={28} className="text-gray-600" />
          </button>
        </div>

        <div className="mb-6">
            {getTableContent()}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            {report.title === 'Year-on-Year comparison charts' && (
                <button
                    onClick={handleDownloadImage}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded font-semibold text-sm hover:bg-purple-700 transition"
                >
                    <ImageIcon size={16} />
                    Download Graph
                </button>
            )}
            <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded font-semibold text-sm hover:bg-red-600 transition"
            >
                <Download size={16} />
                Download PDF
            </button>
            <button
                onClick={() => generateExcel(report)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded font-semibold text-sm hover:bg-green-700 transition"
            >
                <FileSpreadsheet size={16} />
                Download Excel
            </button>
            <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-500 text-white rounded font-semibold text-sm hover:bg-gray-600 transition"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  )
}
