import { useViewer } from '@/entities/session'
import { type TicketStatus, useTicketStatusCounts } from '@/entities/ticket'
import { ErrorState, SectionCard, StatStrip } from '@/shared/ui'

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
  const waiting = byStatus?.WAITING_FOR_USER ?? 0
  const resolved = byStatus?.RESOLVED ?? 0

  return (
    <StatStrip
      ariaLabel="Ваші заявки"
      loading={counts.isLoading}
      items={[
        { label: 'Усього заявок', value: counts.data?.total ?? 0 },
        { label: 'Відкриті', value: open },
        { label: 'Потрібна ваша відповідь', value: waiting, attention: waiting > 0 },
        { label: 'Очікують підтвердження', value: resolved, attention: resolved > 0 },
        { label: 'Закриті', value: byStatus?.CLOSED ?? 0 },
      ]}
    />
  )
}
