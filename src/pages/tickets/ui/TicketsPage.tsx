import { Button } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { Link } from 'react-router'
import { useViewer } from '@/entities/session'
import { paths } from '@/shared/routes'
import { PageHeader } from '@/shared/ui'
import { TicketBrowser } from '@/widgets/ticket-browser'

const titleByRole = {
  USER: 'Мої заявки',
  SPECIALIST: 'Мої задачі',
  ADMIN: 'Усі заявки',
}

export function TicketsPage() {
  const viewer = useViewer()
  return (
    <>
      <PageHeader
        title={titleByRole[viewer.role]}
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
