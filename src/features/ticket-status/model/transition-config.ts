import type { TicketStatus } from '@/entities/ticket'

export type TransitionConfig = {
  label: string
  title: string
  description: string
  confirmLabel: string
  color: string
  variant: 'filled' | 'light' | 'default'
  commentLabel: string
  commentRequired: boolean
  commentPrefix: string
}

export function getTransitionConfig(from: TicketStatus, to: TicketStatus, isRequester: boolean): TransitionConfig {
  switch (to) {
    case 'IN_PROGRESS':
      if (from === 'RESOLVED') {
        return {
          label: 'Відкрити повторно',
          title: 'Повторне відкриття заявки',
          description: 'Заявка повернеться у статус «В роботі».',
          confirmLabel: 'Відкрити повторно',
          color: 'orange',
          variant: 'light',
          commentLabel: 'Причина повторного відкриття',
          commentRequired: false,
          commentPrefix: 'Повторне відкриття',
        }
      }
      if (from === 'WAITING_FOR_USER') {
        return {
          label: isRequester ? 'Інформацію надано' : 'Продовжити роботу',
          title: isRequester ? 'Відповідь спеціалісту' : 'Продовження роботи',
          description: 'Заявка повернеться у статус «В роботі».',
          confirmLabel: isRequester ? 'Надіслати' : 'Продовжити',
          color: 'violet',
          variant: 'filled',
          commentLabel: isRequester ? 'Ваша відповідь' : 'Коментар',
          commentRequired: false,
          commentPrefix: '',
        }
      }
      return {
        label: 'Взяти в роботу',
        title: 'Прийняти заявку в роботу',
        description: 'Заявка перейде у статус «В роботі».',
        confirmLabel: 'Взяти в роботу',
        color: 'violet',
        variant: 'filled',
        commentLabel: 'Коментар',
        commentRequired: false,
        commentPrefix: '',
      }
    case 'WAITING_FOR_USER':
      return {
        label: 'Запросити інформацію',
        title: 'Очікування відповіді користувача',
        description: 'Опишіть, яка інформація потрібна від користувача.',
        confirmLabel: 'Надіслати запит',
        color: 'yellow',
        variant: 'light',
        commentLabel: 'Запит до користувача',
        commentRequired: true,
        commentPrefix: '',
      }
    case 'RESOLVED':
      return {
        label: 'Позначити вирішеною',
        title: 'Результат виконання',
        description: 'Опишіть, що було зроблено для вирішення проблеми. Автор заявки зможе підтвердити результат.',
        confirmLabel: 'Позначити вирішеною',
        color: 'teal',
        variant: 'filled',
        commentLabel: 'Результат виконання',
        commentRequired: true,
        commentPrefix: 'Результат виконання',
      }
    case 'CLOSED':
      return {
        label: isRequester ? 'Підтвердити та закрити' : 'Закрити заявку',
        title: 'Закриття заявки',
        description: 'Після закриття заявку неможливо буде змінити.',
        confirmLabel: 'Закрити заявку',
        color: 'gray',
        variant: 'filled',
        commentLabel: 'Коментар',
        commentRequired: false,
        commentPrefix: '',
      }
    case 'CANCELLED':
      return {
        label: 'Скасувати заявку',
        title: 'Скасування заявки',
        description: 'Скасовану заявку неможливо відновити.',
        confirmLabel: 'Скасувати заявку',
        color: 'red',
        variant: 'light',
        commentLabel: 'Причина скасування',
        commentRequired: false,
        commentPrefix: 'Причина скасування',
      }
    default:
      return {
        label: 'Змінити статус',
        title: 'Зміна статусу',
        description: '',
        confirmLabel: 'Підтвердити',
        color: 'indigo',
        variant: 'light',
        commentLabel: 'Коментар',
        commentRequired: false,
        commentPrefix: '',
      }
  }
}
