import { Tooltip } from '@mantine/core'
import { ToneBadge } from '@/shared/ui'
import { statusAppearance, statusDescriptions, statusLabels } from '../model/labels'
import type { TicketStatus } from '../model/types'

type StatusBadgeProps = {
  status: TicketStatus
  withTooltip?: boolean
}

export function StatusBadge({ status, withTooltip = false }: StatusBadgeProps) {
  const badge = <ToneBadge {...statusAppearance[status]}>{statusLabels[status]}</ToneBadge>
  if (!withTooltip) {
    return badge
  }
  return (
    <Tooltip label={statusDescriptions[status]} multiline maw={260} withArrow>
      {badge}
    </Tooltip>
  )
}
