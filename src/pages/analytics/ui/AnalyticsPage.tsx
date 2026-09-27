import { Grid, Stack } from '@mantine/core'
import { PeriodPicker, useAnalyticsPeriod } from '@/features/analytics-period'
import { PageHeader } from '@/shared/ui'
import {
  CategoryChart,
  CreatedPerDayChart,
  OverviewCards,
  PriorityChart,
  SpecialistWorkloadChart,
  StatusChart,
} from '@/widgets/analytics'

export function AnalyticsPage() {
  const periodState = useAnalyticsPeriod()
  const { period } = periodState
  return (
    <>
      <PageHeader
        title="Аналітика"
        description="Статистика роботи служби технічної підтримки за обраний період (за датою створення заявок)"
        actions={<PeriodPicker state={periodState} />}
      />
      <Stack gap="lg">
        <OverviewCards period={period} withClosedRate />
        <CreatedPerDayChart period={period} />
        <Grid gap="lg">
          <Grid.Col span={{ base: 12, lg: 7 }}>
            <StatusChart period={period} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 5 }}>
            <PriorityChart period={period} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <CategoryChart period={period} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 6 }}>
            <SpecialistWorkloadChart period={period} />
          </Grid.Col>
        </Grid>
      </Stack>
    </>
  )
}
