import { BarChart } from '@mantine/charts'
import { Text } from '@mantine/core'
import { type AnalyticsPeriod, useCategoryAnalytics } from '@/entities/analytics'
import { chartColor } from '@/shared/config'
import { countLabel } from '@/shared/lib'
import { ChartCard } from '@/shared/ui'
import { barChartStyle } from '../model/chart-style'

export function CategoryChart({ period }: { period: AnalyticsPeriod }) {
  const categories = useCategoryAnalytics(period)
  const all = categories.data ?? []
  const data = all
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .map((item) => ({ category: item.name, count: item.count }))
  const unusedCount = all.length - data.length

  return (
    <ChartCard
      title="За категоріями"
      loading={categories.isLoading}
      error={categories.isError && !categories.data ? categories.error : null}
      onRetry={() => categories.refetch()}
      isEmpty={data.length === 0}
      footer={
        unusedCount > 0 && (
          <Text size="xs" c="dimmed" mt="sm">
            Без заявок: {countLabel(unusedCount, ['категорія', 'категорії', 'категорій'])}
          </Text>
        )
      }
    >
      <BarChart
        h={Math.max(72, data.length * 32 + 32)}
        data={data}
        dataKey="category"
        orientation="vertical"
        series={[{ name: 'count', label: 'Заявок', color: chartColor.series }]}
        yAxisProps={{ width: 150 }}
        xAxisProps={{ allowDecimals: false }}
        gridAxis="x"
        withBarValueLabel
        {...barChartStyle}
      />
    </ChartCard>
  )
}
