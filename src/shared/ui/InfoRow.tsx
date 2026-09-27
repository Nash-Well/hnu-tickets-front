import type { ReactNode } from 'react'
import { Group, Text } from '@mantine/core'

type InfoRowProps = {
  label: string
  children: ReactNode
}

export function InfoRow({ label, children }: InfoRowProps) {
  return (
    <Group justify="space-between" gap="sm" wrap="nowrap" py={6}>
      <Text size="sm" c="dimmed" style={{ flexShrink: 0 }}>
        {label}
      </Text>
      <div style={{ minWidth: 0, textAlign: 'right' }}>{children}</div>
    </Group>
  )
}
