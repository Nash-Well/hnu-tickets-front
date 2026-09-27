import { Badge } from '@mantine/core'
import { roleColors, roleLabels } from '../model/roles'
import type { UserRole } from '../model/types'

export function RoleBadge({ role }: { role: UserRole }) {
  return (
    <Badge color={roleColors[role]} variant="light" radius="sm" miw="max-content">
      {roleLabels[role]}
    </Badge>
  )
}
