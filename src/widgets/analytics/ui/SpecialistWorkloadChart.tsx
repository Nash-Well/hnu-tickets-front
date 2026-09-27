import { BarChart } from '@mantine/charts'
import { type AnalyticsPeriod, useSpecialistAnalytics } from '@/entities/analytics'
import { ChartCard } from '@/shared/ui'

export function SpecialistWorkloadChart({ period }: { period: AnalyticsPeriod }) {
  const specialists = useSpecialistAnalytics(period)
  const data = [...(specialists.data ?? [])]
    .sort((a, b) => b.openTickets - a.openTickets)
    .map((item) => ({ specialist: item.name, openTickets: item.openTickets }))
  const height = Math.max(200, data.length * 40)

  return (
    <ChartCard
      title="Завантаженість спеціалістів"
      description="Кількість активних заявок (призначені, в роботі, очікують користувача)"
      loading={specialists.isLoading}
      error={specialists.isError && !specialists.data ? specialists.error : null}
      onRetry={() => specialists.refetch()}
      isEmpty={data.length === 0}
    >
      <BarChart
        h={height}
        data={data}
        dataKey="specialist"
        orientation="vertical"
        series={[{ name: 'openTickets', label: 'Активних заявок', color: 'cyan.6' }]}
        yAxisProps={{ width: 160 }}
        xAxisProps={{ allowDecimals: false }}
        gridAxis="x"
        barProps={{ radius: 4 }}
        withBarValueLabel
      />
    </ChartCard>
  )
}
