import { useEffect } from 'react'
import { AppShell, Burger, Divider, Group, NavLink, ScrollArea, Stack } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { NavLink as RouterNavLink, Outlet, useLocation } from 'react-router'
import { useViewer } from '@/entities/session'
import { ColorSchemeToggle, Logo } from '@/shared/ui'
import { getNavigationForRole } from '../model/navigation'
import classes from './AppLayout.module.css'
import { UserMenu } from './UserMenu'

export function AppLayout() {
  const viewer = useViewer()
  const [opened, { toggle, close }] = useDisclosure(false)
  const location = useLocation()
  const items = getNavigationForRole(viewer.role)

  useEffect(() => {
    close()
  }, [location.pathname, close])

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{ width: 232, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding={{ base: 'md', md: 'xl' }}
      classNames={{ header: classes.header, navbar: classes.navbar, main: classes.main }}
    >
      <a href="#main-content" className={classes.skipLink}>
        Перейти до основного вмісту
      </a>
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between" wrap="nowrap">
          <Group gap="sm" wrap="nowrap">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
              aria-label={opened ? 'Закрити меню' : 'Відкрити меню'}
            />
            <Logo />
          </Group>
          <Group gap="xs" wrap="nowrap">
            <ColorSchemeToggle />
            <UserMenu />
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="sm" aria-label="Основна навігація">
        <AppShell.Section grow component={ScrollArea}>
          <Stack gap={2}>
            {items.map((item) => (
              <div key={item.label}>
                {item.dividerBefore && <Divider my="sm" color="var(--app-border-subtle)" />}
                <NavLink
                  component={RouterNavLink}
                  to={item.to}
                  end={item.end}
                  label={item.label}
                  leftSection={<item.icon size={17} stroke={1.5} />}
                  className={classes.navLink}
                />
              </div>
            ))}
          </Stack>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main id="main-content">
        <div className={classes.content}>
          <Outlet />
        </div>
      </AppShell.Main>
    </AppShell>
  )
}
