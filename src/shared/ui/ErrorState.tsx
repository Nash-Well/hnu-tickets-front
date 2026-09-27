import { Button, Group, Stack, Text } from '@mantine/core'
import { IconRefresh } from '@tabler/icons-react'
import { getErrorMessage, isApiError } from '@/shared/api'

type ErrorStateProps = {
  error: unknown
  onRetry?: () => void
  compact?: boolean
}

function isMissing(error: unknown) {
  return isApiError(error) && (error.isNotFound || error.code === 'INVALID_ID')
}

function describe(error: unknown) {
  if (isApiError(error) && error.isForbidden) {
    return 'Доступ заборонено'
  }
  if (isMissing(error)) {
    return 'Не знайдено'
  }
  return 'Не вдалося завантажити дані'
}

export function ErrorState({ error, onRetry, compact = false }: ErrorStateProps) {
  const canRetry = onRetry && !isMissing(error) && !(isApiError(error) && error.isForbidden)
  const retry = canRetry && (
    <Button variant="default" size="xs" leftSection={<IconRefresh size={14} />} onClick={onRetry}>
      Спробувати ще раз
    </Button>
  )
  if (compact) {
    return (
      <Group justify="space-between" gap="sm" py="sm" wrap="wrap" role="alert">
        <Text size="sm">
          <Text span fw={600} c="var(--app-tone-danger-fg)">
            {describe(error)}.
          </Text>{' '}
          <Text span c="dimmed">
            {getErrorMessage(error)}
          </Text>
        </Text>
        {retry}
      </Group>
    )
  }
  return (
    <Stack gap={6} py={40} px="md" align="flex-start" maw={520} mx="auto" w="100%" role="alert">
      <Text fw={600} c="var(--app-tone-danger-fg)">
        {describe(error)}
      </Text>
      <Text size="sm" c="dimmed">
        {getErrorMessage(error)}
      </Text>
      {retry && <div style={{ marginTop: 10 }}>{retry}</div>}
    </Stack>
  )
}
