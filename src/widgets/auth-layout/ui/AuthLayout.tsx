import type { ReactNode } from 'react'
import { Box, Group, Title } from '@mantine/core'
import { ColorSchemeToggle, Logo } from '@/shared/ui'
import classes from './AuthLayout.module.css'

type AuthLayoutProps = {
  title: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthLayout({ title, children, footer }: AuthLayoutProps) {
  return (
    <div className={classes.wrapper}>
      <Group justify="flex-end" p="md" className={classes.toolbar}>
        <ColorSchemeToggle />
      </Group>
      <main className={classes.main}>
        <Box w="100%" maw={380}>
          <Box mb="xl">
            <Logo size="lg" />
          </Box>
          <div className={classes.panel}>
            <Title order={1} fz={22} mb="lg">
              {title}
            </Title>
            {children}
          </div>
          {footer && <Box mt="md">{footer}</Box>}
        </Box>
      </main>
    </div>
  )
}
