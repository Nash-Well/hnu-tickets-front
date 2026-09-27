import type { ReactNode } from 'react'
import { Stack, Text, ThemeIcon } from '@mantine/core'
import { IconInbox } from '@tabler/icons-react'

type EmptyStateProps = {
  title: string
  description?: ReactNode
  icon?: ReactNode
  action?: ReactNode
  compact?: boolean
}

export function EmptyState({ title, description, icon, action, compact = false }: EmptyStateProps) {
  return (
    <Stack align="center" gap="xs" py={compact ? 'lg' : 48} px="md" ta="center">
      <ThemeIcon size={compact ? 40 : 56} radius="xl" variant="light" color="gray">
        {icon ?? <IconInbox size={compact ? 20 : 28} stroke={1.5} />}
      </ThemeIcon>
      <Text fw={600} mt="xs">
        {title}
      </Text>
      {description && (
        <Text size="sm" c="dimmed" maw={420}>
          {description}
        </Text>
      )}
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </Stack>
  )
}
