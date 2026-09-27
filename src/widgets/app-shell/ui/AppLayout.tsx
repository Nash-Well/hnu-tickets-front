import { AppShell, Burger, Group, NavLink, ScrollArea, Stack, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { NavLink as RouterNavLink, Outlet, useLocation } from 'react-router'
import { useEffect } from 'react'
import { useViewer } from '@/entities/session'
import { RoleBadge } from '@/entities/user'
import { ColorSchemeToggle, Logo } from '@/shared/ui'
import { getNavigationForRole } from '../model/navigation'
import { UserMenu } from './UserMenu'
import classes from './AppLayout.module.css'

export function AppLayout() {
  const viewer = useViewer()
  const [opened, { toggle, close }] = useDisclosure(false)
  const location = useLocation()
  const sections = getNavigationForRole(viewer.role)

  useEffect(() => {
    close()
  }, [location.pathname, close])

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 260, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding={{ base: 'md', md: 'xl' }}
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
          <Group gap="sm" wrap="nowrap">
            <ColorSchemeToggle />
            <UserMenu />
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="sm" aria-label="Основна навігація">
        <AppShell.Section grow component={ScrollArea}>
          <Stack gap="lg">
            {sections.map((section) => (
              <div key={section.title}>
                <Text size="xs" fw={700} c="dimmed" tt="uppercase" px="sm" mb={6} lts={0.5}>
                  {section.title}
                </Text>
                <Stack gap={2}>
                  {section.items.map((item) => (
                    <NavLink
                      key={item.label}
                      component={RouterNavLink}
                      to={item.to}
                      end={item.end}
                      label={item.label}
                      leftSection={<item.icon size={18} stroke={1.6} />}
                      className={classes.navLink}
                    />
                  ))}
                </Stack>
              </div>
            ))}
          </Stack>
        </AppShell.Section>
        <AppShell.Section className={classes.footer}>
          <Group justify="space-between" px="sm" gap="xs">
            <Text size="xs" c="dimmed">
              Ваша роль
            </Text>
            <RoleBadge role={viewer.role} />
          </Group>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main id="main-content" className={classes.main}>
        <div className={classes.content}>
          <Outlet />
        </div>
      </AppShell.Main>
    </AppShell>
  )
}
