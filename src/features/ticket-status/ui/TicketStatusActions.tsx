import { useState } from 'react'
import { Button, Stack, Text } from '@mantine/core'
import { useViewer } from '@/entities/session'
import { getAvailableTransitions, type Ticket, type TicketStatus } from '@/entities/ticket'
import { getTransitionConfig } from '../model/transition-config'
import { StatusTransitionModal } from './StatusTransitionModal'

export function TicketStatusActions({ ticket }: { ticket: Ticket }) {
  const viewer = useViewer()
  const [target, setTarget] = useState<TicketStatus | null>(null)
  const isRequester = ticket.createdBy.id === viewer.id
  const transitions = getAvailableTransitions(ticket, viewer)

  if (transitions.length === 0) {
    return (
      <Text size="sm" c="dimmed">
        {ticket.status === 'CLOSED' || ticket.status === 'CANCELLED'
          ? 'Заявка завершена, зміна статусу недоступна.'
          : 'Для вас немає доступних дій зі статусом на цьому етапі.'}
      </Text>
    )
  }

  return (
    <>
      <Stack gap="xs">
        {transitions.map((status) => {
          const config = getTransitionConfig(ticket.status, status, isRequester)
          return (
            <Button key={status} color={config.color} variant={config.variant} fullWidth onClick={() => setTarget(status)}>
              {config.label}
            </Button>
          )
        })}
      </Stack>
      <StatusTransitionModal
        ticket={ticket}
        target={target}
        config={target ? getTransitionConfig(ticket.status, target, isRequester) : null}
        onClose={() => setTarget(null)}
      />
    </>
  )
}
