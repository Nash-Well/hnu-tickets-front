import type { ReactNode } from 'react'
import { Button, Group } from '@mantine/core'

type ModalActionsProps = {
  onCancel: () => void
  submitLabel: ReactNode
  pending?: boolean
  cancelLabel?: string
  submitColor?: string
  submitDisabled?: boolean
}

export function ModalActions({
  onCancel,
  submitLabel,
  pending = false,
  cancelLabel = 'Скасувати',
  submitColor,
  submitDisabled = false,
}: ModalActionsProps) {
  return (
    <Group justify="flex-end" gap="sm" mt="md">
      <Button variant="default" onClick={onCancel} disabled={pending}>
        {cancelLabel}
      </Button>
      <Button type="submit" color={submitColor} loading={pending} disabled={submitDisabled}>
        {submitLabel}
      </Button>
    </Group>
  )
}
