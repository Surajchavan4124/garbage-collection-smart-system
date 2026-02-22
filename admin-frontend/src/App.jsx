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
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />

      <Router>
        <ThemeWatcher />
        <Suspense fallback={<LoadingSpinner />}>
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
            <Route path="/route" element={<ProtectedRoute><RouteManagement /></ProtectedRoute>} />
            <Route path="/ward" element={<ProtectedRoute><WardManagement /></ProtectedRoute>} />
            <Route path="/waste-data" element={<ProtectedRoute><WasteDataManagement /></ProtectedRoute>} />
            <Route path="/edit-about-us" element={<ProtectedRoute><EditAboutUs /></ProtectedRoute>} />
            <Route path="/edit-guide" element={<ProtectedRoute><EditSegregationGuide /></ProtectedRoute>} />
            <Route path="/gallery" element={<ProtectedRoute><ManagePhotoGallery /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><ReportGenerationAnalytics /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><UserManagementSettings /></ProtectedRoute>} />
            <Route path="/profile-settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
            <Route path="/legal" element={<ProtectedRoute><LegalTransparency /></ProtectedRoute>} />

          </Routes>
        </Suspense>
      </Router>
    </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
