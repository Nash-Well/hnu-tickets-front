import { Stack } from '@mantine/core'
import { paths } from '@/shared/routes'
import { PageHeader } from '@/shared/ui'
import { ActionQueue, type QueueSection, SpecialistSummary } from '@/widgets/ticket-overview'

const queue: QueueSection[] = [
  {
    key: 'assigned',
    title: 'Нові призначення',
    params: { status: 'ASSIGNED', pageSize: 5, sort: 'priority', order: 'desc' },
    viewAllTo: `${paths.tickets}?status=ASSIGNED`,
  },
  {
    key: 'in-progress',
    title: 'В роботі',
    params: { status: 'IN_PROGRESS', pageSize: 5, sort: 'updatedAt', order: 'desc' },
    viewAllTo: `${paths.tickets}?status=IN_PROGRESS`,
  },
  {
    key: 'waiting',
    title: 'Очікують відповіді користувача',
    params: { status: 'WAITING_FOR_USER', pageSize: 5, sort: 'updatedAt', order: 'desc' },
    viewAllTo: `${paths.tickets}?status=WAITING_FOR_USER`,
  },
]

export function SpecialistDashboard() {
  return (
    <>
      <PageHeader title="Головна" />
      <Stack gap="lg">
        <SpecialistSummary />
        <ActionQueue
          title="Мої задачі"
          sections={queue}
          emptyMessage="Активних задач немає."
          showAuthor
          showAssignee={false}
        />
      </Stack>
    </>
  )
}
