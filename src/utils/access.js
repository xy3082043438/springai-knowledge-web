export const ADMIN_ROLE = 'ADMIN';
export function normalizeRole(role) {
    return role?.trim().toUpperCase() || '';
}
export function isAdminRole(role) {
    return normalizeRole(role) === ADMIN_ROLE;
}
export function hasAnyRole(currentRole, allowedRoles) {
    if (!allowedRoles || allowedRoles.length === 0) {
        return true;
    }
    const normalizedCurrentRole = normalizeRole(currentRole);
    if (!normalizedCurrentRole) {
        return false;
    }
    return allowedRoles.some((role) => normalizeRole(role) === normalizedCurrentRole);
}
//# sourceMappingURL=access.js.map