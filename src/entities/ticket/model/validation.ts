import { z } from 'zod'
import { TICKET_PRIORITIES } from './types'

export const ticketFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Назва має містити щонайменше 3 символи')
    .max(255, 'Назва має містити не більше 255 символів'),
  description: z.string().trim().min(1, 'Опишіть проблему'),
  categoryId: z.string().min(1, 'Оберіть категорію'),
  priority: z.enum(TICKET_PRIORITIES, { message: 'Оберіть пріоритет' }),
})

export type TicketFormValues = z.infer<typeof ticketFormSchema>

export const ticketErrorFields = {
  INVALID_TITLE: 'title',
  INVALID_DESCRIPTION: 'description',
  INVALID_CATEGORY: 'categoryId',
  INVALID_REFERENCE: 'categoryId',
  INVALID_PRIORITY: 'priority',
}
