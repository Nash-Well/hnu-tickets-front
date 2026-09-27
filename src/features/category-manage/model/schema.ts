import { z } from 'zod'

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Назва має містити щонайменше 2 символи')
    .max(100, 'Назва має містити не більше 100 символів'),
  description: z.string().trim().max(1000, 'Опис має містити не більше 1000 символів'),
})

export type CategoryValues = z.infer<typeof categorySchema>

export const categoryErrorFields = {
  CATEGORY_NAME_EXISTS: 'name',
  INVALID_CATEGORY_NAME: 'name',
}
