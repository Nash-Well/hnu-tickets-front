import { type AnalyticsPeriod, usePriorityAnalytics } from '@/entities/analytics'
import { priorityChartColor, priorityLabels, TICKET_PRIORITIES } from '@/entities/ticket'
import { ChartCard, DistributionList } from '@/shared/ui'

export function PriorityChart({ period }: { period: AnalyticsPeriod }) {
  const priorities = usePriorityAnalytics(period)
  const byPriority = new Map((priorities.data ?? []).map((item) => [item.value, item.count]))
  const items = [...TICKET_PRIORITIES].reverse().map((priority) => ({
    key: priority,
    label: priorityLabels[priority],
    value: byPriority.get(priority) ?? 0,
    color: priorityChartColor[priority],
  }))
  const total = items.reduce((sum, item) => sum + item.value, 0)

  return (
    <ChartCard
      title="За пріоритетами"
      loading={priorities.isLoading}
      error={priorities.isError && !priorities.data ? priorities.error : null}
      onRetry={() => priorities.refetch()}
      isEmpty={total === 0}
    >
      <DistributionList items={items} ariaLabel="Розподіл заявок за пріоритетами" />
    </ChartCard>
  )
}
