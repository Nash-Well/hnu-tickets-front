import { Button, Grid, Stack } from '@mantine/core'
import { Link } from 'react-router'
import { dayjs } from '@/shared/lib'
import { paths } from '@/shared/routes'
import { PageHeader } from '@/shared/ui'
import {
  CategoryChart,
  CreatedPerDayChart,
  OverviewCards,
  PriorityChart,
  SpecialistWorkloadChart,
  StatusChart,
} from '@/widgets/analytics'
import { ActionQueue, type QueueSection, TicketListCard } from '@/widgets/ticket-overview'

const ALL_TIME = {}

const LAST_14_DAYS = {
  from: dayjs().subtract(13, 'day').startOf('day').toISOString(),
  to: dayjs().endOf('day').toISOString(),
}

const queue: QueueSection[] = [
  {
    key: 'unassigned',
    title: 'Без відповідального',
    params: { status: 'NEW', pageSize: 5, sort: 'createdAt', order: 'asc' },
    viewAllTo: `${paths.tickets}?status=NEW`,
  },
]

export function AdminDashboard() {
  return (
    <>
      <PageHeader
        title="Головна"
        actions={
          <Button component={Link} to={paths.analytics} variant="default">
            Аналітика
          </Button>
        }
      />
      <Stack gap="lg">
        <OverviewCards period={ALL_TIME} />
        <ActionQueue
          title="Потребують уваги"
          sections={queue}
          emptyMessage="Усі заявки розподілено."
          showAuthor
          showAssignee={false}
        />
        <Grid gap="lg">
          <Grid.Col span={{ base: 12, lg: 7 }}>
            <CreatedPerDayChart period={LAST_14_DAYS} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 5 }}>
            <SpecialistWorkloadChart period={ALL_TIME} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <StatusChart period={ALL_TIME} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <PriorityChart period={ALL_TIME} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <CategoryChart period={ALL_TIME} />
          </Grid.Col>
        </Grid>
        <TicketListCard
          title="Останні заявки"
          params={{ pageSize: 5, sort: 'createdAt', order: 'desc' }}
          emptyTitle="Заявок поки немає."
          viewAllTo={paths.tickets}
          showAuthor
        />
      </Stack>
    </>
  )
}
