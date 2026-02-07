import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/authcontext'
import { Eye, EyeOff, Mail, Lock, Building2, Sparkles, ArrowRight, AlertCircle, X } from 'lucide-react'
import { ErrorMessage } from '../../utils/errormessages'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<ErrorMessage | null>(null)
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    const result = await login(email, password)
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error || null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-primary rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-brand"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-vibrant rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce-brand"></div>
      </div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-gradient-primary shadow-brand-lg hover-lift transition-all duration-300">
            <div className="relative">
              <Building2 className="h-8 w-8 text-white" />
              <Sparkles className="h-4 w-4 text-yellow-300 absolute -top-1 -right-1 animate-bounce" />
            </div>
          </div>
          <h1 className="mt-6 text-3xl font-bold text-gradient-brand">
            North Head Digital
          </h1>
          <p className="mt-2 text-gray-600 font-medium">
            Client Portal Access
          </p>
          <div className="mt-3 flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Secure • Private • Reliable</span>
          </div>
        </div>
        
        {/* Enhanced Form Container */}
        <div className="card p-8 shadow-brand-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="label text-gray-700 font-semibold">
                  Email address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="input pl-10 border-brand hover:border-primary-400 focus:border-primary-500 focus:ring-primary-200 transition-all duration-300"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="label text-gray-700 font-semibold">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="input pl-10 pr-10 border-brand hover:border-primary-400 focus:border-primary-500 focus:ring-primary-200 transition-all duration-300"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-primary-500 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className={`${
                error.type === 'error' 
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : error.type === 'warning' 
                    ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                    : 'bg-blue-50 border-blue-200 text-blue-800'
              } border px-4 py-3 rounded-lg text-sm animate-slide-in-up`}>
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{error.title}</h4>
                    <p className="mb-2">{error.message}</p>
                    {error.action && (
                      <p className="text-sm opacity-90">{error.action}</p>
                    )}
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full group relative overflow-hidden"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span>Sign in to Portal</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center space-y-3">
          <div className="text-sm text-gray-500">
            Having trouble accessing your account?
          </div>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  )
}
