import { notifications } from '@mantine/notifications'
import { getErrorMessage } from '@/shared/api'

export function notifySuccess(message: string, title?: string) {
  notifications.show({ color: 'teal', title, message })
}

export function notifyError(error: unknown, title = 'Помилка') {
  notifications.show({ color: 'red', title, message: getErrorMessage(error) })
}

export function notifyInfo(message: string, title?: string) {
  notifications.show({ color: 'blue', title, message })
}
