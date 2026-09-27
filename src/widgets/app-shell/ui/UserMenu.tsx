import { Box, Group, Menu, Text, UnstyledButton } from '@mantine/core'
import { IconChevronDown, IconLogout, IconUserCircle } from '@tabler/icons-react'
import { useNavigate } from 'react-router'
import { useViewer } from '@/entities/session'
import { roleLabels } from '@/entities/user'
import { useLogout } from '@/features/auth/logout'
import { paths } from '@/shared/routes'
import { UserAvatar } from '@/shared/ui'

export function UserMenu() {
  const viewer = useViewer()
  const logout = useLogout()
  const navigate = useNavigate()
  return (
    <Menu position="bottom-end" width={220} withArrow shadow="md">
      <Menu.Target>
        <UnstyledButton aria-label="Меню користувача" style={{ borderRadius: 8, padding: 4 }}>
          <Group gap="xs" wrap="nowrap">
            <UserAvatar name={viewer.name} size={32} />
            <Box visibleFrom="sm">
              <Text size="sm" fw={600} lh={1.2}>
                {viewer.name}
              </Text>
              <Text size="xs" c="dimmed" lh={1.2}>
                {roleLabels[viewer.role]}
              </Text>
            </Box>
            <IconChevronDown size={14} aria-hidden />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>{viewer.email}</Menu.Label>
        <Menu.Item leftSection={<IconUserCircle size={16} />} onClick={() => navigate(paths.profile)}>
          Мій профіль
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item color="red" leftSection={<IconLogout size={16} />} onClick={logout}>
          Вийти
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
