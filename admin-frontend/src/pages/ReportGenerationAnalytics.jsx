import { useState } from 'react'
import { FileText, Download, Calendar, BarChart3, TrendingUp, Users } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import TopHeader from '../components/TopHeader'
import GenerationOfReportModal from '../components/GenerationOfReportModal'

export default function ReportGenerationAnalytics() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [generatedReports, setGeneratedReports] = useState([])

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
      id: 4,
      title: 'Monthly Expense Reports',
      description: 'Track monthly expenses and budget allocations',
      icon: Calendar,
      color: 'bg-orange-100',
      borderColor: 'border-orange-300'
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

  const handleDownloadReport = (report) => {
    alert(`Downloading: ${report.title}\nGenerated: ${report.generatedAt}`)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="ml-64 flex-1 flex flex-col overflow-hidden">
        <TopHeader />

        <div className="mt-16 flex-1 overflow-y-auto p-6 bg-gray-100">
          
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
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">GENERATED REPORTS</h2>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100 border-b border-gray-300">
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
                            <button
                              onClick={() => handleDownloadReport(report)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded font-semibold text-sm hover:bg-teal-600 transition"
                            >
                              <Download size={16} />
                              Download
                            </button>
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
        onClose={() => {
          setIsModalOpen(false)
          if (selectedReport) {
            const newReport = {
              id: Math.random(),
              title: selectedReport.title,
              generatedAt: new Date().toLocaleString(),
              status: 'Ready for Download'
            }
            setGeneratedReports([newReport, ...generatedReports])
          }
        }}
        reportType={selectedReport?.title}
      />
    </div>
  )
}
