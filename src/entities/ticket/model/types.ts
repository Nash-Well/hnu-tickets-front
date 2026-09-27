import type { UserSummary } from '@/entities/user/@x/ticket'

export const TICKET_STATUSES = [
  'NEW',
  'ASSIGNED',
  'IN_PROGRESS',
  'WAITING_FOR_USER',
  'RESOLVED',
  'CLOSED',
  'CANCELLED',
] as const

export type TicketStatus = (typeof TICKET_STATUSES)[number]

export const TICKET_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const

export type TicketPriority = (typeof TICKET_PRIORITIES)[number]

export type TicketCategorySummary = {
  id: string
  name: string
}

export type Ticket = {
  id: string
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  category: TicketCategorySummary
  createdBy: UserSummary
  assignedTo: UserSummary | null
  createdAt: string
  updatedAt: string
  resolvedAt: string | null
  closedAt: string | null
}

export type TicketPage = {
  items: Ticket[]
  page: number
  pageSize: number
  total: number
}

export const TICKET_SORT_FIELDS = ['createdAt', 'updatedAt', 'priority', 'status'] as const

export type TicketSortField = (typeof TICKET_SORT_FIELDS)[number]

export type SortOrder = 'asc' | 'desc'

export type TicketListParams = {
  page?: number
  pageSize?: number
  q?: string
  status?: TicketStatus
  priority?: TicketPriority
  categoryId?: string
  assignedTo?: string
  createdFrom?: string
  createdTo?: string
  sort?: TicketSortField
  order?: SortOrder
}

export type CreateTicketPayload = {
  title: string
  description: string
  categoryId: string
  priority: TicketPriority
}

export type UpdateTicketPayload = Partial<CreateTicketPayload>
