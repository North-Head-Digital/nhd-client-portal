import { supabase } from './supabase'

export interface ActiveMembership {
  organization_id: string
  status: 'active'
  created_at: string | null
}

export interface OrganizationRecord {
  id: string
  name: string
  slug: string | null
  created_at: string | null
}

export interface ProjectRecord {
  id: string
  name: string
  status: string | null
  created_at: string | null
  organization_id: string
}

async function getCurrentUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) {
    throw new Error('You must be signed in to continue.')
  }
  return data.user.id
}

export async function getActiveMembershipsForCurrentUser(): Promise<ActiveMembership[]> {
  const userId = await getCurrentUserId()

  const { data, error } = await supabase
    .from('organization_memberships')
    .select('organization_id, status, created_at')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data ?? []) as ActiveMembership[]
}

export async function getOrganizationById(orgId: string): Promise<OrganizationRecord> {
  const { data, error } = await supabase
    .from('organizations')
    .select('id, name, slug, created_at')
    .eq('id', orgId)
    .single()

  if (error) throw error
  return data as OrganizationRecord
}

export async function getOrganizationsByIds(orgIds: string[]): Promise<OrganizationRecord[]> {
  if (orgIds.length === 0) return []

  const { data, error } = await supabase
    .from('organizations')
    .select('id, name, slug, created_at')
    .in('id', orgIds)

  if (error) throw error
  return (data ?? []) as OrganizationRecord[]
}

export async function getProjectsByOrganizationId(orgId: string): Promise<ProjectRecord[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('id, name, status, created_at, organization_id')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as ProjectRecord[]
}
