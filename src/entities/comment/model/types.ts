export type CommentAuthor = {
  id: string
  name: string
}

export type TicketComment = {
  id: string
  ticketId: string
  author: CommentAuthor
  content: string
  createdAt: string
}

export type RawTicketComment = Omit<TicketComment, 'author'> & {
  Author?: CommentAuthor
  author?: CommentAuthor
}
