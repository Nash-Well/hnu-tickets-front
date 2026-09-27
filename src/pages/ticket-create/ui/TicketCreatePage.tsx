import { Box } from '@mantine/core'
import { useNavigate } from 'react-router'
import { CreateTicketForm } from '@/features/ticket-create'
import { paths } from '@/shared/routes'
import { PageHeader, SectionCard } from '@/shared/ui'

export function TicketCreatePage() {
  const navigate = useNavigate()
  return (
    <Box maw={760}>
      <PageHeader breadcrumbs={[{ label: 'Мої заявки', to: paths.tickets }, { label: 'Нова заявка' }]} title="Нова заявка" />
      <SectionCard>
        <CreateTicketForm
          onCreated={(ticket) => navigate(paths.ticket(ticket.id), { replace: true })}
          onCancel={() => navigate(-1)}
        />
      </SectionCard>
    </Box>
  )
}
