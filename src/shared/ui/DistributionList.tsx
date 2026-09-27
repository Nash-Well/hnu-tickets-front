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
    <Stack gap="sm" component="ul" aria-label={ariaLabel} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {items.map((item) => {
        const percent = total ? (item.value / total) * 100 : 0
        return (
          <li key={item.key}>
            <Group justify="space-between" gap="xs" mb={4} wrap="nowrap">
              <Text size="sm" truncate>
                {item.label}
              </Text>
              <Text size="sm" fw={600} style={{ whiteSpace: 'nowrap' }}>
                {item.value}{' '}
                <Text span size="xs" c="dimmed" fw={400}>
                  ({formatPercent(percent)})
                </Text>
              </Text>
            </Group>
            <Progress value={percent} color={item.color} size="md" radius="xl" aria-hidden />
          </li>
        )
      })}
    </Stack>
  )
}
