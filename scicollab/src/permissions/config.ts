export type Role = 'researcher' | 'institution' | 'admin' | 'reviewer'

export type Permission =
  // Publications
  | 'publications.create'
  | 'publications.approve'
  | 'publications.archive'
  | 'publications.review'
  // Administration
  | 'admin.manageUsers'
  | 'admin.manageInstitutions'
  | 'admin.assignRoles'
  // Analytics
  | 'analytics.exportReports'
  | 'analytics.viewAuditLogs'
  | 'analytics.viewAll'
  // Research
  | 'research.manageProjects'
  | 'research.createCollaboration'
  // System
  | 'system.configuration'
  | 'system.securitySettings'

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  researcher: [
    'publications.create',
    'analytics.exportReports',
    'research.manageProjects',
    'research.createCollaboration',
  ],
  reviewer: [
    'publications.review',
  ],
  institution: [
    'publications.create',
    'publications.approve',
    'publications.archive',
    'admin.manageUsers',
    'analytics.exportReports',
    'analytics.viewAll',
    'research.manageProjects',
    'research.createCollaboration',
  ],
  admin: [
    'publications.create',
    'publications.approve',
    'publications.archive',
    'publications.review',
    'admin.manageUsers',
    'admin.manageInstitutions',
    'admin.assignRoles',
    'analytics.exportReports',
    'analytics.viewAuditLogs',
    'analytics.viewAll',
    'research.manageProjects',
    'research.createCollaboration',
    'system.configuration',
    'system.securitySettings',
  ],
}

export function can(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}
