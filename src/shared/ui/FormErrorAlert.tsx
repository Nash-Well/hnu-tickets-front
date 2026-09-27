import { Alert } from '@mantine/core'
import { getErrorMessage } from '@/shared/api'
import { toneColor } from '@/shared/config'

export function FormErrorAlert({ error, visible = true }: { error: unknown; visible?: boolean }) {
  if (!error || !visible) {
    return null
  }
  return (
    <Alert color={toneColor.danger} variant="light" role="alert" py="xs">
      {getErrorMessage(error)}
    </Alert>
  )
}
