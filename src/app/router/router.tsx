import { createBrowserRouter, Navigate } from 'react-router'
import { LoginPage } from '@/pages/login'
import { NotFoundPage } from '@/pages/not-found'
import { RegisterPage } from '@/pages/register'
import { paths } from '@/shared/routes'
import { FullPageLoader } from '@/shared/ui'
import { AppLayout } from '@/widgets/app-shell'
import { GuestOnly, RequireAuth, RequireRole } from './guards'
import { RouteErrorBoundary } from './RouteErrorBoundary'

export const router = createBrowserRouter([
  {
    errorElement: <RouteErrorBoundary />,
    hydrateFallbackElement: <FullPageLoader />,
    children: [
      {
        path: paths.login,
        element: (
          <GuestOnly>
            <LoginPage />
          </GuestOnly>
        ),
      },
      {
        path: paths.register,
        element: (
          <GuestOnly>
            <RegisterPage />
          </GuestOnly>
        ),
      },
      {
        element: (
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        ),
        children: [
          { index: true, element: <Navigate to={paths.dashboard} replace /> },
          {
            path: paths.dashboard,
            lazy: () => import('@/pages/dashboard').then(({ DashboardPage }) => ({ Component: DashboardPage })),
          },
          {
            path: paths.tickets,
            lazy: () => import('@/pages/tickets').then(({ TicketsPage }) => ({ Component: TicketsPage })),
          },
          {
            element: <RequireRole roles={['USER']} />,
            children: [
              {
                path: paths.ticketCreate,
                lazy: () =>
                  import('@/pages/ticket-create').then(({ TicketCreatePage }) => ({ Component: TicketCreatePage })),
              },
            ],
          },
          {
            path: paths.ticketPattern,
            lazy: () =>
              import('@/pages/ticket-details').then(({ TicketDetailsPage }) => ({ Component: TicketDetailsPage })),
          },
          {
            path: paths.profile,
            lazy: () => import('@/pages/profile').then(({ ProfilePage }) => ({ Component: ProfilePage })),
          },
          {
            path: paths.help,
            lazy: () => import('@/pages/help').then(({ HelpPage }) => ({ Component: HelpPage })),
          },
          {
            element: <RequireRole roles={['ADMIN']} />,
            children: [
              {
                path: paths.users,
                lazy: () => import('@/pages/users').then(({ UsersPage }) => ({ Component: UsersPage })),
              },
              {
                path: paths.categories,
                lazy: () => import('@/pages/categories').then(({ CategoriesPage }) => ({ Component: CategoriesPage })),
              },
              {
                path: paths.analytics,
                lazy: () => import('@/pages/analytics').then(({ AnalyticsPage }) => ({ Component: AnalyticsPage })),
              },
            ],
          },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
])
