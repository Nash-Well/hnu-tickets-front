import type { ReactNode } from 'react'
import { Group, Table, Text, UnstyledButton } from '@mantine/core'
import { IconChevronDown, IconChevronUp, IconSelector } from '@tabler/icons-react'
import type { SortOrder, TicketSortField } from '../model/types'

type SortableHeaderProps = {
  field: TicketSortField
  sort?: TicketSortField
  order?: SortOrder
  onSort?: (field: TicketSortField) => void
  children: ReactNode
  visibleFrom?: 'xs' | 'sm' | 'md' | 'lg'
}

export function SortableHeader({ field, sort, order, onSort, children, visibleFrom }: SortableHeaderProps) {
  if (!onSort) {
    return <Table.Th visibleFrom={visibleFrom}>{children}</Table.Th>
  }
  const active = sort === field
  const Icon = active ? (order === 'asc' ? IconChevronUp : IconChevronDown) : IconSelector
  return (
    <Table.Th
      visibleFrom={visibleFrom}
      aria-sort={active ? (order === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      <UnstyledButton onClick={() => onSort(field)} style={{ width: '100%' }}>
        <Group gap={4} wrap="nowrap" justify="space-between">
          <Text fw={700} size="sm">
            {children}
          </Text>
          <Icon size={14} stroke={1.8} aria-hidden />
        </Group>
      </UnstyledButton>
    </Table.Th>
  )
}
