import type { ReactNode } from 'react'
import { MantineProvider } from '@mantine/core'
import { DatesProvider } from '@mantine/dates'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import { QueryClientProvider } from '@tanstack/react-query'
import '@/shared/lib/dates'
import { queryClient } from './query-client'
import { theme } from './theme'
import { UnauthorizedHandler } from './UnauthorizedHandler'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <DatesProvider settings={{ locale: 'uk', firstDayOfWeek: 1 }}>
        <QueryClientProvider client={queryClient}>
          <ModalsProvider labels={{ confirm: 'Підтвердити', cancel: 'Скасувати' }}>
            <Notifications position="top-right" limit={4} autoClose={4500} />
            <UnauthorizedHandler />
            {children}
          </ModalsProvider>
        </QueryClientProvider>
      </DatesProvider>
    </MantineProvider>
  )
}
