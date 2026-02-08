import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { toast } from 'react-toastify'

export const generatePDF = (report) => {
    try {
        const doc = new jsPDF()
        const reportType = report.title || report.reportType // Handle both structures if needed
        const apiResponse = report.data
        const reportData = apiResponse.data || apiResponse
        
        // Header
        doc.setFontSize(18)
        doc.text(reportType.toUpperCase(), 14, 22)
        doc.setFontSize(11)
        doc.text(`Generated: ${report.generatedAt || new Date().toLocaleString()}`, 14, 30)
        
        // Table content based on report type logic
        let head = []
        let body = []
        let finalY = 45 // Default start Y for table

        // Add Chart Image if present
        if (report.chartImage) {
            const imgProps = doc.getImageProperties(report.chartImage);
            const pdfWidth = doc.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            // Limit height to avoid taking full page if ratio is weird, or just use fixed height
            const imgHeight = Math.min(pdfHeight, 100); 
            
            doc.addImage(report.chartImage, 'PNG', 14, 40, 180, imgHeight);
            finalY = 40 + imgHeight + 10;
        }
    
        if (reportType === 'Waste Collection Summaries') {
            head = [['Ward', 'Bio (kg)', 'Recyclable (kg)', 'Non-Bio (kg)', 'Mixed (kg)', 'Total (kg)', 'Collections']]
            const rows = Array.isArray(reportData) ? reportData : (reportData.data || [])
            body = rows.map(item => [
                item._id,
                item.totalBiodegradable,
                item.totalRecyclable,
                item.totalNonBiodegradable,
                item.totalMixed,
                item.totalWaste,
                item.collectionCount
            ])
        }
        else if (reportType === 'Complaint & Grievance Resolution Times') {
            doc.text(`Avg Resolution Time: ${reportData.avgResolutionTimeHours} Hours`, 14, 40)
            
            head = [['Status', 'Count']]
            body = reportData.statusBreakdown.map(item => [item._id, item.count])
        }
        else if (reportType === 'Segregation Compliance Percentage') {
            head = [['Ward', 'Compliance (%)', 'Total Collections']]
            const list = Array.isArray(reportData) ? reportData : (reportData.data || [])
            body = list.map(item => [
                item.ward,
                item.compliancePercentage.toFixed(2) + '%',
                item.totalCollections
            ])
        }
        else if (reportType === 'Employee Attendance Summaries') {
            head = [['Status (Present/Absent)', 'Count']]
            const rows = Array.isArray(reportData) ? reportData : (reportData.data || [])
            body = rows.map(item => [
                item._id ? "Present" : "Absent",
                item.count
            ])
        }
        else if (reportType === 'Year-on-Year comparison charts') {
            const subType = reportData.subType || 'waste'
            const stats = reportData.stats || []
            
            if (subType === 'complaint') {
                head = [['Year', 'Total Complaints', 'Resolved Count', 'Resolution Rate (%)']]
                body = stats.map(item => [item.year, item.totalComplaints, item.resolvedCount, item.resolutionRate?.toFixed(2)])
            } else if (subType === 'attendance') {
                head = [['Year', 'Total Present Days']]
                body = stats.map(item => [item.year, item.totalPresent])
            } else if (subType === 'compliance') {
                head = [['Year', 'Avg Compliance (%)']]
                body = stats.map(item => [item.year, item.avgCompliance?.toFixed(2)])
            } else {
                head = [['Year', 'Total Waste (kg)', 'Avg Daily Waste (kg)']]
                body = stats.map(item => [item.year, item.totalWaste, item.avgDailyWaste])
            }
        }
    
        // Generate table
        if (head.length > 0) {
            autoTable(doc, {
                head: head,
                body: body,
                startY: finalY
            })
        }
    
        doc.save(`${reportType.replace(/\s+/g, '_')}_${Date.now()}.pdf`)
        toast.success("PDF Downloaded")
    } catch (error) {
        console.error("PDF Generation Error", error)
        toast.error("Failed to generate PDF")
    }
}

export const generateExcel = (report) => {
    try {
        let wsData = []
        const reportType = report.title || report.reportType
        const apiResponse = report.data
        const reportData = apiResponse.data || apiResponse
    
        if (reportType === 'Complaint & Grievance Resolution Times') {
             wsData = reportData.statusBreakdown
        } else if (reportType === 'Year-on-Year comparison charts') {
             wsData = reportData.stats || []
        } else {
             wsData = Array.isArray(reportData) ? reportData : (reportData.data || [])
        }
    
        const ws = XLSX.utils.json_to_sheet(wsData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Report")
        XLSX.writeFile(wb, `${reportType.replace(/\s+/g, '_')}_${Date.now()}.xlsx`)
        toast.success("Excel Downloaded")
    } catch (error) {
        console.error("Excel Generation Error", error)
        toast.error("Failed to generate Excel")
    }
}
