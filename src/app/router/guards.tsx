import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'
import { useCurrentUser, useViewer, ViewerProvider } from '@/entities/session'
import type { UserRole } from '@/entities/user'
import { ForbiddenPage } from '@/pages/forbidden'
import { paths } from '@/shared/routes'
import { Button, Center, Paper } from '@mantine/core'
import { ErrorState, FullPageLoader } from '@/shared/ui'

export function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation()
  const currentUser = useCurrentUser()

  if (!currentUser.isAuthenticated) {
    return <Navigate to={paths.login} replace state={{ from: `${location.pathname}${location.search}` }} />
  }
  if (currentUser.isLoading) {
    return <FullPageLoader label="Перевірка сесії…" />
  }
  if (currentUser.isError || !currentUser.data) {
    return (
      <Center mih="100dvh" p="md">
        <Paper withBorder radius="md" p="md" maw={480} w="100%">
          <ErrorState error={currentUser.error} onRetry={() => currentUser.refetch()} />
          <Center pb="md">
            <Button component="a" href={paths.login} variant="subtle">
              Перейти до входу
            </Button>
          </Center>
        </Paper>
      </Center>
    )
  }
  return <ViewerProvider viewer={currentUser.data}>{children}</ViewerProvider>
}

export function GuestOnly({ children }: { children: ReactNode }) {
  const currentUser = useCurrentUser()
  if (currentUser.isAuthenticated) {
    return <Navigate to={paths.dashboard} replace />
  }
  return children
}

export function RequireRole({ roles }: { roles: UserRole[] }) {
  const viewer = useViewer()
  return roles.includes(viewer.role) ? <Outlet /> : <ForbiddenPage />
}
