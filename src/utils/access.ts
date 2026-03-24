export const ADMIN_ROLE = 'ADMIN'

export function normalizeRole(role?: string | null) {
  return role?.trim().toUpperCase() || ''
}

export function isAdminRole(role?: string | null) {
  return normalizeRole(role) === ADMIN_ROLE
}

export function hasAnyRole(currentRole?: string | null, allowedRoles?: readonly string[]) {
  if (!allowedRoles || allowedRoles.length === 0) {
    return true
  }

  const normalizedCurrentRole = normalizeRole(currentRole)
  if (!normalizedCurrentRole) {
    return false
  }

  return allowedRoles.some((role) => normalizeRole(role) === normalizedCurrentRole)
}
