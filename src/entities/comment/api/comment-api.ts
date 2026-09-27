import { http } from '@/shared/api'
import type { RawTicketComment, TicketComment } from '../model/types'

function normalizeComment({ Author, author, ...comment }: RawTicketComment): TicketComment {
  return { ...comment, author: author ?? Author ?? { id: '', name: '' } }
}

export const commentApi = {
  list: async (ticketId: string, signal?: AbortSignal) => {
    const comments = await http.get<RawTicketComment[]>(`/tickets/${ticketId}/comments`, { signal })
    return comments.map(normalizeComment)
  },
  create: async (ticketId: string, content: string) => {
    const comment = await http.post<RawTicketComment>(`/tickets/${ticketId}/comments`, { content })
    return normalizeComment(comment)
  },
}
