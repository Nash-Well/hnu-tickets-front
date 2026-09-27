import { queryOptions, useQuery } from '@tanstack/react-query'
import { commentApi } from './comment-api'

export const commentKeys = {
  byTicket: (ticketId: string) => ['tickets', 'comments', ticketId] as const,
}

export const ticketCommentsQuery = (ticketId: string) =>
  queryOptions({
    queryKey: commentKeys.byTicket(ticketId),
    queryFn: ({ signal }) => commentApi.list(ticketId, signal),
  })

export function useTicketComments(ticketId: string) {
  return useQuery(ticketCommentsQuery(ticketId))
}
