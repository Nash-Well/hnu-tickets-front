import type { Tone } from '@/shared/config'
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

export const historyActionTone: Record<HistoryAction, Tone> = {
  CREATED: 'neutral',
  UPDATED: 'neutral',
  STATUS_CHANGED: 'neutral',
  ASSIGNED: 'neutral',
  REASSIGNED: 'neutral',
  PRIORITY_CHANGED: 'neutral',
  CATEGORY_CHANGED: 'neutral',
  CANCELLED: 'neutral',
  RESOLVED: 'positive',
  CLOSED: 'neutral',
}
