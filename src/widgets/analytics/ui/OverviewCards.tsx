import { type AnalyticsPeriod, useAnalyticsOverview } from '@/entities/analytics'
import { formatDurationSeconds, formatPercent } from '@/shared/lib'
import { ErrorState, SectionCard, StatStrip } from '@/shared/ui'

export function OverviewCards({ period }: { period: AnalyticsPeriod }) {
  const overview = useAnalyticsOverview(period)

  if (overview.isError && !overview.data) {
    return (
      <SectionCard>
        <ErrorState error={overview.error} onRetry={() => overview.refetch()} compact />
      </SectionCard>
    )
  }

  const data = overview.data
  const closedRate = data && data.totalTickets > 0 ? (data.closedTickets / data.totalTickets) * 100 : 0

  return (
    <StatStrip
      ariaLabel="Основні показники"
      loading={overview.isLoading}
      items={[
        { label: 'Усього заявок', value: data?.totalTickets ?? 0 },
        { label: 'Відкриті', value: data?.openTickets ?? 0 },
        { label: 'В роботі', value: data?.inProgressTickets ?? 0 },
        { label: 'Вирішені', value: data?.resolvedTickets ?? 0 },
        {
          label: 'Закриті',
          value: data?.closedTickets ?? 0,
          hint: data && data.totalTickets > 0 ? `${formatPercent(closedRate)} від усіх` : undefined,
        },
        { label: 'Сер. час вирішення', value: formatDurationSeconds(data?.averageResolutionSeconds ?? 0) },
      ]}
    />
  )
}
