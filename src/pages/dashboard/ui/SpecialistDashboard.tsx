import { Button, Stack } from '@mantine/core'
import { IconListCheck } from '@tabler/icons-react'
import { Link } from 'react-router'
import { paths } from '@/shared/routes'
import { PageHeader } from '@/shared/ui'
import { SpecialistSummary, TicketListCard } from '@/widgets/ticket-overview'

export function SpecialistDashboard({ name }: { name: string }) {
  return (
    <>
      <PageHeader
        title={`Вітаємо, ${name}!`}
        description="Ваші задачі в службі технічної підтримки"
        actions={
          <Button component={Link} to={paths.tickets} variant="light" leftSection={<IconListCheck size={16} />}>
            Усі мої задачі
          </Button>
        }
      />
      <Stack gap="lg">
        <SpecialistSummary />
        <TicketListCard
          title="Нові призначення"
          description="Прийміть ці заявки в роботу"
          params={{ status: 'ASSIGNED', pageSize: 5, sort: 'priority', order: 'desc' }}
          emptyTitle="Нових призначень немає"
          viewAllTo={`${paths.tickets}?status=ASSIGNED`}
          showAuthor
          showAssignee={false}
        />
        <TicketListCard
          title="В роботі"
          params={{ status: 'IN_PROGRESS', pageSize: 5, sort: 'updatedAt', order: 'desc' }}
          emptyTitle="Немає заявок у роботі"
          viewAllTo={`${paths.tickets}?status=IN_PROGRESS`}
          showAuthor
          showAssignee={false}
        />
        <TicketListCard
          title="Очікують відповіді користувача"
          params={{ status: 'WAITING_FOR_USER', pageSize: 5, sort: 'updatedAt', order: 'desc' }}
          emptyTitle="Немає заявок, що очікують користувача"
          viewAllTo={`${paths.tickets}?status=WAITING_FOR_USER`}
          showAuthor
          showAssignee={false}
        />
      </Stack>
    </>
  )
}
