import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ActiveMembership,
  OrganizationRecord,
  ProjectRecord,
  getActiveMembershipsForCurrentUser,
  getOrganizationsByIds,
  getProjectsByOrganizationId
} from '../lib/org-queries'
import { clearCurrentOrgId, getCurrentOrgId, setCurrentOrgId } from '../lib/org-session'
import { getSignedOrgFileUrl, listOrgFiles, OrgStorageFile, uploadOrgFile } from '../lib/storage-files'
import { supabase } from '../lib/supabase'

export default function AppDashboardPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [loading, setLoading] = useState(true)
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [loadingFiles, setLoadingFiles] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filesError, setFilesError] = useState<string | null>(null)

  const [memberships, setMemberships] = useState<ActiveMembership[]>([])
  const [organizations, setOrganizations] = useState<OrganizationRecord[]>([])
  const [currentOrgId, setCurrentOrgIdState] = useState<string | null>(null)
  const [projects, setProjects] = useState<ProjectRecord[]>([])
  const [files, setFiles] = useState<OrgStorageFile[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    let cancelled = false

    const loadInitialData = async () => {
      setLoading(true)
      setError(null)
      setFilesError(null)

      try {
        const activeMemberships = await getActiveMembershipsForCurrentUser()

        if (activeMemberships.length === 0) {
          clearCurrentOrgId()
          navigate('/create-organization', { replace: true })
          return
        }

        const resolvedOrgId = resolveCurrentOrgId(activeMemberships)
        setCurrentOrgId(resolvedOrgId)

        const orgIds = activeMemberships.map((membership) => membership.organization_id)
        const [orgData, projectData, fileData] = await Promise.all([
          getOrganizationsByIds(orgIds),
          getProjectsByOrganizationId(resolvedOrgId),
          listOrgFiles(resolvedOrgId)
        ])

        if (cancelled) return
        setMemberships(activeMemberships)
        setOrganizations(orgData)
        setCurrentOrgIdState(resolvedOrgId)
        setProjects(projectData)
        setFiles(fileData)
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load dashboard.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadInitialData()
    return () => {
      cancelled = true
    }
  }, [navigate])

  const handleOrgChange = async (nextOrgId: string) => {
    if (!nextOrgId || nextOrgId === currentOrgId) return

    setError(null)
    setFilesError(null)
    setLoadingProjects(true)
    setLoadingFiles(true)
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    setCurrentOrgId(nextOrgId)
    setCurrentOrgIdState(nextOrgId)

    try {
      const [nextProjects, nextFiles] = await Promise.all([
        getProjectsByOrganizationId(nextOrgId),
        listOrgFiles(nextOrgId)
      ])

      setProjects(nextProjects)
      setFiles(nextFiles)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load organization data.')
    } finally {
      setLoadingProjects(false)
      setLoadingFiles(false)
    }
  }

  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null
    setSelectedFile(nextFile)
    setFilesError(null)
  }

  const handleUploadFile = async () => {
    if (!currentOrgId) {
      setFilesError('Choose an organization before uploading files.')
      return
    }

    if (!selectedFile) {
      setFilesError('Choose a file to upload.')
      return
    }

    setUploadingFile(true)
    setLoadingFiles(true)
    setFilesError(null)

    try {
      await uploadOrgFile(currentOrgId, selectedFile)
      const refreshedFiles = await listOrgFiles(currentOrgId)
      setFiles(refreshedFiles)
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (uploadError) {
      setFilesError(uploadError instanceof Error ? uploadError.message : 'Failed to upload file.')
    } finally {
      setUploadingFile(false)
      setLoadingFiles(false)
    }
  }

  const handleDownloadFile = async (file: OrgStorageFile) => {
    setFilesError(null)

    try {
      const signedUrl = await getSignedOrgFileUrl(file.path)
      window.open(signedUrl, '_blank', 'noopener,noreferrer')
    } catch (downloadError) {
      setFilesError(
        downloadError instanceof Error ? downloadError.message : 'Failed to generate download link.'
      )
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    clearCurrentOrgId()
    navigate('/login', { replace: true })
  }

  const organization = organizations.find((org) => org.id === currentOrgId) ?? null

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-gray-600">Loading organization...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-900">
              {organization?.name || 'Organization Dashboard'}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {organization?.slug ? `Slug: ${organization.slug}` : 'No slug set'}
            </p>
            <div className="mt-3 max-w-sm">
              <label className="label" htmlFor="org-switcher">
                Organization
              </label>
              <select
                id="org-switcher"
                className="input"
                value={currentOrgId ?? ''}
                onChange={(event) => {
                  void handleOrgChange(event.target.value)
                }}
                disabled={loadingProjects || loadingFiles || memberships.length <= 1}
              >
                {memberships.map((membership) => {
                  const orgOption = organizations.find((org) => org.id === membership.organization_id)
                  const optionLabel = orgOption?.name || `Organization ${membership.organization_id.slice(0, 8)}`
                  return (
                    <option key={membership.organization_id} value={membership.organization_id}>
                      {optionLabel}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>
          <button type="button" onClick={handleLogout} className="btn-secondary">
            Logout
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900">Projects</h2>
          <p className="mt-1 text-sm text-gray-600">Projects for the current organization.</p>

          <div className="mt-4">
            {loadingProjects ? (
              <p className="text-sm text-gray-500">Loading projects...</p>
            ) : projects.length === 0 ? (
              <p className="text-sm text-gray-500">No projects found for this organization.</p>
            ) : (
              <ul className="space-y-3">
                {projects.map((project) => (
                  <li key={project.id} className="rounded border border-gray-200 px-4 py-3">
                    <p className="font-medium text-gray-900">{project.name}</p>
                    <p className="mt-1 text-xs text-gray-500">Status: {project.status || 'unknown'}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900">Files</h2>
          <p className="mt-1 text-sm text-gray-600">
            Upload and list files from the private <code>client-files</code> bucket for this organization.
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              id="org-file-input"
              ref={fileInputRef}
              type="file"
              className="input"
              onChange={handleFileSelection}
              disabled={!currentOrgId || uploadingFile || loadingFiles}
            />
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                void handleUploadFile()
              }}
              disabled={!currentOrgId || !selectedFile || uploadingFile || loadingFiles}
            >
              {uploadingFile ? 'Uploading...' : 'Upload File'}
            </button>
          </div>

          {selectedFile && (
            <p className="mt-2 text-xs text-gray-500">
              Selected: {selectedFile.name} ({formatBytes(selectedFile.size)})
            </p>
          )}

          {filesError && (
            <div className="mt-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {filesError}
            </div>
          )}

          <div className="mt-4">
            {loadingFiles ? (
              <p className="text-sm text-gray-500">Loading files...</p>
            ) : files.length === 0 ? (
              <p className="text-sm text-gray-500">No files found for this organization.</p>
            ) : (
              <ul className="space-y-3">
                {files.map((file) => (
                  <li
                    key={file.path}
                    className="flex flex-col gap-3 rounded border border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {formatBytes(file.sizeBytes)} • Updated {formatDate(file.updatedAt ?? file.createdAt)}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        void handleDownloadFile(file)
                      }}
                    >
                      Download
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function resolveCurrentOrgId(memberships: ActiveMembership[]): string {
  const storedOrgId = getCurrentOrgId()
  if (storedOrgId && memberships.some((membership) => membership.organization_id === storedOrgId)) {
    return storedOrgId
  }
  return memberships[0].organization_id
}

function formatBytes(bytes: number | null): string {
  if (bytes === null || bytes < 0) return 'Unknown size'
  if (bytes < 1024) return `${bytes} B`

  const units = ['KB', 'MB', 'GB', 'TB']
  let value = bytes / 1024
  let unitIndex = 0

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }

  return `${value.toFixed(1)} ${units[unitIndex]}`
}

function formatDate(value: string | null): string {
  if (!value) return 'unknown'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'unknown'
  return date.toLocaleString()
}
