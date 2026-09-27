import { http } from '@/shared/api'
import type { TicketHistoryEntry } from '../model/types'

export const historyApi = {
  list: (ticketId: string, signal?: AbortSignal) =>
    http.get<TicketHistoryEntry[]>(`/tickets/${ticketId}/history`, { signal }),
}
