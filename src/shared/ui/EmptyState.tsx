import type { ReactNode } from 'react'
import { Group, Stack, Text } from '@mantine/core'

type EmptyStateProps = {
  title: string
  description?: ReactNode
  action?: ReactNode
  compact?: boolean
}

export function EmptyState({ title, description, action, compact = false }: EmptyStateProps) {
  if (compact) {
    return (
      <Group justify="space-between" gap="sm" py="sm" wrap="wrap">
        <Text size="sm" c="dimmed">
          {title}
          {description && <> {description}</>}
        </Text>
        {action}
      </Group>
    )
  }
  return (
    <Stack gap={6} py={40} px="md" align="flex-start" maw={520} mx="auto" w="100%">
      <Text fw={600}>{title}</Text>
      {description && (
        <Text size="sm" c="dimmed">
          {description}
        </Text>
      )}
      {action && <div style={{ marginTop: 10 }}>{action}</div>}
    </Stack>
  )
}
