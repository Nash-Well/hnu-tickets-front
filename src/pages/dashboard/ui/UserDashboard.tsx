import { Button, Stack } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { Link } from 'react-router'
import { paths } from '@/shared/routes'
import { PageHeader } from '@/shared/ui'
import { ActionQueue, type QueueSection, RequesterSummary, TicketListCard } from '@/widgets/ticket-overview'

const queue: QueueSection[] = [
  {
    key: 'waiting',
    title: 'Потрібна ваша відповідь',
    params: { status: 'WAITING_FOR_USER', pageSize: 5, sort: 'updatedAt', order: 'desc' },
    viewAllTo: `${paths.tickets}?status=WAITING_FOR_USER`,
  },
  {
    key: 'resolved',
    title: 'Очікують підтвердження',
    params: { status: 'RESOLVED', pageSize: 5, sort: 'updatedAt', order: 'desc' },
    viewAllTo: `${paths.tickets}?status=RESOLVED`,
  },
]

export function UserDashboard() {
  return (
    <>
      <PageHeader
        title="Головна"
        actions={
          <Button component={Link} to={paths.ticketCreate} leftSection={<IconPlus size={16} />}>
            Нова заявка
          </Button>
        }
      />
      <Stack gap="lg">
        <RequesterSummary />
        <ActionQueue
          title="Потребують вашої дії"
          sections={queue}
          emptyMessage="Немає заявок, що потребують вашої дії."
        />
        <TicketListCard
          title="Останні заявки"
          params={{ pageSize: 5, sort: 'createdAt', order: 'desc' }}
          emptyTitle="У вас ще немає заявок."
          viewAllTo={paths.tickets}
        />
      </Stack>
    </>
  )
}
