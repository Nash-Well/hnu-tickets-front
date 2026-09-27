import { useMemo, useState } from 'react'
import {
  ActionIcon,
  Box,
  Button,
  Grid,
  Group,
  SegmentedControl,
  Table,
  Text,
  TextInput,
  Tooltip,
  VisuallyHidden,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPencil, IconSearch, IconUserPlus } from '@tabler/icons-react'
import { useViewer } from '@/entities/session'
import { roleLabels, type User, type UserRole, USER_ROLES, useUsers } from '@/entities/user'
import { CreateUserModal, EditUserModal, RoleSelect } from '@/features/user-manage'
import { formatDate } from '@/shared/lib'
import { EmptyState, ErrorState, PageHeader, SectionCard, TableSkeletonRows, UserAvatar } from '@/shared/ui'

type RoleFilter = UserRole | 'ALL'

export function UsersPage() {
  const viewer = useViewer()
  const users = useUsers()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('ALL')
  const [editedUser, setEditedUser] = useState<User | null>(null)
  const [createOpened, createModal] = useDisclosure(false)

  const counts = useMemo(() => {
    const result: Record<RoleFilter, number> = { ALL: 0, USER: 0, SPECIALIST: 0, ADMIN: 0 }
    users.data?.forEach((user) => {
      result.ALL += 1
      result[user.role] += 1
    })
    return result
  }, [users.data])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return (users.data ?? [])
      .filter((user) => roleFilter === 'ALL' || user.role === roleFilter)
      .filter((user) => !query || user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query))
      .sort((a, b) => a.name.localeCompare(b.name, 'uk'))
  }, [roleFilter, search, users.data])

  const renderRows = () => {
    if (users.isLoading) {
      return <TableSkeletonRows rows={6} columns={5} />
    }
    return filtered.map((user) => {
      const isSelf = user.id === viewer.id
      return (
        <Table.Tr key={user.id}>
          <Table.Td>
            <Group gap="sm" wrap="nowrap">
              <UserAvatar name={user.name} size={36} />
              <div style={{ minWidth: 0 }}>
                <Text size="sm" fw={500} truncate>
                  {user.name} {isSelf && <Text span size="xs" c="dimmed">(ви)</Text>}
                </Text>
                <Text size="xs" c="dimmed" truncate>
                  {user.email}
                </Text>
              </div>
            </Group>
          </Table.Td>
          <Table.Td>
            <Tooltip label="Ви не можете змінити власну роль" disabled={!isSelf} withArrow>
              <div>
                <RoleSelect user={user} disabled={isSelf} />
              </div>
            </Tooltip>
          </Table.Td>
          <Table.Td visibleFrom="md">
            <Text size="sm" c="dimmed">
              {formatDate(user.createdAt)}
            </Text>
          </Table.Td>
          <Table.Td visibleFrom="lg">
            <Text size="sm" c="dimmed">
              {formatDate(user.updatedAt)}
            </Text>
          </Table.Td>
          <Table.Td>
            <Group justify="flex-end">
              <Tooltip label="Редагувати" withArrow>
                <ActionIcon variant="subtle" color="gray" onClick={() => setEditedUser(user)} aria-label={`Редагувати ${user.name}`}>
                  <IconPencil size={16} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Table.Td>
        </Table.Tr>
      )
    })
  }

  const renderBody = () => {
    if (users.isError) {
      return <ErrorState error={users.error} onRetry={() => users.refetch()} />
    }
    if (users.isSuccess && filtered.length === 0) {
      return (
        <EmptyState
          title="Користувачів не знайдено"
          description="Змініть параметри пошуку або фільтр ролі."
        />
      )
    }
    return (
      <Table.ScrollContainer minWidth={560}>
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Користувач</Table.Th>
              <Table.Th>Роль</Table.Th>
              <Table.Th visibleFrom="md">Зареєстровано</Table.Th>
              <Table.Th visibleFrom="lg">Оновлено</Table.Th>
              <Table.Th w={60}>
                <VisuallyHidden>Дії</VisuallyHidden>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{renderRows()}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    )
  }

  return (
    <>
      <PageHeader
        title="Користувачі"
        actions={
          <Button leftSection={<IconUserPlus size={16} />} onClick={createModal.open}>
            Новий користувач
          </Button>
        }
      />
      <Box mb="md">
        <Grid gap="sm" align="flex-end">
          <Grid.Col span={{ base: 12, md: 5 }}>
            <TextInput
              label="Пошук"
              placeholder="Ім’я або email"
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 7 }}>
            <SegmentedControl
              fullWidth
              aria-label="Фільтр за роллю"
              value={roleFilter}
              onChange={(value) => setRoleFilter(value as RoleFilter)}
              data={[
                { value: 'ALL', label: `Усі (${counts.ALL})` },
                ...USER_ROLES.map((role) => ({ value: role, label: `${roleLabels[role]} (${counts[role]})` })),
              ]}
            />
          </Grid.Col>
        </Grid>
      </Box>
      <SectionCard flush>{renderBody()}</SectionCard>
      <EditUserModal user={editedUser} onClose={() => setEditedUser(null)} />
      <CreateUserModal opened={createOpened} onClose={createModal.close} />
    </>
  )
}
