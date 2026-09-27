import { SimpleGrid } from '@mantine/core'
import { IconCircleCheck, IconInbox, IconMessageQuestion, IconProgress, IconTicket } from '@tabler/icons-react'
import { useViewer } from '@/entities/session'
import { type TicketStatus, useTicketStatusCounts } from '@/entities/ticket'
import { ErrorState, SectionCard, StatCard } from '@/shared/ui'

const STATUSES: TicketStatus[] = ['ASSIGNED', 'IN_PROGRESS', 'WAITING_FOR_USER', 'RESOLVED']

export function SpecialistSummary() {
  const viewer = useViewer()
  const counts = useTicketStatusCounts(viewer.id, STATUSES)

  if (counts.isError) {
    return (
      <SectionCard>
        <ErrorState error={counts.error} onRetry={() => counts.refetch()} compact />
      </SectionCard>
    )
  }

  const byStatus = counts.data?.byStatus
  const loading = counts.isLoading

  return (
    <SimpleGrid cols={{ base: 1, xs: 2, lg: 5 }} spacing="md">
      <StatCard
        label="Нові призначення"
        value={byStatus?.ASSIGNED ?? 0}
        icon={<IconInbox size={20} />}
        color="cyan"
        loading={loading}
      />
      <StatCard
        label="В роботі"
        value={byStatus?.IN_PROGRESS ?? 0}
        icon={<IconProgress size={20} />}
        color="violet"
        loading={loading}
      />
      <StatCard
        label="Очікують користувача"
        value={byStatus?.WAITING_FOR_USER ?? 0}
        icon={<IconMessageQuestion size={20} />}
        color="yellow"
        loading={loading}
      />
      <StatCard
        label="Вирішені"
        value={byStatus?.RESOLVED ?? 0}
        icon={<IconCircleCheck size={20} />}
        color="teal"
        loading={loading}
      />
      <StatCard label="Усього призначено" value={counts.data?.total ?? 0} icon={<IconTicket size={20} />} loading={loading} />
    </SimpleGrid>
  )
}
