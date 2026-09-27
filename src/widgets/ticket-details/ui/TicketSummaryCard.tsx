import { Divider, Group, Stack, Text } from '@mantine/core'
import { PriorityBadge, StatusBadge, type Ticket } from '@/entities/ticket'
import { formatDateTime } from '@/shared/lib'
import { InfoRow, SectionCard, UserAvatar } from '@/shared/ui'

function Person({ name }: { name: string }) {
  return (
    <Group gap={6} wrap="nowrap" justify="flex-end">
      <UserAvatar name={name} size={22} />
      <Text size="sm" fw={500} truncate>
        {name}
      </Text>
    </Group>
  )
}

export function TicketSummaryCard({ ticket }: { ticket: Ticket }) {
  return (
    <SectionCard title="Інформація">
      <Stack gap={0}>
        <InfoRow label="Статус">
          <StatusBadge status={ticket.status} withTooltip />
        </InfoRow>
        <InfoRow label="Пріоритет">
          <PriorityBadge priority={ticket.priority} />
        </InfoRow>
        <InfoRow label="Категорія">
          <Text size="sm" fw={500}>
            {ticket.category.name}
          </Text>
        </InfoRow>
        <Divider my="xs" />
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
        <Divider my="xs" />
        <InfoRow label="Створено">
          <Text size="sm">{formatDateTime(ticket.createdAt)}</Text>
        </InfoRow>
        <InfoRow label="Оновлено">
          <Text size="sm">{formatDateTime(ticket.updatedAt)}</Text>
        </InfoRow>
        {ticket.resolvedAt && (
          <InfoRow label="Вирішено">
            <Text size="sm">{formatDateTime(ticket.resolvedAt)}</Text>
          </InfoRow>
        )}
        {ticket.closedAt && (
          <InfoRow label="Закрито">
            <Text size="sm">{formatDateTime(ticket.closedAt)}</Text>
          </InfoRow>
        )}
      </Stack>
    </SectionCard>
  )
}
