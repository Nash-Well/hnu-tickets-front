import { Divider, Stack, Text } from '@mantine/core'
import { PriorityBadge, StatusBadge, type Ticket } from '@/entities/ticket'
import { formatDateTime } from '@/shared/lib'
import { InfoRow, SectionCard } from '@/shared/ui'

function Person({ name }: { name: string }) {
  return (
    <Text size="sm" truncate>
      {name}
    </Text>
  )
}

export function TicketSummaryCard({ ticket }: { ticket: Ticket }) {
  return (
    <SectionCard title="Інформація" variant="secondary">
      <Stack gap={0}>
        <InfoRow label="Статус">
          <StatusBadge status={ticket.status} withTooltip />
        </InfoRow>
        <InfoRow label="Пріоритет">
          <PriorityBadge priority={ticket.priority} />
        </InfoRow>
        <InfoRow label="Категорія">
          <Text size="sm">
            {ticket.category.name}
          </Text>
        </InfoRow>
        <Divider my={6} color="var(--app-border-subtle)" />
        <InfoRow label="Автор">
          <Person name={ticket.createdBy.name} />
        </InfoRow>
        <InfoRow label="Відповідальний">
          {ticket.assignedTo ? (
            <Person name={ticket.assignedTo.name} />
          ) : (
            <Text size="sm" c="dimmed" fs="italic">
              Не призначено
            </Text>
          )}
        </InfoRow>
        <Divider my={6} color="var(--app-border-subtle)" />
        <InfoRow label="Створено">
          <Text size="sm" component="time" dateTime={ticket.createdAt ?? undefined}>{formatDateTime(ticket.createdAt)}</Text>
        </InfoRow>
        <InfoRow label="Оновлено">
          <Text size="sm" component="time" dateTime={ticket.updatedAt ?? undefined}>{formatDateTime(ticket.updatedAt)}</Text>
        </InfoRow>
        {ticket.resolvedAt && (
          <InfoRow label="Вирішено">
            <Text size="sm" component="time" dateTime={ticket.resolvedAt ?? undefined}>{formatDateTime(ticket.resolvedAt)}</Text>
          </InfoRow>
        )}
        {ticket.closedAt && (
          <InfoRow label="Закрито">
            <Text size="sm" component="time" dateTime={ticket.closedAt ?? undefined}>{formatDateTime(ticket.closedAt)}</Text>
          </InfoRow>
        )}
      </Stack>
    </SectionCard>
  )
}
