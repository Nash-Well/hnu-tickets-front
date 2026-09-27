import type { UserRole } from './types'

export const roleLabels: Record<UserRole, string> = {
  USER: 'Користувач',
  SPECIALIST: 'Спеціаліст',
  ADMIN: 'Адміністратор',
}

export const roleOptions = (Object.keys(roleLabels) as UserRole[]).map((role) => ({
  value: role,
  label: roleLabels[role],
}))
