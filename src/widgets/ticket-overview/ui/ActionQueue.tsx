import { Anchor, Group, Skeleton, Stack, Text, Title } from '@mantine/core'
import { useQueries } from '@tanstack/react-query'
import { Link } from 'react-router'
import { type TicketListParams, ticketListQuery, TicketsTable } from '@/entities/ticket'
import { countLabel } from '@/shared/lib'
import { EmptyState, ErrorState, SectionCard } from '@/shared/ui'

export type QueueSection = {
  key: string
  title: string
  params: TicketListParams
  viewAllTo: string
}

type ActionQueueProps = {
  title: string
  sections: QueueSection[]
  emptyMessage: string
  showAuthor?: boolean
  showAssignee?: boolean
}

export function ActionQueue({ title, sections, emptyMessage, showAuthor = false, showAssignee = true }: ActionQueueProps) {
  const results = useQueries({ queries: sections.map((section) => ticketListQuery(section.params)) })
  const loading = results.some((result) => result.isLoading)
  const failed = results.find((result) => result.isError && !result.data)
  const filled = sections
    .map((section, index) => ({ section, page: results[index].data }))
    .filter((entry) => (entry.page?.items.length ?? 0) > 0)

  const renderContent = () => {
    if (loading) {
      return <Skeleton height={120} radius="sm" />
    }
    if (failed) {
      return <ErrorState error={failed.error} onRetry={() => results.forEach((result) => result.refetch())} compact />
    }
    if (filled.length === 0) {
      return <EmptyState compact title={emptyMessage} />
    }
    return (
      <Stack gap="lg">
        {filled.map(({ section, page }) => (
          <div key={section.key}>
            <Group justify="space-between" align="baseline" mb={4}>
              <Title order={4}>
                {section.title}{' '}
                <Text span c="dimmed" fw={400} className="app-tabular">
                  {page?.total}
                </Text>
              </Title>
              {(page?.total ?? 0) > (page?.items.length ?? 0) && (
                <Anchor component={Link} to={section.viewAllTo} size="sm">
                  Усі {countLabel(page?.total ?? 0, ['заявка', 'заявки', 'заявок'])}
                </Anchor>
              )}
            </Group>
            <TicketsTable tickets={page?.items ?? []} showAuthor={showAuthor} showAssignee={showAssignee} compact />
          </div>
        ))}
      </Stack>
    )
  }

  return <SectionCard title={title}>{renderContent()}</SectionCard>
}
