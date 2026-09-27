export const HISTORY_ACTIONS = [
  'CREATED',
  'UPDATED',
  'STATUS_CHANGED',
  'ASSIGNED',
  'REASSIGNED',
  'PRIORITY_CHANGED',
  'CATEGORY_CHANGED',
  'CANCELLED',
  'RESOLVED',
  'CLOSED',
] as const

export type HistoryAction = (typeof HISTORY_ACTIONS)[number]

export type TicketHistoryEntry = {
  id: string
  ticketId: string
  changedBy: string
  action: HistoryAction
  oldValue: string | null
  newValue: string | null
  createdAt: string
}
