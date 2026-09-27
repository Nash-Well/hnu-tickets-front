import { Text } from '@mantine/core'
import { roleLabels } from '../model/roles'
import type { UserRole } from '../model/types'

export function RoleBadge({ role }: { role: UserRole }) {
  return (
    <Text span size="sm" c="dimmed">
      {roleLabels[role]}
    </Text>
  )
}
