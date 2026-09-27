import type { ReactNode } from 'react'
import { Group, Text } from '@mantine/core'
import { IconArrowRight } from '@tabler/icons-react'
import type { TicketHistoryEntry } from '@/entities/history'
import {
  PriorityBadge,
  StatusBadge,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  type TicketPriority,
  type TicketStatus,
} from '@/entities/ticket'
import { truncate } from '@/shared/lib'
import type { NameResolver } from '../model/use-name-resolver'

function isStatus(value: string | null): value is TicketStatus {
  return Boolean(value && (TICKET_STATUSES as readonly string[]).includes(value))
}

function isPriority(value: string | null): value is TicketPriority {
  return Boolean(value && (TICKET_PRIORITIES as readonly string[]).includes(value))
}

function Transition({ from, to }: { from: ReactNode; to: ReactNode }) {
  return (
    <Group gap={6} wrap="wrap" mt={4}>
      {from}
      <IconArrowRight size={14} aria-label="змінено на" />
      {to}
    </Group>
  )
}

function Value({ children, strike = false }: { children: ReactNode; strike?: boolean }) {
  return (
    <Text size="sm" td={strike ? 'line-through' : undefined} c={strike ? 'dimmed' : undefined} style={{ wordBreak: 'break-word' }}>
      {children}
    </Text>
  )
}

export function HistoryChange({ entry, names }: { entry: TicketHistoryEntry; names: NameResolver }) {
  const { action, oldValue, newValue } = entry

  if (isStatus(oldValue) && isStatus(newValue)) {
    return <Transition from={<StatusBadge status={oldValue} />} to={<StatusBadge status={newValue} />} />
  }
  if (action === 'PRIORITY_CHANGED' && isPriority(oldValue) && isPriority(newValue)) {
    return <Transition from={<PriorityBadge priority={oldValue} />} to={<PriorityBadge priority={newValue} />} />
  }
  if (action === 'CATEGORY_CHANGED') {
    return <Transition from={<Value strike>{names.category(oldValue)}</Value>} to={<Value>{names.category(newValue)}</Value>} />
  }
  if (action === 'ASSIGNED') {
    return (
      <Text size="sm" mt={4}>
        Відповідальний: <b>{names.person(newValue)}</b>
      </Text>
    )
  }
  if (action === 'REASSIGNED') {
    return <Transition from={<Value strike>{names.person(oldValue)}</Value>} to={<Value>{names.person(newValue)}</Value>} />
  }
  if (action === 'UPDATED' && oldValue !== null && newValue !== null) {
    return (
      <Transition
        from={<Value strike>{truncate(oldValue, 120)}</Value>}
        to={<Value>{truncate(newValue, 120)}</Value>}
      />
    )
  }
  return null
}
