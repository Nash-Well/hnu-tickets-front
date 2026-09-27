import { SimpleGrid } from '@mantine/core'
import { IconCircleCheck, IconFolderOpen, IconLock, IconMessageQuestion, IconTicket } from '@tabler/icons-react'
import { useViewer } from '@/entities/session'
import { type TicketStatus, useTicketStatusCounts } from '@/entities/ticket'
import { ErrorState, SectionCard, StatCard } from '@/shared/ui'

const STATUSES: TicketStatus[] = ['NEW', 'ASSIGNED', 'IN_PROGRESS', 'WAITING_FOR_USER', 'RESOLVED', 'CLOSED']

export function RequesterSummary() {
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
  const open = byStatus ? byStatus.NEW + byStatus.ASSIGNED + byStatus.IN_PROGRESS + byStatus.WAITING_FOR_USER : 0
  const loading = counts.isLoading

  return (
    <SimpleGrid cols={{ base: 1, xs: 2, lg: 5 }} spacing="md">
      <StatCard label="Усього заявок" value={counts.data?.total ?? 0} icon={<IconTicket size={20} />} loading={loading} />
      <StatCard label="Відкриті" value={open} icon={<IconFolderOpen size={20} />} color="blue" loading={loading} />
      <StatCard
        label="Потрібна ваша відповідь"
        value={byStatus?.WAITING_FOR_USER ?? 0}
        icon={<IconMessageQuestion size={20} />}
        color="yellow"
        loading={loading}
      />
      <StatCard
        label="Очікують підтвердження"
        value={byStatus?.RESOLVED ?? 0}
        icon={<IconCircleCheck size={20} />}
        color="teal"
        loading={loading}
      />
      <StatCard label="Закриті" value={byStatus?.CLOSED ?? 0} icon={<IconLock size={20} />} color="gray" loading={loading} />
    </SimpleGrid>
  )
}
