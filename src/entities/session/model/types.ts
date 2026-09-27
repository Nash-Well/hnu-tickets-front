import type { User } from '@/entities/user/@x/session'

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  name: string
  email: string
  password: string
}

export type SessionResponse = {
  accessToken: string
  user: User
}
