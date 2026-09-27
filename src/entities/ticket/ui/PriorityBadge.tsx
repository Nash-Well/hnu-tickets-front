import { ToneBadge } from '@/shared/ui'
import { priorityAppearance, priorityLabels } from '../model/labels'
import type { TicketPriority } from '../model/types'

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return <ToneBadge {...priorityAppearance[priority]}>{priorityLabels[priority]}</ToneBadge>
}
