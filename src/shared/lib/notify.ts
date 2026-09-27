import { notifications } from '@mantine/notifications'
import { getErrorMessage } from '@/shared/api'
import { toneColor } from '@/shared/config'

export function notifySuccess(message: string, title?: string) {
  notifications.show({ color: toneColor.positive, title, message })
}

export function notifyError(error: unknown, title = 'Помилка') {
  notifications.show({ color: toneColor.danger, title, message: getErrorMessage(error) })
}

export function notifyInfo(message: string, title?: string) {
  notifications.show({ color: toneColor.neutral, title, message })
}
