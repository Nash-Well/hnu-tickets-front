import { http } from '@/shared/api'
import type {
  CreateTicketPayload,
  Ticket,
  TicketListParams,
  TicketPage,
  TicketStatus,
  UpdateTicketPayload,
} from '../model/types'

export const ticketApi = {
  list: (params: TicketListParams, signal?: AbortSignal) => http.get<TicketPage>('/tickets', { query: params, signal }),
  get: (id: string, signal?: AbortSignal) => http.get<Ticket>(`/tickets/${id}`, { signal }),
  create: (payload: CreateTicketPayload) => http.post<Ticket>('/tickets', payload),
  update: (id: string, payload: UpdateTicketPayload) => http.patch<Ticket>(`/tickets/${id}`, payload),
  assign: (id: string, specialistId: string) => http.patch<Ticket>(`/tickets/${id}/assign`, { specialistId }),
  changeStatus: (id: string, status: TicketStatus) => http.patch<Ticket>(`/tickets/${id}/status`, { status }),
  async listAll(params: Omit<TicketListParams, 'page' | 'pageSize'>, signal?: AbortSignal) {
    const pageSize = 100
    const firstPage = await ticketApi.list({ ...params, page: 1, pageSize }, signal)
    const pageCount = Math.ceil(firstPage.total / pageSize)
    const remainingPages = await Promise.all(
      Array.from({ length: Math.max(pageCount - 1, 0) }, (_, index) =>
        ticketApi.list({ ...params, page: index + 2, pageSize }, signal),
      ),
    )
    return [firstPage, ...remainingPages].flatMap((page) => page.items)
  },
}
