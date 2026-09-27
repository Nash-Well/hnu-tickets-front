import { useMemo } from 'react'
import { useCategories } from '@/entities/category'
import type { TicketComment } from '@/entities/comment'
import { useViewer } from '@/entities/session'
import type { Ticket } from '@/entities/ticket'
import { useUsers } from '@/entities/user'

export function useNameResolver(ticket: Ticket, comments: TicketComment[] = []) {
  const viewer = useViewer()
  const users = useUsers(viewer.role === 'ADMIN')
  const categories = useCategories()

  return useMemo(() => {
    const people = new Map<string, string>()
    users.data?.forEach((user) => people.set(user.id, user.name))
    comments.forEach((comment) => comment.author.id && people.set(comment.author.id, comment.author.name))
    people.set(ticket.createdBy.id, ticket.createdBy.name)
    if (ticket.assignedTo) {
      people.set(ticket.assignedTo.id, ticket.assignedTo.name)
    }
    people.set(viewer.id, viewer.name)

    const categoryNames = new Map<string, string>()
    categories.data?.forEach((category) => categoryNames.set(category.id, category.name))
    categoryNames.set(ticket.category.id, ticket.category.name)

    return {
      person: (id: string | null | undefined) => (id ? (people.get(id) ?? 'Спеціаліст') : '—'),
      category: (id: string | null | undefined) => (id ? (categoryNames.get(id) ?? 'Видалена категорія') : '—'),
      isViewer: (id: string) => id === viewer.id,
    }
  }, [categories.data, comments, ticket, users.data, viewer])
}

export type NameResolver = ReturnType<typeof useNameResolver>
