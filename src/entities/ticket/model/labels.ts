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

export const statusColors: Record<TicketStatus, string> = {
  NEW: 'blue',
  ASSIGNED: 'cyan',
  IN_PROGRESS: 'violet',
  WAITING_FOR_USER: 'yellow',
  RESOLVED: 'teal',
  CLOSED: 'gray',
  CANCELLED: 'red',
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

export const priorityLabels: Record<TicketPriority, string> = {
  LOW: 'Низький',
  MEDIUM: 'Середній',
  HIGH: 'Високий',
  CRITICAL: 'Критичний',
}

export const priorityColors: Record<TicketPriority, string> = {
  LOW: 'gray',
  MEDIUM: 'blue',
  HIGH: 'orange',
  CRITICAL: 'red',
}

export const priorityDescriptions: Record<TicketPriority, string> = {
  LOW: 'Проблема не заважає основній роботі',
  MEDIUM: 'Проблема частково впливає на роботу',
  HIGH: 'Проблема значно ускладнює виконання роботи',
  CRITICAL: 'Проблема повністю блокує роботу користувача або системи',
}
