import { supabase } from './supabase'

const STORAGE_BUCKET = 'client-files'
const DOWNLOAD_URL_TTL_SECONDS = 60 * 10

type StorageFileLike = {
  id?: string
  name: string
  created_at?: string
  updated_at?: string
  metadata?: {
    size?: number
    mimetype?: string
  }
}

export interface OrgStorageFile {
  name: string
  path: string
  sizeBytes: number | null
  mimeType: string | null
  createdAt: string | null
  updatedAt: string | null
}

function sanitizeFileName(fileName: string): string {
  return fileName
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
}

function toTimestamp(value: string | null): number {
  if (!value) return 0
  const parsed = Date.parse(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

export async function listOrgFiles(orgId: string): Promise<OrgStorageFile[]> {
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .list(orgId, { limit: 100, offset: 0 })

  if (error) throw error

  return (data ?? [])
    .filter((entry) => Boolean((entry as StorageFileLike).id))
    .map((entry) => {
      const file = entry as StorageFileLike
      return {
        name: file.name,
        path: `${orgId}/${file.name}`,
        sizeBytes: typeof file.metadata?.size === 'number' ? file.metadata.size : null,
        mimeType: typeof file.metadata?.mimetype === 'string' ? file.metadata.mimetype : null,
        createdAt: file.created_at ?? null,
        updatedAt: file.updated_at ?? null
      }
    })
    .sort((a, b) => toTimestamp(b.updatedAt ?? b.createdAt) - toTimestamp(a.updatedAt ?? a.createdAt))
}

export async function uploadOrgFile(orgId: string, file: File): Promise<string> {
  const safeName = sanitizeFileName(file.name) || `file-${Date.now()}`
  const path = `${orgId}/${Date.now()}-${safeName}`

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
    upsert: false,
    contentType: file.type || undefined
  })

  if (error) throw error
  return path
}

export async function getSignedOrgFileUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(path, DOWNLOAD_URL_TTL_SECONDS)

  if (error || !data?.signedUrl) {
    throw error ?? new Error('Unable to generate a signed URL for this file.')
  }

  return data.signedUrl
}
