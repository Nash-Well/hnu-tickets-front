import { Button, Stack } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { Link } from 'react-router'
import { paths } from '@/shared/routes'
import { PageHeader } from '@/shared/ui'
import { RequesterSummary, TicketListCard } from '@/widgets/ticket-overview'

export function UserDashboard({ name }: { name: string }) {
  return (
    <>
      <PageHeader
        title={`Вітаємо, ${name}!`}
        description="Стан ваших звернень до служби технічної підтримки"
        actions={
          <Button component={Link} to={paths.ticketCreate} leftSection={<IconPlus size={16} />}>
            Нова заявка
          </Button>
        }
      />
      <Stack gap="lg">
        <RequesterSummary />
        <TicketListCard
          title="Потрібна ваша відповідь"
          description="Спеціаліст очікує від вас додаткову інформацію"
          params={{ status: 'WAITING_FOR_USER', pageSize: 5, sort: 'updatedAt', order: 'desc' }}
          emptyTitle="Немає заявок, що очікують вашої відповіді"
          viewAllTo={`${paths.tickets}?status=WAITING_FOR_USER`}
        />
        <TicketListCard
          title="Очікують підтвердження"
          description="Проблему вирішено — перевірте результат і закрийте заявку"
          params={{ status: 'RESOLVED', pageSize: 5, sort: 'updatedAt', order: 'desc' }}
          emptyTitle="Немає вирішених заявок, що очікують підтвердження"
          viewAllTo={`${paths.tickets}?status=RESOLVED`}
        />
        <TicketListCard
          title="Останні заявки"
          params={{ pageSize: 5, sort: 'createdAt', order: 'desc' }}
          emptyTitle="У вас ще немає заявок"
          emptyDescription="Створіть першу заявку, щоб повідомити про технічну проблему."
          viewAllTo={paths.tickets}
        />
      </Stack>
    </>
  )
}
