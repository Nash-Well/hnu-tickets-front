import { z } from 'zod'
import { USER_ROLES, userEmailSchema, userNameSchema, userPasswordSchema } from '@/entities/user'

export const editUserSchema = z.object({
  name: userNameSchema,
  email: userEmailSchema,
})

export type EditUserValues = z.infer<typeof editUserSchema>

export const createUserSchema = z.object({
  name: userNameSchema,
  email: userEmailSchema,
  password: userPasswordSchema,
  role: z.enum(USER_ROLES),
})

export type CreateUserValues = z.infer<typeof createUserSchema>
