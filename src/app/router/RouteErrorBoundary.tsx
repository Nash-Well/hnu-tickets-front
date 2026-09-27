import { Button, Center, Paper, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { IconAlertTriangle } from '@tabler/icons-react'
import { isRouteErrorResponse, useRouteError } from 'react-router'
import { NotFoundPage } from '@/pages/not-found'
import { paths } from '@/shared/routes'

export function RouteErrorBoundary() {
  const error = useRouteError()
  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundPage />
  }
  return (
    <Center mih="100dvh" p="md">
      <Paper withBorder radius="lg" p="xl" maw={480} w="100%">
        <Stack align="center" ta="center" gap="sm" role="alert">
          <ThemeIcon size={56} radius="xl" color="red" variant="light">
            <IconAlertTriangle size={28} />
          </ThemeIcon>
          <Title order={3}>Сталася неочікувана помилка</Title>
          <Text c="dimmed" size="sm">
            Спробуйте оновити сторінку. Якщо помилка повторюється, зверніться до адміністратора.
          </Text>
          <Button onClick={() => window.location.assign(paths.dashboard)} mt="sm">
            Оновити
          </Button>
        </Stack>
      </Paper>
    </Center>
  )
}
