import type { UserRole } from './types'

export const roleLabels: Record<UserRole, string> = {
  USER: 'Користувач',
  SPECIALIST: 'Спеціаліст',
  ADMIN: 'Адміністратор',
}

export const roleColors: Record<UserRole, string> = {
  USER: 'gray',
  SPECIALIST: 'cyan',
  ADMIN: 'grape',
}

export const roleOptions = (Object.keys(roleLabels) as UserRole[]).map((role) => ({
  value: role,
  label: roleLabels[role],
}))
