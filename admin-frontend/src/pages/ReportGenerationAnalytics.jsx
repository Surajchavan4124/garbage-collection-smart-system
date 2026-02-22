import { useState, useRef, useEffect } from 'react'
import { FileText, Download, Calendar, BarChart3, TrendingUp, Users, Eye, ChevronDown, FileSpreadsheet, Trash2 } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import TopHeader from '../components/TopHeader'
import GenerationOfReportModal from '../components/GenerationOfReportModal'
import ViewReportModal from '../components/ViewReportModal'
import { generatePDF, generateExcel } from '../utils/reportGenerator'

export default function ReportGenerationAnalytics() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  
  // Initialize from localStorage
  const [generatedReports, setGeneratedReports] = useState(() => {
    const saved = localStorage.getItem('generatedReports')
    return saved ? JSON.parse(saved) : []
  })
  
  const [viewReport, setViewReport] = useState(null)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const resultsRef = useRef(null)

  // Save to localStorage whenever reports change
  useEffect(() => {
    localStorage.setItem('generatedReports', JSON.stringify(generatedReports))
  }, [generatedReports])

  // Scroll to results when a new report is added
  useEffect(() => {
    if (generatedReports.length > 0 && resultsRef.current) {
// ...
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [generatedReports])

  const reports = [
    {
      id: 1,
      title: 'Waste Collection Summaries',
      description: 'Generate detailed reports on waste collection activities and trends',
      icon: TrendingUp,
      color: 'bg-blue-100',
      borderColor: 'border-blue-300'
    },
    {
      id: 2,
      title: 'Complaint & Grievance Resolution Times',
      description: 'Analyze complaint handling and resolution timelines',
      icon: BarChart3,
      color: 'bg-green-100',
      borderColor: 'border-green-300'
    },
    {
      id: 3,
      title: 'Segregation Compliance Percentage',
      description: 'View segregation compliance metrics and percentages across wards',
      icon: FileText,
      color: 'bg-purple-100',
      borderColor: 'border-purple-300'
    },
    {
      id: 5,
      title: 'Employee Attendance Summaries',
      description: 'Generate employee attendance reports and statistics',
      icon: Users,
      color: 'bg-red-100',
      borderColor: 'border-red-300'
    },
    {
      id: 6,
      title: 'Year-on-Year comparison charts',
      description: 'Compare performance metrics across different years',
      icon: BarChart3,
      color: 'bg-indigo-100',
      borderColor: 'border-indigo-300'
    }
  ]

  const handleGenerateReport = (report) => {
    setSelectedReport(report)
    setIsModalOpen(true)
  }

  const [reportToDelete, setReportToDelete] = useState(null)

  const handleDeleteReport = (id) => {
    setReportToDelete(id)
  }

  const confirmDelete = () => {
    if (reportToDelete) {
        setGeneratedReports(prev => prev.filter(r => r.id !== reportToDelete))
        setReportToDelete(null)
    }
  }

  const handleDownloadReport = (report) => {
    alert(`Downloading: ${report.title}\nGenerated: ${report.generatedAt}`)
  }

  return (
    <div className="flex bg-mesh min-h-screen">
      <Sidebar />

      <div className="ml-64 flex-1 flex flex-col">
        <TopHeader />

        <div className="pt-20 flex-1 overflow-y-auto px-8 pb-10 animate-fade-in-up">
          
          <div className="mb-6 text-sm text-gray-600">
            <span>Analytics & Settings</span> &gt;{' '}
            <span className="font-semibold text-gray-800">Report Generation & Analytics</span>
          </div>

          <div className="space-y-8">
            
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">ON-DEMAND REPORT GENERATION</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((report) => {
                  const IconComponent = report.icon

                  return (
                    <div
                      key={report.id}
                      className={`${report.color} border-2 ${report.borderColor} rounded-lg p-8 text-center space-y-4 hover:shadow-lg transition`}
                    >
                      <div className="flex justify-center">
                        <IconComponent size={48} className="text-gray-700" />
                      </div>

                      <h2 className="text-lg font-bold text-gray-800">
                        {report.title}
                      </h2>

                      <p className="text-sm text-gray-700">
                        {report.description}
                      </p>

                      <button
                        onClick={() => handleGenerateReport(report)}
                        className="w-full px-6 py-2 rounded font-semibold text-white text-sm transition bg-teal-500 hover:bg-teal-600"
                      >
                        Generate Report
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            {generatedReports.length > 0 && (
              <div ref={resultsRef} className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">GENERATED REPORTS</h2>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ background: 'linear-gradient(135deg, #1f9e9a, #16847f)' }}>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Report Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Generated At</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Status</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-800">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generatedReports.map((report, idx) => (
                        <tr key={report.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 text-sm text-gray-800">
                            <div className="flex items-center gap-2">
                              <FileText size={18} className="text-blue-600" />
                              {report.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">{report.generatedAt}</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold border border-green-300">
                              {report.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2 relative">
                                {report.data && (
                                    <button
                                        onClick={() => setViewReport(report)}
                                        className="inline-flex items-center gap-1 px-3 py-2 bg-blue-500 text-white rounded font-semibold text-sm hover:bg-blue-600 transition"
                                        title="View Report"
                                    >
                                        <Eye size={16} />
                                        View
                                    </button>
                                )}
                                
                                <div className="relative">
                                    <button
                                        onClick={() => setActiveDropdown(activeDropdown === report.id ? null : report.id)}
                                        className="inline-flex items-center gap-1 px-3 py-2 bg-teal-500 text-white rounded font-semibold text-sm hover:bg-teal-600 transition"
                                    >
                                        <Download size={16} />
                                        Download
                                        <ChevronDown size={14} />
                                    </button>

                                    {activeDropdown === report.id && (
                                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                            <button
                                                onClick={() => {
                                                    generatePDF(report)
                                                    setActiveDropdown(null)
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                            >
                                                <FileText size={14} className="text-red-500" />
                                                PDF
                                            </button>
                                            <button
                                                onClick={() => {
                                                    generateExcel(report)
                                                    setActiveDropdown(null)
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                            >
                                                <FileSpreadsheet size={14} className="text-green-600" />
                                                Excel
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleDeleteReport(report.id)}
                                    className="inline-flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded font-semibold text-sm hover:bg-red-600 transition"
                                    title="Delete Report"
                                >
                                    <Trash2 size={16} />
                                    Delete
                                </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Filter Modal */}
      <GenerationOfReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reportType={selectedReport?.title}
        onReportGenerated={(data) => {
            const newReport = {
              id: Date.now(),
              title: selectedReport.title,
              generatedAt: new Date().toLocaleString(),
              status: 'Success',
              data: data // Store data if we want to view it later, or just metadata
            }
            setGeneratedReports([newReport, ...generatedReports])
            setViewReport(newReport) // Auto-open the viewer
        }}
      />

      {/* View Report Modal */}
      <ViewReportModal 
        isOpen={!!viewReport}
        onClose={() => setViewReport(null)}
        report={viewReport}
      />

      {/* Delete Confirmation Modal */}
      {reportToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm ml-64">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Confirm Deletion</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to delete this report? This action cannot be undone.</p>
                <div className="flex justify-end gap-3">
                    <button 
                        onClick={() => setReportToDelete(null)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-medium text-sm"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={confirmDelete}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-medium text-sm"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  )
}
