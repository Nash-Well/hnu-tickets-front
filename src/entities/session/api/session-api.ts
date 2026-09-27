import { http } from '@/shared/api'
import type { User } from '@/entities/user/@x/session'
import type { LoginPayload, RegisterPayload, SessionResponse } from '../model/types'

export const sessionApi = {
  login: (payload: LoginPayload) => http.post<SessionResponse>('/auth/login', payload, { authenticated: false }),
  register: (payload: RegisterPayload) =>
    http.post<SessionResponse>('/auth/register', payload, { authenticated: false }),
  me: (signal?: AbortSignal) => http.get<User>('/auth/me', { signal }),
}
