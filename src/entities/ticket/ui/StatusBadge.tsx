import { Badge, type BadgeProps, Tooltip } from '@mantine/core'
import { statusColors, statusDescriptions, statusLabels } from '../model/labels'
import type { TicketStatus } from '../model/types'

type StatusBadgeProps = Omit<BadgeProps, 'children' | 'color'> & {
  status: TicketStatus
  withTooltip?: boolean
}

export function StatusBadge({ status, withTooltip = false, ...props }: StatusBadgeProps) {
  const badge = (
    <Badge color={statusColors[status]} variant="light" radius="sm" miw="max-content" {...props}>
      {statusLabels[status]}
    </Badge>
  )
  if (!withTooltip) {
    return badge
  }
  return (
    <Tooltip label={statusDescriptions[status]} multiline maw={260} withArrow>
      {badge}
    </Tooltip>
  )
}
