import { BarChart } from '@mantine/charts'
import { Text } from '@mantine/core'
import { type AnalyticsPeriod, useSpecialistAnalytics } from '@/entities/analytics'
import { chartColor } from '@/shared/config'
import { countLabel } from '@/shared/lib'
import { ChartCard, EmptyState } from '@/shared/ui'
import { barChartStyle } from '../model/chart-style'

const SPECIALIST_FORMS: [string, string, string] = ['спеціаліст', 'спеціалісти', 'спеціалістів']

export function SpecialistWorkloadChart({ period }: { period: AnalyticsPeriod }) {
  const specialists = useSpecialistAnalytics(period)
  const all = specialists.data ?? []
  const busy = all
    .filter((item) => item.openTickets > 0)
    .sort((a, b) => b.openTickets - a.openTickets)
    .map((item) => ({ specialist: item.name, openTickets: item.openTickets }))
  const idleCount = all.length - busy.length

  return (
    <ChartCard
      title="Завантаженість спеціалістів"
      description="Активні заявки: призначені, в роботі, очікують користувача"
      loading={specialists.isLoading}
      error={specialists.isError && !specialists.data ? specialists.error : null}
      onRetry={() => specialists.refetch()}
      isEmpty={all.length === 0}
      emptyMessage="У системі немає спеціалістів."
      footer={
        busy.length > 0 &&
        idleCount > 0 && (
          <Text size="xs" c="dimmed" mt="sm">
            Без активних заявок: {countLabel(idleCount, SPECIALIST_FORMS)}
          </Text>
        )
      }
    >
      {busy.length === 0 ? (
        <EmptyState
          compact
          title={`Жоден спеціаліст не має активних заявок (${countLabel(all.length, SPECIALIST_FORMS)}).`}
        />
      ) : (
        <BarChart
          h={Math.max(72, busy.length * 32 + 32)}
          data={busy}
          dataKey="specialist"
          orientation="vertical"
          series={[{ name: 'openTickets', label: 'Активних заявок', color: chartColor.series }]}
          yAxisProps={{ width: 150 }}
          xAxisProps={{ allowDecimals: false }}
          gridAxis="x"
          withBarValueLabel
          {...barChartStyle}
        />
      )}
    </ChartCard>
  )
}
