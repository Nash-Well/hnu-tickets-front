import { Button, Skeleton, Stack } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import { Link, useParams } from 'react-router'
import { useTicket } from '@/entities/ticket'
import { paths } from '@/shared/routes'
import { ErrorState, SectionCard } from '@/shared/ui'
import { TicketDetails } from '@/widgets/ticket-details'

function TicketDetailsSkeleton() {
  return (
    <Stack gap="lg" aria-busy>
      <Skeleton height={16} width={180} />
      <Skeleton height={34} width="60%" />
      <Skeleton height={200} radius="md" />
      <Skeleton height={260} radius="md" />
    </Stack>
  )
}

export function TicketDetailsPage() {
  const { ticketId = '' } = useParams()
  const ticket = useTicket(ticketId)

  if (ticket.isLoading) {
    return <TicketDetailsSkeleton />
  }
  if (ticket.isError || !ticket.data) {
    return (
      <SectionCard>
        <ErrorState error={ticket.error} onRetry={() => ticket.refetch()} />
        <Stack align="flex-start" px="md" maw={520} mx="auto">
          <Button component={Link} to={paths.tickets} variant="subtle" leftSection={<IconArrowLeft size={16} />}>
            Повернутися до списку заявок
          </Button>
        </Stack>
      </SectionCard>
    )
  }
  return <TicketDetails ticket={ticket.data} />
}
