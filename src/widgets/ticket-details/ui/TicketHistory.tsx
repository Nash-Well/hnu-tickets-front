import { Skeleton, Stack, Text, Timeline, Tooltip } from '@mantine/core'
import { historyActionLabels, historyActionTone, type TicketHistoryEntry } from '@/entities/history'
import { formatDateTime, formatRelative } from '@/shared/lib'
import { EmptyState, ErrorState } from '@/shared/ui'
import type { NameResolver } from '../model/use-name-resolver'
import { HistoryChange } from './HistoryChange'
import classes from './TicketHistory.module.css'

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
          <Skeleton key={index} height={40} radius="sm" />
        ))}
      </Stack>
    )
  }
  if (error) {
    return <ErrorState error={error} onRetry={onRetry} compact />
  }
  if (!entries?.length) {
    return <EmptyState compact title="Історія змін порожня." />
  }

  const sorted = [...entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <Timeline bulletSize={10} lineWidth={1} classNames={{ itemBullet: classes.bullet, item: classes.item }}>
      {sorted.map((entry) => (
        <Timeline.Item
          key={entry.id}
          data-tone={historyActionTone[entry.action] ?? 'neutral'}
          title={
            <Text size="sm" fw={500}>
              {historyActionLabels[entry.action] ?? entry.action}
            </Text>
          }
        >
          <HistoryChange entry={entry} names={names} />
          <Text size="xs" c="dimmed" mt={4}>
            {names.isViewer(entry.changedBy) ? 'Ви' : names.person(entry.changedBy)} ·{' '}
            <Tooltip label={formatDateTime(entry.createdAt)} withArrow>
              <time dateTime={entry.createdAt}>{formatRelative(entry.createdAt)}</time>
            </Tooltip>
          </Text>
        </Timeline.Item>
      ))}
    </Timeline>
  )
}
