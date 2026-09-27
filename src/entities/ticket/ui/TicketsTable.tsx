import { Anchor, Table, Text, Tooltip } from '@mantine/core'
import { Link, useNavigate } from 'react-router'
import type { SortOrder, Ticket, TicketSortField } from '../model/types'
import { PriorityBadge } from './PriorityBadge'
import { StatusBadge } from './StatusBadge'
import { TicketId } from './TicketId'
import { formatDateTime, formatRelative } from '@/shared/lib'
import { paths } from '@/shared/routes'
import { TableSkeletonRows } from '@/shared/ui'
import { SortableHeader } from './SortableHeader'
import classes from './TicketsTable.module.css'

type TicketsTableProps = {
  tickets: Ticket[]
  loading?: boolean
  skeletonRows?: number
  sort?: TicketSortField
  order?: SortOrder
  onSort?: (field: TicketSortField) => void
  showAuthor?: boolean
  showAssignee?: boolean
  compact?: boolean
}

function Assignee({ ticket }: { ticket: Ticket }) {
  if (!ticket.assignedTo) {
    return (
      <Text size="sm" c="dimmed" fs="italic">
        Не призначено
      </Text>
    )
  }
  return (
    <Text size="sm" truncate>
      {ticket.assignedTo.name}
    </Text>
  )
}

export function TicketsTable({
  tickets,
  loading = false,
  skeletonRows = 8,
  sort,
  order,
  onSort,
  showAuthor = false,
  showAssignee = true,
  compact = false,
}: TicketsTableProps) {
  const navigate = useNavigate()
  const columnCount = 6 + Number(showAuthor) + Number(showAssignee) - Number(compact)

  const rows = loading
    ? TableSkeletonRows({ rows: skeletonRows, columns: columnCount })
    : tickets.map((ticket) => (
        <Table.Tr
          key={ticket.id}
          className={classes.row}
          onClick={(event) => {
            if (!(event.target as HTMLElement).closest('a, button')) {
              navigate(paths.ticket(ticket.id))
            }
          }}
        >
          <Table.Td>
            <TicketId id={ticket.id} />
          </Table.Td>
          <Table.Td className={classes.titleCell}>
            <Anchor component={Link} to={paths.ticket(ticket.id)} fw={500} size="sm" c="var(--mantine-color-text)" lineClamp={2}>
              {ticket.title}
            </Anchor>
            {showAuthor && (
              <Text size="xs" c="dimmed" hiddenFrom="md">
                {ticket.createdBy.name}
              </Text>
            )}
          </Table.Td>
          <Table.Td visibleFrom="md" className={classes.categoryCell}>
            <Text size="sm" truncate title={ticket.category.name}>
              {ticket.category.name}
            </Text>
          </Table.Td>
          <Table.Td>
            <PriorityBadge priority={ticket.priority} />
          </Table.Td>
          <Table.Td>
            <StatusBadge status={ticket.status} />
          </Table.Td>
          {showAuthor && (
            <Table.Td visibleFrom="md">
              <Text size="sm" truncate>
                {ticket.createdBy.name}
              </Text>
            </Table.Td>
          )}
          {showAssignee && (
            <Table.Td visibleFrom="lg">
              <Assignee ticket={ticket} />
            </Table.Td>
          )}
          {!compact && (
            <Table.Td visibleFrom="sm">
              <Tooltip label={formatRelative(ticket.createdAt)} withArrow>
                <Text size="sm" c="dimmed" component="time" dateTime={ticket.createdAt} style={{ whiteSpace: 'nowrap' }}>
                  {formatDateTime(ticket.createdAt)}
                </Text>
              </Tooltip>
            </Table.Td>
          )}
        </Table.Tr>
      ))

  return (
    <Table.ScrollContainer minWidth={compact ? 520 : 640}>
      <Table highlightOnHover={!loading} aria-busy={loading}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={110}>ID</Table.Th>
            <Table.Th>Назва</Table.Th>
            <Table.Th visibleFrom="md">Категорія</Table.Th>
            <SortableHeader field="priority" sort={sort} order={order} onSort={onSort}>
              Пріоритет
            </SortableHeader>
            <SortableHeader field="status" sort={sort} order={order} onSort={onSort}>
              Статус
            </SortableHeader>
            {showAuthor && <Table.Th visibleFrom="md">Автор</Table.Th>}
            {showAssignee && <Table.Th visibleFrom="lg">Відповідальний</Table.Th>}
            {!compact && (
              <SortableHeader field="createdAt" sort={sort} order={order} onSort={onSort} visibleFrom="sm">
                Створено
              </SortableHeader>
            )}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}
