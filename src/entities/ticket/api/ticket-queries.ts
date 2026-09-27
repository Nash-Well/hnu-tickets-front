import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query'
import type { TicketListParams, TicketStatus } from '../model/types'
import { ticketApi } from './ticket-api'

export const ticketKeys = {
  all: ['tickets'] as const,
  lists: () => [...ticketKeys.all, 'list'] as const,
  list: (params: TicketListParams) => [...ticketKeys.lists(), params] as const,
  allInRange: (params: TicketListParams) => [...ticketKeys.all, 'all', params] as const,
  statusCounts: (viewerId: string) => [...ticketKeys.all, 'status-counts', viewerId] as const,
  details: () => [...ticketKeys.all, 'detail'] as const,
  detail: (id: string) => [...ticketKeys.details(), id] as const,
}

export const ticketListQuery = (params: TicketListParams) =>
  queryOptions({
    queryKey: ticketKeys.list(params),
    queryFn: ({ signal }) => ticketApi.list(params, signal),
    placeholderData: keepPreviousData,
  })

export const ticketQuery = (id: string) =>
  queryOptions({
    queryKey: ticketKeys.detail(id),
    queryFn: ({ signal }) => ticketApi.get(id, signal),
  })

export function useTickets(params: TicketListParams) {
  return useQuery(ticketListQuery(params))
}

export function useTicket(id: string) {
  return useQuery(ticketQuery(id))
}

export function useAllTickets(params: Omit<TicketListParams, 'page' | 'pageSize'>, enabled = true) {
  return useQuery({
    queryKey: ticketKeys.allInRange(params),
    queryFn: ({ signal }) => ticketApi.listAll(params, signal),
    enabled,
  })
}

export function useTicketStatusCounts(viewerId: string, statuses: readonly TicketStatus[]) {
  return useQuery({
    queryKey: [...ticketKeys.statusCounts(viewerId), statuses],
    queryFn: async ({ signal }) => {
      const [total, ...counts] = await Promise.all([
        ticketApi.list({ pageSize: 1 }, signal),
        ...statuses.map((status) => ticketApi.list({ status, pageSize: 1 }, signal)),
      ])
      const byStatus = Object.fromEntries(statuses.map((status, index) => [status, counts[index].total])) as Record<
        TicketStatus,
        number
      >
      return { total: total.total, byStatus }
    },
  })
}
