import { AreaChart } from '@mantine/charts'
import type { AnalyticsPeriod } from '@/entities/analytics'
import { useAllTickets } from '@/entities/ticket'
import { ChartCard } from '@/shared/ui'
import { groupTicketsByCreationDate } from '../model/group-by-period'

export function CreatedPerDayChart({ period }: { period: AnalyticsPeriod }) {
  const tickets = useAllTickets({ createdFrom: period.from, createdTo: period.to, sort: 'createdAt', order: 'asc' })
  const data = groupTicketsByCreationDate(tickets.data ?? [], period.from, period.to)
  const total = data.reduce((sum, point) => sum + point.count, 0)

  return (
    <ChartCard
      title="Динаміка створення заявок"
      description="Кількість нових заявок за обраний період"
      loading={tickets.isLoading}
      error={tickets.isError && !tickets.data ? tickets.error : null}
      onRetry={() => tickets.refetch()}
      isEmpty={total === 0}
    >
      <AreaChart
        h={280}
        data={data}
        dataKey="label"
        series={[{ name: 'count', label: 'Створено заявок', color: 'indigo.6' }]}
        curveType="monotone"
        withDots={data.length <= 31}
        yAxisProps={{ allowDecimals: false }}
        gridAxis="y"
        withGradient
      />
    </ChartCard>
  )
}
