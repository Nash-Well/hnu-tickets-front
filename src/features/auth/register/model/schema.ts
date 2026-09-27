import { z } from 'zod'
import { userEmailSchema, userNameSchema, userPasswordSchema } from '@/entities/user'

export const registerSchema = z
  .object({
    name: userNameSchema,
    email: userEmailSchema,
    password: userPasswordSchema,
    confirmPassword: z.string().min(1, 'Підтвердіть пароль'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Паролі не збігаються',
    path: ['confirmPassword'],
  })

export type RegisterValues = z.infer<typeof registerSchema>
