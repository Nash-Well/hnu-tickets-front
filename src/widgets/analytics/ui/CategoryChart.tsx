import { BarChart } from '@mantine/charts'
import { type AnalyticsPeriod, useCategoryAnalytics } from '@/entities/analytics'
import { ChartCard } from '@/shared/ui'

export function CategoryChart({ period }: { period: AnalyticsPeriod }) {
  const categories = useCategoryAnalytics(period)
  const data = [...(categories.data ?? [])]
    .sort((a, b) => b.count - a.count)
    .map((item) => ({ category: item.name, count: item.count }))
  const total = data.reduce((sum, item) => sum + item.count, 0)
  const height = Math.max(220, data.length * 36)

  return (
    <ChartCard
      title="Заявки за категоріями"
      loading={categories.isLoading}
      error={categories.isError && !categories.data ? categories.error : null}
      onRetry={() => categories.refetch()}
      isEmpty={total === 0}
    >
      <BarChart
        h={height}
        data={data}
        dataKey="category"
        orientation="vertical"
        series={[{ name: 'count', label: 'Заявок', color: 'indigo.6' }]}
        yAxisProps={{ width: 160 }}
        xAxisProps={{ allowDecimals: false }}
        gridAxis="x"
        barProps={{ radius: 4 }}
        withBarValueLabel
      />
    </ChartCard>
  )
}
