import { z } from 'zod'
import { userEmailSchema } from '@/entities/user'

export const loginSchema = z.object({
  email: userEmailSchema,
  password: z.string().min(1, 'Введіть пароль'),
})

export type LoginValues = z.infer<typeof loginSchema>
