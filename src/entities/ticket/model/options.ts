import { priorityLabels, statusLabels } from './labels'
import { TICKET_PRIORITIES, TICKET_STATUSES } from './types'

export const statusOptions = TICKET_STATUSES.map((status) => ({ value: status, label: statusLabels[status] }))

export const priorityOptions = TICKET_PRIORITIES.map((priority) => ({
  value: priority,
  label: priorityLabels[priority],
}))

export const OPEN_STATUSES = ['NEW', 'ASSIGNED', 'IN_PROGRESS', 'WAITING_FOR_USER'] as const

export function isTerminalStatus(status: string) {
  return status === 'CLOSED' || status === 'CANCELLED'
}
