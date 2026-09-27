import type { HistoryAction } from './types'

export const historyActionLabels: Record<HistoryAction, string> = {
  CREATED: 'Створено заявку',
  UPDATED: 'Оновлено дані заявки',
  STATUS_CHANGED: 'Змінено статус',
  ASSIGNED: 'Призначено спеціаліста',
  REASSIGNED: 'Перепризначено спеціаліста',
  PRIORITY_CHANGED: 'Змінено пріоритет',
  CATEGORY_CHANGED: 'Змінено категорію',
  CANCELLED: 'Заявку скасовано',
  RESOLVED: 'Заявку вирішено',
  CLOSED: 'Заявку закрито',
}

export const historyActionColors: Record<HistoryAction, string> = {
  CREATED: 'blue',
  UPDATED: 'gray',
  STATUS_CHANGED: 'violet',
  ASSIGNED: 'cyan',
  REASSIGNED: 'cyan',
  PRIORITY_CHANGED: 'orange',
  CATEGORY_CHANGED: 'grape',
  CANCELLED: 'red',
  RESOLVED: 'teal',
  CLOSED: 'dark',
}
