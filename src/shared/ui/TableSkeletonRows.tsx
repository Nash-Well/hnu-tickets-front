import { Skeleton, Table } from '@mantine/core'

export function TableSkeletonRows({ rows, columns }: { rows: number; columns: number }) {
  return Array.from({ length: rows }, (_, index) => (
    <Table.Tr key={`skeleton-${index}`}>
      <Table.Td colSpan={columns}>
        <Skeleton height={18} radius="sm" />
      </Table.Td>
    </Table.Tr>
  ))
}
