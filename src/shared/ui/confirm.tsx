import type { ReactNode } from 'react'
import { Text } from '@mantine/core'
import { modals } from '@mantine/modals'

type ConfirmOptions = {
  title: string
  message: ReactNode
  confirmLabel: string
  danger?: boolean
  onConfirm: () => void
}

export function confirmAction({ title, message, confirmLabel, danger = false, onConfirm }: ConfirmOptions) {
  modals.openConfirmModal({
    title,
    centered: true,
    children: <Text size="sm">{message}</Text>,
    labels: { confirm: confirmLabel, cancel: 'Скасувати' },
    confirmProps: { color: danger ? 'red' : undefined },
    onConfirm,
  })
}
