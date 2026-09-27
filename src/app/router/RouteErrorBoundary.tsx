import { Button, Center, Stack, Text, Title } from '@mantine/core'
import { isRouteErrorResponse, useRouteError } from 'react-router'
import { NotFoundPage } from '@/pages/not-found'
import { paths } from '@/shared/routes'
import { SectionCard } from '@/shared/ui'

export function RouteErrorBoundary() {
  const error = useRouteError()
  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundPage />
  }
  return (
    <Center mih="100dvh" p="md">
      <SectionCard maw={480} w="100%">
        <Stack gap="sm" role="alert">
          <Title order={3}>Сталася неочікувана помилка</Title>
          <Text c="dimmed" size="sm">
            Спробуйте оновити сторінку. Якщо помилка повторюється, зверніться до адміністратора.
          </Text>
          <Button onClick={() => window.location.assign(paths.dashboard)} mt="sm">
            Оновити
          </Button>
        </Stack>
      </SectionCard>
    </Center>
  )
}
