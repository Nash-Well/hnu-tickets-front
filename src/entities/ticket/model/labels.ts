import { chartColor } from '@/shared/config'
import type { ToneBadgeAppearance } from '@/shared/ui'
import type { TicketPriority, TicketStatus } from './types'

export const statusLabels: Record<TicketStatus, string> = {
  NEW: 'Нова',
  ASSIGNED: 'Призначена',
  IN_PROGRESS: 'В роботі',
  WAITING_FOR_USER: 'Очікує користувача',
  RESOLVED: 'Вирішена',
  CLOSED: 'Закрита',
  CANCELLED: 'Скасована',
}

export const statusDescriptions: Record<TicketStatus, string> = {
  NEW: 'Заявку зареєстровано, очікує призначення спеціаліста',
  ASSIGNED: 'Заявку призначено спеціалісту',
  IN_PROGRESS: 'Спеціаліст працює над заявкою',
  WAITING_FOR_USER: 'Спеціаліст очікує відповіді від користувача',
  RESOLVED: 'Проблему вирішено, очікується підтвердження',
  CLOSED: 'Заявку закрито',
  CANCELLED: 'Заявку скасовано',
}

export const statusAppearance: Record<TicketStatus, ToneBadgeAppearance> = {
  NEW: { tone: 'neutral', variant: 'outline' },
  ASSIGNED: { tone: 'neutral', variant: 'soft' },
  IN_PROGRESS: { tone: 'accent', variant: 'soft' },
  WAITING_FOR_USER: { tone: 'accent', variant: 'outline', dashed: true },
  RESOLVED: { tone: 'positive', variant: 'soft' },
  CLOSED: { tone: 'neutral', variant: 'text', muted: true },
  CANCELLED: { tone: 'neutral', variant: 'text', muted: true, italic: true },
}

export const statusChartColor: Record<TicketStatus, string> = {
  NEW: chartColor.neutralWeak,
  ASSIGNED: chartColor.neutral,
  IN_PROGRESS: chartColor.series,
  WAITING_FOR_USER: chartColor.series,
  RESOLVED: chartColor.positive,
  CLOSED: chartColor.neutralStrong,
  CANCELLED: chartColor.neutralWeak,
}

export const priorityLabels: Record<TicketPriority, string> = {
  LOW: 'Низький',
  MEDIUM: 'Середній',
  HIGH: 'Високий',
  CRITICAL: 'Критичний',
}

export const priorityDescriptions: Record<TicketPriority, string> = {
  LOW: 'Проблема не заважає основній роботі',
  MEDIUM: 'Проблема частково впливає на роботу',
  HIGH: 'Проблема значно ускладнює виконання роботи',
  CRITICAL: 'Проблема повністю блокує роботу користувача або системи',
}

export const priorityAppearance: Record<TicketPriority, ToneBadgeAppearance> = {
  LOW: { tone: 'neutral', variant: 'text', weight: 'regular', muted: true },
  MEDIUM: { tone: 'neutral', variant: 'text', weight: 'medium' },
  HIGH: { tone: 'warning', variant: 'outline', weight: 'semibold' },
  CRITICAL: { tone: 'danger', variant: 'solid', weight: 'bold' },
}

export const priorityChartColor: Record<TicketPriority, string> = {
  LOW: chartColor.neutralWeak,
  MEDIUM: chartColor.neutral,
  HIGH: chartColor.warning,
  CRITICAL: chartColor.danger,
}
