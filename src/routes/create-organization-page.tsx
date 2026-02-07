import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getActiveMembershipsForCurrentUser } from '../lib/org-queries'
import { setCurrentOrgId } from '../lib/org-session'
import { supabase } from '../lib/supabase'

const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$/
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? 'https://gdjgxezhibexyjraeudz.supabase.co'
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'sb_publishable_delZJu2iheVAeUrf0byzjg_8Hg251h0'

type CreateOrgPayload = {
  name: string
  slug: string
}

type HttpError = Error & {
  status?: number
  body?: { error?: string; message?: string }
}

function randomSlugSuffix(length = 3): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('')
}

function normalizeSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function ensureSlugLength(slug: string): string {
  let next = slug

  if (next.length > 64) {
    next = next.slice(0, 64).replace(/-+$/g, '')
  }

  if (next.length < 3) {
    next = normalizeSlug(`${next || 'org'}-${randomSlugSuffix(3)}`)
  }

  if (next.length > 64) {
    next = next.slice(0, 64).replace(/-+$/g, '')
  }

  if (next.length < 3) {
    next = `org-${randomSlugSuffix(3)}`
  }

  return next
}

function buildValidSlug(rawSlug: string, name: string): string {
  let slug = normalizeSlug(rawSlug)

  if (!slug) {
    slug = normalizeSlug(name)
  }

  slug = ensureSlugLength(slug)

  if (!SLUG_REGEX.test(slug)) {
    slug = `org-${randomSlugSuffix(3)}`
  }

  return slug
}

async function formatCreateOrgError(error: unknown): Promise<string> {
  const err = error as HttpError & {
    message?: string
    status?: number
    context?: { status?: number; json?: () => Promise<{ error?: string; message?: string }> }
  }

  const status = err.status ?? err.context?.status
  let message = err.body?.error || err.body?.message || err.message || 'Unable to create organization.'

  if (!err.body && err.context?.json) {
    try {
      const body = await err.context.json()
      message = body.error || body.message || message
    } catch {
      // Keep default message.
    }
  }

  if (status === 400) return `400 Bad Request: ${message}`
  if (status === 401) return `401 Unauthorized: ${message}`
  if (status === 409) return `409 Conflict: ${message}`
  return message
}

async function getAccessToken(forceRefresh = false): Promise<string> {
  const sessionResult = forceRefresh
    ? await supabase.auth.refreshSession()
    : await supabase.auth.getSession()

  const accessToken = sessionResult.data.session?.access_token
  if (!accessToken) {
    throw new Error('Your session is no longer valid. Please sign in again.')
  }

  return accessToken
}

async function invokeCreateOrgHttp(payload: CreateOrgPayload, accessToken: string) {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/create_org`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify(payload)
  })

  if (response.ok) {
    return
  }

  let body: { error?: string; message?: string } | undefined
  try {
    body = (await response.json()) as { error?: string; message?: string }
  } catch {
    body = undefined
  }

  const error = new Error(body?.error || body?.message || 'Unable to create organization.') as HttpError
  error.status = response.status
  error.body = body
  throw error
}

async function invokeCreateOrgWithRetry(payload: CreateOrgPayload) {
  const token = await getAccessToken(false)

  try {
    await invokeCreateOrgHttp(payload, token)
  } catch (error) {
    const err = error as HttpError
    const status = err.status
    const message = (err.message || '').toLowerCase()
    const shouldRetry = status === 401 || message.includes('jwt')

    if (!shouldRetry) {
      throw error
    }

    const refreshedToken = await getAccessToken(true)
    await invokeCreateOrgHttp(payload, refreshedToken)
  }
}

export default function CreateOrganizationPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checkingMemberships, setCheckingMemberships] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const checkExistingMemberships = async () => {
      try {
        const memberships = await getActiveMembershipsForCurrentUser()
        if (cancelled) return

        if (memberships.length > 0) {
          setCurrentOrgId(memberships[0].organization_id)
          navigate('/app', { replace: true })
        }
      } catch (membershipError) {
        if (!cancelled) {
          setError(
            membershipError instanceof Error
              ? membershipError.message
              : 'Could not verify organization memberships.'
          )
        }
      } finally {
        if (!cancelled) {
          setCheckingMemberships(false)
        }
      }
    }

    checkExistingMemberships()
    return () => {
      cancelled = true
    }
  }, [navigate])

  useEffect(() => {
    if (slugTouched) return
    setSlug(normalizeSlug(name))
  }, [name, slugTouched])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const finalName = name.trim()
      if (!finalName) {
        setError('Organization name is required.')
        return
      }

      const finalSlug = buildValidSlug(slug, finalName)
      if (!SLUG_REGEX.test(finalSlug)) {
        setError('Slug must match: ^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$')
        return
      }

      setSlug(finalSlug)

      const payload: CreateOrgPayload = { name: finalName, slug: finalSlug }
      await invokeCreateOrgWithRetry(payload)

      const memberships = await getActiveMembershipsForCurrentUser()
      if (memberships.length === 0) {
        setError('Organization was created, but no active membership was found yet. Please refresh.')
        return
      }

      setCurrentOrgId(memberships[0].organization_id)
      navigate('/app', { replace: true })
    } catch (createOrgError) {
      setError(await formatCreateOrgError(createOrgError))
    } finally {
      setLoading(false)
    }
  }

  if (checkingMemberships) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-gray-600">Checking memberships...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Create Organization</h1>
        <p className="mt-1 text-sm text-gray-600">
          You need an organization before you can access the app.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="label" htmlFor="org-name">
              Organization Name
            </label>
            <input
              id="org-name"
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="org-slug">
              Slug (optional)
            </label>
            <input
              id="org-slug"
              type="text"
              className="input"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true)
                setSlug(normalizeSlug(e.target.value))
              }}
              onBlur={() => {
                setSlug((current) => buildValidSlug(current, name))
              }}
              placeholder="acme-inc"
              pattern="^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$"
            />
            <p className="mt-1 text-xs text-gray-500">
              Leave blank and it will be auto-generated from the organization name.
            </p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating...' : 'Create Organization'}
          </button>
        </form>
      </div>
    </div>
  )
}
