import { BarChart } from '@mantine/charts'
import { Group, Stack, Text } from '@mantine/core'
import type { AnalyticsPeriod } from '@/entities/analytics'
import { useAllTickets } from '@/entities/ticket'
import { chartColor } from '@/shared/config'
import { countLabel } from '@/shared/lib'
import { ChartCard } from '@/shared/ui'
import { barChartStyle, TICKET_FORMS } from '../model/chart-style'
import { groupTicketsByCreationDate } from '../model/group-by-period'

const MIN_ACTIVE_BUCKETS = 3

export function CreatedPerDayChart({ period }: { period: AnalyticsPeriod }) {
  const tickets = useAllTickets({ createdFrom: period.from, createdTo: period.to, sort: 'createdAt', order: 'asc' })
  const data = groupTicketsByCreationDate(tickets.data ?? [], period.from, period.to)
  const activeBuckets = data.filter((point) => point.count > 0)
  const total = activeBuckets.reduce((sum, point) => sum + point.count, 0)
  const isSparse = activeBuckets.length < MIN_ACTIVE_BUCKETS

  return (
    <ChartCard
      title="Динаміка створення заявок"
      loading={tickets.isLoading}
      error={tickets.isError && !tickets.data ? tickets.error : null}
      onRetry={() => tickets.refetch()}
      isEmpty={total === 0}
      emptyMessage="За обраний період нових заявок немає."
    >
      {isSparse ? (
        <Stack gap="xs">
          <Text size="sm" c="dimmed">
            Замало даних для графіка: {countLabel(total, TICKET_FORMS)} за період.
          </Text>
          <Group gap="lg">
            {activeBuckets.map((point) => (
              <Text key={point.label} size="sm" className="app-tabular">
                {point.label}{' '}
                <Text span fw={600}>
                  {point.count}
                </Text>
              </Text>
            ))}
          </Group>
        </Stack>
      ) : (
        <BarChart
          h={220}
          data={data}
          dataKey="label"
          series={[{ name: 'count', label: 'Створено заявок', color: chartColor.series }]}
          yAxisProps={{ allowDecimals: false, width: 32 }}
          gridAxis="y"
          {...barChartStyle}
        />
      )}
    </ChartCard>
  )
}
