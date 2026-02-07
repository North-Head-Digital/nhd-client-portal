import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/authcontext'

export default function RoleBasedRedirect() {
  const { user } = useAuth()

  // Redirect admin users to admin dashboard, clients to regular dashboard
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />
  }

  // For non-admin users, redirect to dashboard
  return <Navigate to="/dashboard" replace />
}
