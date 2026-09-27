import type { ReactNode } from 'react'
import { Group, Paper, type PaperProps, Text } from '@mantine/core'

type SectionCardProps = PaperProps & {
  title?: ReactNode
  description?: ReactNode
  actions?: ReactNode
  children: ReactNode
}

export function SectionCard({ title, description, actions, children, ...paperProps }: SectionCardProps) {
  return (
    <Paper withBorder radius="md" p="lg" {...paperProps}>
      {(title || actions) && (
        <Group justify="space-between" align="flex-start" mb="md" gap="sm" wrap="wrap">
          <div style={{ minWidth: 0 }}>
            {title && (
              <Text fw={600} size="md">
                {title}
              </Text>
            )}
            {description && (
              <Text size="xs" c="dimmed" mt={2}>
                {description}
              </Text>
            )}
          </div>
          {actions}
        </Group>
      )}
      {children}
    </Paper>
  )
}
