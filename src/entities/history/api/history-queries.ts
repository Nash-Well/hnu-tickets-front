import { queryOptions, useQuery } from '@tanstack/react-query'
import { historyApi } from './history-api'

export const historyKeys = {
  byTicket: (ticketId: string) => ['tickets', 'history', ticketId] as const,
}

export const ticketHistoryQuery = (ticketId: string) =>
  queryOptions({
    queryKey: historyKeys.byTicket(ticketId),
    queryFn: ({ signal }) => historyApi.list(ticketId, signal),
  })

export function useTicketHistory(ticketId: string) {
  return useQuery(ticketHistoryQuery(ticketId))
}
