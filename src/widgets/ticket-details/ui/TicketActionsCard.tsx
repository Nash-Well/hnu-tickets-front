import { Divider, Stack, Text } from '@mantine/core'
import { useViewer } from '@/entities/session'
import { canAssignTicket, type Ticket } from '@/entities/ticket'
import { AssignSpecialistForm } from '@/features/ticket-assign'
import { TicketStatusActions } from '@/features/ticket-status'
import { SectionCard } from '@/shared/ui'

export function TicketActionsCard({ ticket }: { ticket: Ticket }) {
  const viewer = useViewer()
  const showAssign = canAssignTicket(ticket, viewer)
  return (
    <SectionCard title="Дії">
      <Stack gap="md">
        <div>
          <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="xs" lts={0.4}>
            Статус
          </Text>
          <TicketStatusActions ticket={ticket} />
        </div>
        {showAssign && (
          <>
            <Divider />
            <AssignSpecialistForm key={ticket.assignedTo?.id ?? 'unassigned'} ticket={ticket} />
          </>
        )}
      </Stack>
    </SectionCard>
  )
}
