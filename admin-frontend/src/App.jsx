import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <>
      {/* 🔔 Toasts available globally */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />

      <Router>
        <Routes>

          {/* PUBLIC */}
          <Route path="/" element={<Login />} />

          {/* PROTECTED */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/employee" element={<ProtectedRoute><EmployeeManagement /></ProtectedRoute>} />
          <Route path="/attendance" element={<ProtectedRoute><AttendanceManagement /></ProtectedRoute>} />
          <Route path="/dustbin" element={<ProtectedRoute><DustbinManagement /></ProtectedRoute>} />
          <Route path="/household" element={<ProtectedRoute><HouseholdManagement /></ProtectedRoute>} />
          <Route path="/report-complaint" element={<ProtectedRoute><ReportAndComplaintManagement /></ProtectedRoute>} />
          <Route path="/waste-data" element={<ProtectedRoute><WasteDataManagement /></ProtectedRoute>} />
          <Route path="/edit-about-us" element={<ProtectedRoute><EditAboutUs /></ProtectedRoute>} />
          <Route path="/edit-guide" element={<ProtectedRoute><EditSegregationGuide /></ProtectedRoute>} />
          <Route path="/gallery" element={<ProtectedRoute><ManagePhotoGallery /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><ReportGenerationAnalytics /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><UserManagementSettings /></ProtectedRoute>} />
          <Route path="/profile-settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
          <Route path="/legal" element={<ProtectedRoute><LegalTransparency /></ProtectedRoute>} />

        </Routes>
      </Router>
    </>
  )
}

export default App
