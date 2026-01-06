import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import EmployeeManagement from './pages/EmployeeManagement'
import AttendanceManagement from './pages/AttendanceManagement'
import DustbinManagement from './pages/DustbinManagement'
import HouseholdManagement from './pages/HouseholdManagement'
import ReportAndComplaintManagement from './pages/ReportAndComplaintManagement'
import WasteDataManagement from './pages/WasteDataManagement'
import EditAboutUs from './pages/EditAboutUs'
import EditSegregationGuide from './pages/EditSegregationGuide'
import ManagePhotoGallery from './pages/ManagePhotoGallery'
import ReportGenerationAnalytics from './pages/ReportGenerationAnalytics'
import UserManagementSettings from './pages/UserManagementSettings'
import ProfileSettings from './pages/ProfileSettings'
import LegalTransparency from './pages/LegalTransparency'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employee" element={<EmployeeManagement />} />
        <Route path="/attendance" element={<AttendanceManagement />} />
        <Route path="/dustbin" element={<DustbinManagement />} />
        <Route path="/household" element={<HouseholdManagement />} />
        <Route path="/report-complaint" element={<ReportAndComplaintManagement />} />
        <Route path="/waste-data" element={<WasteDataManagement />} />
        <Route path="/edit-about-us" element={<EditAboutUs />} />
        <Route path="/edit-guide" element={<EditSegregationGuide />} />
        <Route path="/gallery" element={<ManagePhotoGallery />} />
        <Route path="/reports" element={<ReportGenerationAnalytics />} />
        <Route path="/settings" element={<UserManagementSettings />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        <Route path="/legal" element={<LegalTransparency />} />
        
      </Routes>
    </Router>
  )
}

export default App
