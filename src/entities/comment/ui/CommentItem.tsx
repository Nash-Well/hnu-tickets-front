import { Group, Paper, Stack, Text, Tooltip } from '@mantine/core'
import { formatDateTime, formatRelative } from '@/shared/lib'
import { UserAvatar } from '@/shared/ui'
import type { TicketComment } from '../model/types'

type CommentItemProps = {
  comment: TicketComment
  isOwn: boolean
  authorTag?: string
}

export function CommentItem({ comment, isOwn, authorTag }: CommentItemProps) {
  const authorName = comment.author.name || 'Невідомий автор'
  return (
    <Group align="flex-start" gap="sm" wrap="nowrap">
      <UserAvatar name={authorName} size={32} />
      <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
        <Group gap="xs" wrap="wrap">
          <Text fw={600} size="sm">
            {authorName}
          </Text>
          {(isOwn || authorTag) && (
            <Text size="xs" c="dimmed">
              {isOwn ? 'Ви' : authorTag}
            </Text>
          )}
          <Tooltip label={formatDateTime(comment.createdAt)} withArrow>
            <Text size="xs" c="dimmed" component="time" dateTime={comment.createdAt}>
              {formatRelative(comment.createdAt)}
            </Text>
          </Tooltip>
        </Group>
        <Paper radius="sm" p="sm" bg={isOwn ? 'var(--app-accent-soft)' : 'var(--app-surface-secondary)'}>
          <Text size="sm" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {comment.content}
          </Text>
        </Paper>
      </Stack>
    </Group>
  )
}
