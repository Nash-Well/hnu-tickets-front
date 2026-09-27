import { type AnalyticsPeriod, useStatusAnalytics } from '@/entities/analytics'
import { statusChartColor, statusLabels, TICKET_STATUSES } from '@/entities/ticket'
import { ChartCard, DistributionList } from '@/shared/ui'

export function StatusChart({ period }: { period: AnalyticsPeriod }) {
  const statuses = useStatusAnalytics(period)
  const byStatus = new Map((statuses.data ?? []).map((item) => [item.value, item.count]))
  const items = TICKET_STATUSES.filter((status) => (byStatus.get(status) ?? 0) > 0).map((status) => ({
    key: status,
    label: statusLabels[status],
    value: byStatus.get(status) ?? 0,
    color: statusChartColor[status],
  }))

  return (
    <ChartCard
      title="За статусами"
      loading={statuses.isLoading}
      error={statuses.isError && !statuses.data ? statuses.error : null}
      onRetry={() => statuses.refetch()}
      isEmpty={items.length === 0}
    >
      <DistributionList items={items} ariaLabel="Розподіл заявок за статусами" />
    </ChartCard>
  )
}
