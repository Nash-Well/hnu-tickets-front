export const USER_ROLES = ['USER', 'SPECIALIST', 'ADMIN'] as const

export type UserRole = (typeof USER_ROLES)[number]

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export type UserSummary = {
  id: string
  name: string
}

export type UpdateUserPayload = {
  name?: string
  email?: string
}
