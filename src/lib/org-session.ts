const CURRENT_ORG_STORAGE_KEY = 'nhd_current_org_id'

let currentOrgIdMemory: string | null = null

export function getCurrentOrgId(): string | null {
  if (currentOrgIdMemory) return currentOrgIdMemory
  if (typeof window === 'undefined') return null

  const stored = localStorage.getItem(CURRENT_ORG_STORAGE_KEY)
  currentOrgIdMemory = stored
  return stored
}

export function setCurrentOrgId(orgId: string) {
  currentOrgIdMemory = orgId
  if (typeof window !== 'undefined') {
    localStorage.setItem(CURRENT_ORG_STORAGE_KEY, orgId)
  }
}

export function clearCurrentOrgId() {
  currentOrgIdMemory = null
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CURRENT_ORG_STORAGE_KEY)
  }
}
