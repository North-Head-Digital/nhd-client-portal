import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getActiveMembershipsForCurrentUser } from '../lib/org-queries'
import { clearCurrentOrgId, setCurrentOrgId } from '../lib/org-session'
import { supabase } from '../lib/supabase'

type AuthMode = 'signin' | 'signup'

export default function LoginPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<AuthMode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const bootstrapAfterAuth = async () => {
    const memberships = await getActiveMembershipsForCurrentUser()
    if (memberships.length === 0) {
      clearCurrentOrgId()
      navigate('/create-organization', { replace: true })
      return
    }

    setCurrentOrgId(memberships[0].organization_id)
    navigate('/app', { replace: true })
  }

  const handleSignIn = async () => {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    })

    if (signInError) {
      throw signInError
    }

    await bootstrapAfterAuth()
  }

  const handleSignUp = async () => {
    const trimmedEmail = email.trim()
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match.')
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: trimmedEmail,
      password
    })

    if (signUpError) {
      throw signUpError
    }

    if (data.session) {
      await bootstrapAfterAuth()
      return
    }

    setNotice('Account created. Check your email to confirm, then sign in.')
    setPassword('')
    setConfirmPassword('')
    setMode('signin')
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setNotice(null)

    try {
      if (mode === 'signin') {
        await handleSignIn()
        return
      }

      await handleSignUp()
    } catch (authError) {
      const fallbackMessage = mode === 'signin' ? 'Login failed.' : 'Could not create account.'
      setError(authError instanceof Error ? authError.message : fallbackMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Client Portal</h1>
        <p className="mt-1 text-sm text-gray-600">
          {mode === 'signin' ? 'Sign in to your client portal.' : 'Create a new portal account.'}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            className={mode === 'signin' ? 'btn-primary w-full' : 'btn-secondary w-full'}
            onClick={() => {
              setMode('signin')
              setError(null)
              setNotice(null)
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={mode === 'signup' ? 'btn-primary w-full' : 'btn-secondary w-full'}
            onClick={() => {
              setMode('signup')
              setError(null)
              setNotice(null)
            }}
          >
            Create Account
          </button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            />
          </div>

          {mode === 'signup' && (
            <div>
              <label className="label" htmlFor="confirm-password">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input"
                required
                autoComplete="new-password"
              />
            </div>
          )}

          {notice && <p className="text-sm text-emerald-700">{notice}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading
              ? mode === 'signin'
                ? 'Signing in...'
                : 'Creating account...'
              : mode === 'signin'
                ? 'Sign In'
                : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}
