import { Divider, Skeleton, Stack } from '@mantine/core'
import { IconMessageCircle } from '@tabler/icons-react'
import { CommentItem, type TicketComment } from '@/entities/comment'
import type { Ticket } from '@/entities/ticket'
import { AddCommentForm } from '@/features/comment-add'
import { EmptyState, ErrorState } from '@/shared/ui'
import type { NameResolver } from '../model/use-name-resolver'

type TicketCommentsProps = {
  ticket: Ticket
  comments: TicketComment[] | undefined
  loading: boolean
  error: unknown
  onRetry: () => void
  names: NameResolver
}

function authorTag(ticket: Ticket, authorId: string) {
  if (authorId === ticket.createdBy.id) {
    return 'Автор заявки'
  }
  if (authorId === ticket.assignedTo?.id) {
    return 'Відповідальний'
  }
  return 'Підтримка'
}

export function TicketComments({ ticket, comments, loading, error, onRetry, names }: TicketCommentsProps) {
  const renderList = () => {
    if (loading) {
      return (
        <Stack gap="md">
          {[0, 1].map((index) => (
            <Skeleton key={index} height={64} radius="md" />
          ))}
        </Stack>
      )
    }
    if (error) {
      return <ErrorState error={error} onRetry={onRetry} compact />
    }
    if (!comments?.length) {
      return (
        <EmptyState
          compact
          icon={<IconMessageCircle size={20} stroke={1.5} />}
          title="Коментарів ще немає"
          description="Поставте запитання або додайте уточнення щодо проблеми."
        />
      )
    }
    return (
      <Stack gap="lg" component="ol" style={{ listStyle: 'none', padding: 0, margin: 0 }} aria-label="Коментарі">
        {comments.map((comment) => (
          <li key={comment.id}>
            <CommentItem
              comment={comment}
              isOwn={names.isViewer(comment.author.id)}
              authorTag={authorTag(ticket, comment.author.id)}
            />
          </li>
        ))}
      </Stack>
    )
  }

  return (
    <Stack gap="lg">
      {renderList()}
      <Divider />
      <AddCommentForm ticketId={ticket.id} />
    </Stack>
  )
}
