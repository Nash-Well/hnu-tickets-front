import { Button, Stack, Text, ThemeIcon } from '@mantine/core'
import { IconAlertTriangle, IconLock, IconRefresh, IconSearchOff } from '@tabler/icons-react'
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
    return { icon: IconLock, color: 'orange', title: 'Доступ заборонено' }
  }
  if (isMissing(error)) {
    return { icon: IconSearchOff, color: 'gray', title: 'Не знайдено' }
  }
  return { icon: IconAlertTriangle, color: 'red', title: 'Не вдалося завантажити дані' }
}

export function ErrorState({ error, onRetry, compact = false }: ErrorStateProps) {
  const { icon: Icon, color, title } = describe(error)
  const canRetry = onRetry && !isMissing(error) && !(isApiError(error) && error.isForbidden)
  return (
    <Stack align="center" gap="xs" py={compact ? 'lg' : 48} px="md" ta="center" role="alert">
      <ThemeIcon size={compact ? 40 : 56} radius="xl" variant="light" color={color}>
        <Icon size={compact ? 20 : 28} stroke={1.5} />
      </ThemeIcon>
      <Text fw={600} mt="xs">
        {title}
      </Text>
      <Text size="sm" c="dimmed" maw={420}>
        {getErrorMessage(error)}
      </Text>
      {canRetry && (
        <Button variant="light" leftSection={<IconRefresh size={16} />} onClick={onRetry} mt="xs">
          Спробувати ще раз
        </Button>
      )}
    </Stack>
  )
}
