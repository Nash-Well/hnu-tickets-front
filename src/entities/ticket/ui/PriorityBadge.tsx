import { Badge, type BadgeProps } from '@mantine/core'
import { IconAlertTriangleFilled, IconArrowDown, IconArrowUp, IconEqual } from '@tabler/icons-react'
import { priorityColors, priorityLabels } from '../model/labels'
import type { TicketPriority } from '../model/types'

const priorityIcons = {
  LOW: IconArrowDown,
  MEDIUM: IconEqual,
  HIGH: IconArrowUp,
  CRITICAL: IconAlertTriangleFilled,
} satisfies Record<TicketPriority, unknown>

type PriorityBadgeProps = Omit<BadgeProps, 'children' | 'color'> & {
  priority: TicketPriority
}

export function PriorityBadge({ priority, ...props }: PriorityBadgeProps) {
  const Icon = priorityIcons[priority]
  return (
    <Badge
      color={priorityColors[priority]}
      variant="light"
      radius="sm" miw="max-content"
      leftSection={<Icon size={12} aria-hidden style={{ display: 'block' }} />}
      {...props}
    >
      {priorityLabels[priority]}
    </Badge>
  )
}
