import { Button, Grid, Stack } from '@mantine/core'
import { IconChartBar } from '@tabler/icons-react'
import { Link } from 'react-router'
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
import { TicketListCard } from '@/widgets/ticket-overview'
import { dayjs } from '@/shared/lib'

const ALL_TIME = {}

const LAST_14_DAYS = {
  from: dayjs().subtract(13, 'day').startOf('day').toISOString(),
  to: dayjs().endOf('day').toISOString(),
}

export function AdminDashboard({ name }: { name: string }) {
  return (
    <>
      <PageHeader
        title={`Вітаємо, ${name}!`}
        description="Загальний стан служби технічної підтримки"
        actions={
          <Button component={Link} to={paths.analytics} variant="light" leftSection={<IconChartBar size={16} />}>
            Детальна аналітика
          </Button>
        }
      />
      <Stack gap="lg">
        <OverviewCards period={ALL_TIME} withClosedRate />
        <Grid gap="lg">
          <Grid.Col span={{ base: 12, lg: 7 }}>
            <StatusChart period={ALL_TIME} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 5 }}>
            <PriorityChart period={ALL_TIME} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 7 }}>
            <CreatedPerDayChart period={LAST_14_DAYS} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 5 }}>
            <SpecialistWorkloadChart period={ALL_TIME} />
          </Grid.Col>
          <Grid.Col span={12}>
            <CategoryChart period={ALL_TIME} />
          </Grid.Col>
        </Grid>
        <TicketListCard
          title="Нові заявки без відповідального"
          description="Заявки зі статусом «Нова», які очікують призначення спеціаліста"
          params={{ status: 'NEW', pageSize: 5, sort: 'createdAt', order: 'asc' }}
          emptyTitle="Усі заявки розподілено"
          viewAllTo={`${paths.tickets}?status=NEW`}
          showAuthor
          showAssignee={false}
        />
        <TicketListCard
          title="Останні заявки"
          params={{ pageSize: 5, sort: 'createdAt', order: 'desc' }}
          emptyTitle="Заявок поки немає"
          viewAllTo={paths.tickets}
          showAuthor
        />
      </Stack>
    </>
  )
}
