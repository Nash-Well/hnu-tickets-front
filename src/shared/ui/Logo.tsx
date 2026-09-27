import { Group, Text } from '@mantine/core'
import classes from './Logo.module.css'

export function Logo({ size = 'md' }: { size?: 'md' | 'lg' }) {
  return (
    <Group gap={10} wrap="nowrap">
      <span className={[classes.mark, size === 'lg' && classes.markLarge].filter(Boolean).join(' ')} aria-hidden>
        HNU
      </span>
      <div>
        <Text className={classes.name} fz={size === 'lg' ? 'lg' : 'md'}>
          HNU Tickets
        </Text>
        <Text size="xs" c="dimmed" lh={1.2}>
          Технічна підтримка
        </Text>
      </div>
    </Group>
  )
}
