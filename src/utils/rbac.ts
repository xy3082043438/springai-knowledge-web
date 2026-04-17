import type { Permission } from '@/types/api'

export interface PermissionOption {
  code: Permission
  label: string
  description: string
}

export interface PermissionGroup {
  key: string
  label: string
  accent: string
  icon: string
  permissions: PermissionOption[]
}

export const permissionGroups: PermissionGroup[] = [
  {
    key: 'user',
    label: '用户管理',
    accent: '#2563eb',
    icon: 'User',
    permissions: [
      { code: 'USER_READ', label: '查看用户', description: '可访问用户列表与基础信息。' },
      { code: 'USER_WRITE', label: '编辑用户', description: '可新增或修改用户账号与角色。' },
    ],
  },
  {
    key: 'role',
    label: '角色管理',
    accent: '#0f766e',
    icon: 'Lock',
    permissions: [
      { code: 'ROLE_READ', label: '查看角色', description: '可查看角色列表与权限组合。' },
      { code: 'ROLE_WRITE', label: '编辑角色', description: '可新增、调整或删除角色。' },
    ],
  },
  {
    key: 'document',
    label: '知识库',
    accent: '#f97316',
    icon: 'Document',
    permissions: [
      { code: 'DOC_READ', label: '查看文档', description: '可查看知识文档及可见范围。' },
      { code: 'DOC_WRITE', label: '编辑文档', description: '可上传、编辑、删除和重建索引。' },
      { code: 'QA_READ', label: '智能问答', description: '可使用 AI 助手进行提问咨询和获取建议。' },
    ],
  },
  {
    key: 'dashboard',
    label: '数据看板',
    accent: '#0891b2',
    icon: 'DataAnalysis',
    permissions: [
      { code: 'DASHBOARD_READ', label: '查看看板', description: '可查看系统运行数据大屏与统计统计。' },
    ],
  },
  {
    key: 'config',
    label: '系统配置',
    accent: '#7c3aed',
    icon: 'Setting',
    permissions: [
      { code: 'CONFIG_READ', label: '查看配置', description: '可查看系统参数与运行状态。' },
      { code: 'CONFIG_WRITE', label: '修改配置', description: '可在线修改配置并刷新全局参数。' },
    ],
  },
  {
    key: 'logs',
    label: '日志与反馈',
    accent: '#dc2626',
    icon: 'Files',
    permissions: [
      { code: 'LOG_READ', label: '查看日志', description: '可访问问答日志与操作日志。' },
      { code: 'LOG_WRITE', label: '管理日志', description: '可执行日志清理与维护操作。' },
      { code: 'LOG_EXPORT', label: '导出日志', description: '可将日志数据导出为 Excel 文件。' },
      { code: 'FEEDBACK_READ', label: '查看反馈', description: '可查看用户评价和反馈记录。' },
      { code: 'FEEDBACK_WRITE', label: '处理反馈', description: '可执行反馈屏蔽与处理操作。' },
    ],
  },
];

export const allPermissions = permissionGroups.flatMap((group) => group.permissions.map((permission) => permission.code))

const permissionMeta = permissionGroups.reduce<Record<Permission, PermissionOption>>((accumulator, group) => {
  group.permissions.forEach((permission) => {
    accumulator[permission.code] = permission
  })
  return accumulator
}, {} as Record<Permission, PermissionOption>)

export function getPermissionLabel(permission?: Permission | null) {
  if (!permission) return ''
  return permissionMeta[permission]?.label || permission
}

export function getPermissionDescription(permission?: Permission | null) {
  if (!permission) return ''
  return permissionMeta[permission]?.description || ''
}

export function normalizePermissionList(permissions?: Permission[] | null) {
  if (!permissions?.length) {
    return [] as Permission[]
  }

  const permissionSet = new Set(permissions)
  return allPermissions.filter((permission) => permissionSet.has(permission))
}
