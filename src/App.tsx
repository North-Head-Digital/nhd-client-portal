import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Login from './components/auth/Login'
import Dashboard from './components/dashboard/Dashboard'
import Projects from './components/projects/Projects'
import Messages from './components/messages/Messages'
import MessagesEnhanced from './components/messages/MessagesEnhanced'
import Profile from './components/profile/Profile'
import AdminDashboard from './components/admin/AdminDashboard'
import Layout from './components/layout/Layout'
import RoleBasedRedirect from './components/common/RoleBasedRedirect'
import ErrorBoundary from './components/common/ErrorBoundary'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ToastProvider } from './components/common/ToastContainer'

function App() {
  // Toggle between Messages and MessagesEnhanced by changing the route component
  const useEnhancedMessages = true // Set to true to use the enhanced version

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <Router basename="/portal/app">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute />}>
                <Route path="/" element={<Layout />}>
                  <Route index element={<RoleBasedRedirect />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="projects" element={<Projects />} />
                  <Route path="messages" element={useEnhancedMessages ? <MessagesEnhanced /> : <Messages />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="admin" element={<AdminDashboard />} />
                </Route>
              </Route>
            </Routes>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

function ProtectedRoute() {
  const { user, isLoading } = useAuth()

  // CRITICAL: Never trust localStorage alone - use AuthContext state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Only render protected routes if user is authenticated via backend verification
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

export default App
