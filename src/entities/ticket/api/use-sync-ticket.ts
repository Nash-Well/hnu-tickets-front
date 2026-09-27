import { useQueryClient } from '@tanstack/react-query'
import type { Ticket } from '../model/types'
import { ticketKeys } from './ticket-queries'

export function useSyncTicket() {
  const queryClient = useQueryClient()
  return async (ticket?: Ticket) => {
    if (ticket) {
      queryClient.setQueryData(ticketKeys.detail(ticket.id), ticket)
    }
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ticketKeys.all }),
      queryClient.invalidateQueries({ queryKey: ['analytics'] }),
    ])
  }
}
