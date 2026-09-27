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
        description="Період застосовується до дати створення заявок"
        actions={<PeriodPicker state={periodState} />}
      />
      <Stack gap="lg">
        <OverviewCards period={period} />
        <CreatedPerDayChart period={period} />
        <Grid gap="lg">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <StatusChart period={period} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
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
