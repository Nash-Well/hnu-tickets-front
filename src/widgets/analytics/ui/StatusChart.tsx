import { DonutChart } from '@mantine/charts'
import { Group, Stack } from '@mantine/core'
import { type AnalyticsPeriod, useStatusAnalytics } from '@/entities/analytics'
import { statusColors, statusLabels, TICKET_STATUSES, type TicketStatus } from '@/entities/ticket'
import { ChartCard, DistributionList } from '@/shared/ui'

export function StatusChart({ period }: { period: AnalyticsPeriod }) {
  const statuses = useStatusAnalytics(period)
  const byStatus = new Map((statuses.data ?? []).map((item) => [item.value, item.count]))
  const items = TICKET_STATUSES.filter((status) => (byStatus.get(status) ?? 0) > 0).map((status: TicketStatus) => ({
    key: status,
    label: statusLabels[status],
    value: byStatus.get(status) ?? 0,
    color: statusColors[status],
  }))
  const total = items.reduce((sum, item) => sum + item.value, 0)

  return (
    <ChartCard
      title="Заявки за статусами"
      loading={statuses.isLoading}
      error={statuses.isError && !statuses.data ? statuses.error : null}
      onRetry={() => statuses.refetch()}
      isEmpty={total === 0}
    >
      <Group align="center" gap="xl" wrap="wrap" justify="center">
        <DonutChart
          data={items.map((item) => ({ name: item.label, value: item.value, color: `${item.color}.6` }))}
          chartLabel={total}
          size={180}
          thickness={26}
          tooltipDataSource="segment"
          paddingAngle={2}
        />
        <Stack style={{ flex: '1 1 220px' }}>
          <DistributionList items={items} ariaLabel="Розподіл заявок за статусами" />
        </Stack>
      </Group>
    </ChartCard>
  )
}
