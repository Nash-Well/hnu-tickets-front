import type { ReactNode } from 'react'
import { Group, Paper, Skeleton, Text, ThemeIcon } from '@mantine/core'

type StatCardProps = {
  label: string
  value: ReactNode
  icon: ReactNode
  color?: string
  hint?: ReactNode
  loading?: boolean
}

export function StatCard({ label, value, icon, color = 'indigo', hint, loading = false }: StatCardProps) {
  return (
    <Paper withBorder radius="md" p="md">
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <div style={{ minWidth: 0 }}>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600} lts={0.4}>
            {label}
          </Text>
          {loading ? (
            <Skeleton height={30} width={72} mt={8} />
          ) : (
            <Text fz={28} fw={700} lh={1.2} mt={4} style={{ whiteSpace: 'nowrap' }}>
              {value}
            </Text>
          )}
        </div>
        <ThemeIcon size={40} radius="md" variant="light" color={color}>
          {icon}
        </ThemeIcon>
      </Group>
      {hint && (
        <Text size="xs" c="dimmed" mt="sm">
          {hint}
        </Text>
      )}
    </Paper>
  )
}
