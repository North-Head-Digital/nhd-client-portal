import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import LoginPage from './routes/login-page'
import CreateOrganizationPage from './routes/create-organization-page'
import AppDashboardPage from './routes/app-dashboard-page'

interface AuthContextValue {
  session: Session | null
  loading: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      setLoading(false)
    }

    initializeAuth()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })

    return () => authListener.subscription.unsubscribe()
  }, [])

  const contextValue = useMemo(() => ({ session, loading }), [session, loading])
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-sm text-gray-600">Loading...</div>
    </div>
  )
}

function RequireAuth({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth()
  if (loading) return <LoadingScreen />
  return session ? <>{children}</> : <Navigate to="/login" replace />
}

function RequireGuest({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth()
  if (loading) return <LoadingScreen />
  return session ? <Navigate to="/app" replace /> : <>{children}</>
}

function RootRedirect() {
  const { session, loading } = useAuth()
  if (loading) return <LoadingScreen />
  return <Navigate to={session ? '/app' : '/login'} replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route
            path="/login"
            element={
              <RequireGuest>
                <LoginPage />
              </RequireGuest>
            }
          />
          <Route
            path="/create-organization"
            element={
              <RequireAuth>
                <CreateOrganizationPage />
              </RequireAuth>
            }
          />
          <Route
            path="/app"
            element={
              <RequireAuth>
                <AppDashboardPage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
