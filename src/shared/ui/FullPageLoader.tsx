import { Center, Loader, Stack, Text } from '@mantine/core'

export function FullPageLoader({ label = 'Завантаження…' }: { label?: string }) {
  return (
    <Center component="output" mih="60vh" aria-live="polite">
      <Stack align="center" gap="sm">
        <Loader />
        <Text size="sm" c="dimmed">
          {label}
        </Text>
      </Stack>
    </Center>
  )
}
