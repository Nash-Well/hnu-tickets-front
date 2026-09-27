import { Skeleton, Stack, Text, ThemeIcon, Timeline, Tooltip } from '@mantine/core'
import {
  IconArrowsExchange,
  IconCircleCheck,
  IconCirclePlus,
  IconCircleX,
  IconFlag,
  IconHistory,
  IconLock,
  IconPencil,
  IconTag,
  IconUserCheck,
} from '@tabler/icons-react'
import { historyActionColors, historyActionLabels, type HistoryAction, type TicketHistoryEntry } from '@/entities/history'
import { formatDateTime, formatRelative } from '@/shared/lib'
import { EmptyState, ErrorState } from '@/shared/ui'
import type { NameResolver } from '../model/use-name-resolver'
import { HistoryChange } from './HistoryChange'

const actionIcons: Record<HistoryAction, typeof IconHistory> = {
  CREATED: IconCirclePlus,
  UPDATED: IconPencil,
  STATUS_CHANGED: IconArrowsExchange,
  ASSIGNED: IconUserCheck,
  REASSIGNED: IconUserCheck,
  PRIORITY_CHANGED: IconFlag,
  CATEGORY_CHANGED: IconTag,
  CANCELLED: IconCircleX,
  RESOLVED: IconCircleCheck,
  CLOSED: IconLock,
}

type TicketHistoryProps = {
  entries: TicketHistoryEntry[] | undefined
  loading: boolean
  error: unknown
  onRetry: () => void
  names: NameResolver
}

export function TicketHistory({ entries, loading, error, onRetry, names }: TicketHistoryProps) {
  if (loading) {
    return (
      <Stack gap="md">
        {[0, 1, 2].map((index) => (
          <Skeleton key={index} height={48} radius="md" />
        ))}
      </Stack>
    )
  }
  if (error) {
    return <ErrorState error={error} onRetry={onRetry} compact />
  }
  if (!entries?.length) {
    return <EmptyState compact icon={<IconHistory size={20} stroke={1.5} />} title="Історія змін порожня" />
  }

  const sorted = [...entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <Timeline bulletSize={28} lineWidth={2} active={sorted.length} color="gray">
      {sorted.map((entry) => {
        const Icon = actionIcons[entry.action] ?? IconHistory
        const color = historyActionColors[entry.action] ?? 'gray'
        return (
          <Timeline.Item
            key={entry.id}
            bullet={
              <ThemeIcon size={28} radius="xl" color={color} variant="light">
                <Icon size={15} aria-hidden />
              </ThemeIcon>
            }
            title={
              <Text size="sm" fw={600}>
                {historyActionLabels[entry.action] ?? entry.action}
              </Text>
            }
          >
            <HistoryChange entry={entry} names={names} />
            <Text size="xs" c="dimmed" mt={6}>
              {names.isViewer(entry.changedBy) ? 'Ви' : names.person(entry.changedBy)} ·{' '}
              <Tooltip label={formatDateTime(entry.createdAt)} withArrow>
                <time dateTime={entry.createdAt}>{formatRelative(entry.createdAt)}</time>
              </Tooltip>
            </Text>
          </Timeline.Item>
        )
      })}
    </Timeline>
  )
}
