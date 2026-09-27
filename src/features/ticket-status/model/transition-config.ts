import type { TicketStatus } from '@/entities/ticket'

export type TransitionEmphasis = 'primary' | 'secondary' | 'danger'

export type TransitionConfig = {
  label: string
  title: string
  description: string
  confirmLabel: string
  emphasis: TransitionEmphasis
  commentLabel: string
  commentRequired: boolean
  commentPrefix: string
}

const base = { commentLabel: 'Коментар', commentRequired: false, commentPrefix: '' }

export function getTransitionConfig(from: TicketStatus, to: TicketStatus, isRequester: boolean): TransitionConfig {
  switch (to) {
    case 'IN_PROGRESS':
      if (from === 'RESOLVED') {
        return {
          ...base,
          label: 'Відкрити повторно',
          title: 'Повторне відкриття заявки',
          description: 'Заявка повернеться у статус «В роботі».',
          confirmLabel: 'Відкрити повторно',
          emphasis: 'secondary',
          commentLabel: 'Причина повторного відкриття',
          commentPrefix: 'Повторне відкриття',
        }
      }
      if (from === 'WAITING_FOR_USER') {
        return {
          ...base,
          label: isRequester ? 'Інформацію надано' : 'Продовжити роботу',
          title: isRequester ? 'Відповідь спеціалісту' : 'Продовження роботи',
          description: 'Заявка повернеться у статус «В роботі».',
          confirmLabel: isRequester ? 'Надіслати' : 'Продовжити',
          emphasis: 'primary',
          commentLabel: isRequester ? 'Ваша відповідь' : 'Коментар',
        }
      }
      return {
        ...base,
        label: 'Взяти в роботу',
        title: 'Прийняти заявку в роботу',
        description: 'Заявка перейде у статус «В роботі».',
        confirmLabel: 'Взяти в роботу',
        emphasis: 'primary',
      }
    case 'WAITING_FOR_USER':
      return {
        ...base,
        label: 'Запросити інформацію',
        title: 'Очікування відповіді користувача',
        description: 'Опишіть, яка інформація потрібна від користувача.',
        confirmLabel: 'Надіслати запит',
        emphasis: 'secondary',
        commentLabel: 'Запит до користувача',
        commentRequired: true,
      }
    case 'RESOLVED':
      return {
        ...base,
        label: 'Позначити вирішеною',
        title: 'Результат виконання',
        description: 'Опишіть, що було зроблено для вирішення проблеми. Автор заявки зможе підтвердити результат.',
        confirmLabel: 'Позначити вирішеною',
        emphasis: 'primary',
        commentLabel: 'Результат виконання',
        commentRequired: true,
        commentPrefix: 'Результат виконання',
      }
    case 'CLOSED':
      return {
        ...base,
        label: isRequester ? 'Підтвердити та закрити' : 'Закрити заявку',
        title: 'Закриття заявки',
        description: 'Після закриття заявку неможливо буде змінити.',
        confirmLabel: 'Закрити заявку',
        emphasis: 'primary',
      }
    case 'CANCELLED':
      return {
        ...base,
        label: 'Скасувати заявку',
        title: 'Скасування заявки',
        description: 'Скасовану заявку неможливо відновити.',
        confirmLabel: 'Скасувати заявку',
        emphasis: 'danger',
        commentLabel: 'Причина скасування',
        commentPrefix: 'Причина скасування',
      }
    default:
      return {
        ...base,
        label: 'Змінити статус',
        title: 'Зміна статусу',
        description: '',
        confirmLabel: 'Підтвердити',
        emphasis: 'secondary',
      }
  }
}
