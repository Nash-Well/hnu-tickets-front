import { Group, Progress, Stack, Text } from '@mantine/core'
import { formatPercent } from '@/shared/lib'

export type DistributionItem = {
  key: string
  label: string
  value: number
  color: string
}

type DistributionListProps = {
  items: DistributionItem[]
  ariaLabel: string
}

export function DistributionList({ items, ariaLabel }: DistributionListProps) {
  const total = items.reduce((sum, item) => sum + item.value, 0)
  return (
    <Stack gap={10} component="ul" aria-label={ariaLabel} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {items.map((item) => {
        const percent = total ? (item.value / total) * 100 : 0
        return (
          <li key={item.key}>
            <Group justify="space-between" gap="xs" mb={4} wrap="nowrap">
              <Text size="sm" truncate>
                {item.label}
              </Text>
              <Text size="sm" className="app-tabular" style={{ whiteSpace: 'nowrap' }}>
                <Text span fw={600}>
                  {item.value}
                </Text>{' '}
                <Text span size="xs" c="dimmed">
                  {formatPercent(percent)}
                </Text>
              </Text>
            </Group>
            <Progress value={percent} color={item.color} size={6} radius="xs" aria-hidden />
          </li>
        )
      })}
    </Stack>
  )
}
