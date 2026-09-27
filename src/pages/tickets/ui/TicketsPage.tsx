import { Button } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { Link } from 'react-router'
import { useViewer } from '@/entities/session'
import { paths } from '@/shared/routes'
import { PageHeader } from '@/shared/ui'
import { TicketBrowser } from '@/widgets/ticket-browser'

const headerByRole = {
  USER: { title: 'Мої заявки', description: 'Заявки, які ви створили' },
  SPECIALIST: { title: 'Мої задачі', description: 'Заявки, призначені вам для виконання' },
  ADMIN: { title: 'Усі заявки', description: 'Перегляд, пошук і розподіл заявок між спеціалістами' },
}

export function TicketsPage() {
  const viewer = useViewer()
  const header = headerByRole[viewer.role]
  return (
    <>
      <PageHeader
        title={header.title}
        description={header.description}
        actions={
          viewer.role === 'USER' && (
            <Button component={Link} to={paths.ticketCreate} leftSection={<IconPlus size={16} />}>
              Нова заявка
            </Button>
          )
        }
      />
      <TicketBrowser />
    </>
  )
}
