import { SimpleGrid } from '@mantine/core'
import {
  IconCircleCheck,
  IconClockHour4,
  IconFolderOpen,
  IconLock,
  IconProgress,
  IconTicket,
} from '@tabler/icons-react'
import { type AnalyticsPeriod, useAnalyticsOverview } from '@/entities/analytics'
import { formatDurationSeconds, formatPercent } from '@/shared/lib'
import { ErrorState, SectionCard, StatCard } from '@/shared/ui'

type OverviewCardsProps = {
  period: AnalyticsPeriod
  withClosedRate?: boolean
}

export function OverviewCards({ period, withClosedRate = false }: OverviewCardsProps) {
  const overview = useAnalyticsOverview(period)

  if (overview.isError && !overview.data) {
    return (
      <SectionCard>
        <ErrorState error={overview.error} onRetry={() => overview.refetch()} compact />
      </SectionCard>
    )
  }

  const data = overview.data
  const loading = overview.isLoading
  const closedRate = data && data.totalTickets > 0 ? (data.closedTickets / data.totalTickets) * 100 : 0

  return (
    <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing="md">
      <StatCard label="Усього заявок" value={data?.totalTickets ?? 0} icon={<IconTicket size={20} />} loading={loading} />
      <StatCard
        label="Відкриті"
        value={data?.openTickets ?? 0}
        icon={<IconFolderOpen size={20} />}
        color="blue"
        loading={loading}
      />
      <StatCard
        label="В роботі"
        value={data?.inProgressTickets ?? 0}
        icon={<IconProgress size={20} />}
        color="violet"
        loading={loading}
      />
      <StatCard
        label="Вирішені"
        value={data?.resolvedTickets ?? 0}
        icon={<IconCircleCheck size={20} />}
        color="teal"
        loading={loading}
      />
      <StatCard
        label="Закриті"
        value={data?.closedTickets ?? 0}
        icon={<IconLock size={20} />}
        color="gray"
        loading={loading}
        hint={withClosedRate ? `${formatPercent(closedRate)} від усіх заявок` : undefined}
      />
      <StatCard
        label="Сер. час вирішення"
        value={formatDurationSeconds(data?.averageResolutionSeconds ?? 0)}
        icon={<IconClockHour4 size={20} />}
        color="orange"
        loading={loading}
      />
    </SimpleGrid>
  )
}
