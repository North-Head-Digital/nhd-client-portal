import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react'
import apiService from '../services/api'

interface User {
  id: number
  name: string
  email: string
  company: string
  role: string
  avatar?: string
  createdAt?: string
  lastLogin?: string
  phone?: string
  address?: string
  website?: string
  timezone?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: { name: string; email: string; password: string; company: string }) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { readonly children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing auth token and verify with API
    const token = localStorage.getItem('nhd_auth_token')
    if (token) {
      apiService.getCurrentUser()
        .then((response) => {
          setUser(response.user)
        })
        .catch((error) => {
          console.error('Token verification failed:', error)
          // Clear invalid token
          localStorage.removeItem('nhd_auth_token')
          localStorage.removeItem('nhd_user_data')
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      const response = await apiService.login(email, password)
      
      setUser(response.user)
      localStorage.setItem('nhd_auth_token', response.token)
      localStorage.setItem('nhd_user_data', JSON.stringify(response.user))
      
      setIsLoading(false)
      return true
    } catch (error) {
      console.error('Login failed:', error)
      setIsLoading(false)
      return false
    }
  }

  const register = async (userData: { name: string; email: string; password: string; company: string }): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      const response = await apiService.register(userData)
      
      setUser(response.user)
      localStorage.setItem('nhd_auth_token', response.token)
      localStorage.setItem('nhd_user_data', JSON.stringify(response.user))
      
      setIsLoading(false)
      return true
    } catch (error) {
      console.error('Registration failed:', error)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('nhd_auth_token')
    localStorage.removeItem('nhd_user_data')
    // Redirect to main website
    window.location.href = '/'
  }

  const contextValue = useMemo(() => ({
    user,
    login,
    register,
    logout,
    isLoading
  }), [user, isLoading])

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
