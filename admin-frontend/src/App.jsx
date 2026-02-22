import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { lazy, Suspense } from 'react'
import LoadingSpinner from './components/LoadingSpinner'
import { ThemeProvider } from './contexts/ThemeContext'

// Lazy load pages
const Login = lazy(() => import('./pages/Login'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const EmployeeManagement = lazy(() => import('./pages/EmployeeManagement'))
const AttendanceManagement = lazy(() => import('./pages/AttendanceManagement'))
const DustbinManagement = lazy(() => import('./pages/DustbinManagement'))
const HouseholdManagement = lazy(() => import('./pages/HouseholdManagement'))
const RouteManagement = lazy(() => import('./pages/RouteManagement'))
const WardManagement = lazy(() => import('./pages/WardManagement'))
const ReportAndComplaintManagement = lazy(() => import('./pages/ReportAndComplaintManagement'))
const WasteDataManagement = lazy(() => import('./pages/WasteDataManagement'))
const EditAboutUs = lazy(() => import('./pages/EditAboutUs'))
const EditSegregationGuide = lazy(() => import('./pages/EditSegregationGuide'))
const ManagePhotoGallery = lazy(() => import('./pages/ManagePhotoGallery'))
const ReportGenerationAnalytics = lazy(() => import('./pages/ReportGenerationAnalytics'))
const UserManagementSettings = lazy(() => import('./pages/UserManagementSettings'))
const ProfileSettings = lazy(() => import('./pages/ProfileSettings'))
const LegalTransparency = lazy(() => import('./pages/LegalTransparency'))

import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import { ThemeWatcher } from './contexts/ThemeContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
    },
  },
})

function App() {
  return (
    <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      {/* 🔔 Toasts available globally */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={3}
      />

      <Router>
        <ThemeWatcher />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>

            {/* PUBLIC */}
            <Route path="/" element={<Login />} />

            {/* PROTECTED - All wrapped in Layout and ProtectedRoute */}
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/employee" element={<EmployeeManagement />} />
              <Route path="/attendance" element={<AttendanceManagement />} />
              <Route path="/dustbin" element={<DustbinManagement />} />
              <Route path="/household" element={<HouseholdManagement />} />
              <Route path="/report-complaint" element={<ReportAndComplaintManagement />} />
              <Route path="/route" element={<RouteManagement />} />
              <Route path="/ward" element={<WardManagement />} />
              <Route path="/waste-data" element={<WasteDataManagement />} />
              <Route path="/edit-about-us" element={<EditAboutUs />} />
              <Route path="/edit-guide" element={<EditSegregationGuide />} />
              <Route path="/gallery" element={<ManagePhotoGallery />} />
              <Route path="/reports" element={<ReportGenerationAnalytics />} />
              <Route path="/settings" element={<UserManagementSettings />} />
              <Route path="/profile-settings" element={<ProfileSettings />} />
              <Route path="/legal" element={<LegalTransparency />} />
            </Route>

          </Routes>
        </Suspense>
      </Router>
    </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
