import { http } from '@/shared/api'
import type { UpdateUserPayload, User, UserRole } from '../model/types'

export const userApi = {
  list: (signal?: AbortSignal) => http.get<User[]>('/users', { signal }),
  get: (id: string, signal?: AbortSignal) => http.get<User>(`/users/${id}`, { signal }),
  update: (id: string, payload: UpdateUserPayload) => http.patch<User>(`/users/${id}`, payload),
  updateRole: (id: string, role: UserRole) => http.patch<void>(`/users/${id}/role`, { role }),
}
