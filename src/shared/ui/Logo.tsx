import { Group, Text, ThemeIcon } from '@mantine/core'
import { IconTicket } from '@tabler/icons-react'

export function Logo() {
  return (
    <Group gap="xs" wrap="nowrap">
      <ThemeIcon size={34} radius="md" variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 135 }}>
        <IconTicket size={20} aria-hidden />
      </ThemeIcon>
      <div>
        <Text fw={700} size="sm" lh={1.1}>
          HNU Tickets
        </Text>
        <Text size="xs" c="dimmed" lh={1.1}>
          Технічна підтримка
        </Text>
      </div>
    </Group>
  )
}
