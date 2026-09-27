import type { ReactNode } from 'react'
import { Button, Center, Stack, Text, Title } from '@mantine/core'
import { Link } from 'react-router'

type StatusPageProps = {
  code: string
  title: string
  description: ReactNode
  actionLabel: string
  actionTo: string
}

export function StatusPage({ code, title, description, actionLabel, actionTo }: StatusPageProps) {
  return (
    <Center mih="60vh" px="md">
      <Stack gap="sm" maw={480}>
        <Text fz={72} fw={600} c="dimmed" lh={1} className="app-numeral" aria-hidden>
          {code}
        </Text>
        <Title order={2}>{title}</Title>
        <Text c="dimmed">{description}</Text>
        <Button component={Link} to={actionTo} mt="md">
          {actionLabel}
        </Button>
      </Stack>
    </Center>
  )
}
