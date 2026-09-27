import { useViewer } from '@/entities/session'
import { type TicketStatus, useTicketStatusCounts } from '@/entities/ticket'
import { ErrorState, SectionCard, StatStrip } from '@/shared/ui'

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
  const assigned = byStatus?.ASSIGNED ?? 0

  return (
    <StatStrip
      ariaLabel="Ваші задачі"
      loading={counts.isLoading}
      items={[
        { label: 'Нові призначення', value: assigned, attention: assigned > 0 },
        { label: 'В роботі', value: byStatus?.IN_PROGRESS ?? 0 },
        { label: 'Очікують користувача', value: byStatus?.WAITING_FOR_USER ?? 0 },
        { label: 'Вирішені', value: byStatus?.RESOLVED ?? 0 },
        { label: 'Усього призначено', value: counts.data?.total ?? 0 },
      ]}
    />
  )
}
