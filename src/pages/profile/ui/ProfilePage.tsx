import { Grid, Group, Stack, Text, Title } from '@mantine/core'
import { useViewer } from '@/entities/session'
import { RoleBadge } from '@/entities/user'
import { formatDateTime } from '@/shared/lib'
import { InfoRow, PageHeader, SectionCard, UserAvatar } from '@/shared/ui'

const permissionsByRole = {
  USER: [
    'Створення заявок щодо технічних проблем',
    'Перегляд власних заявок та їх статусу',
    'Коментування власних заявок',
    'Підтвердження результату та закриття заявок',
    'Скасування власних заявок',
  ],
  SPECIALIST: [
    'Перегляд призначених заявок',
    'Прийняття заявок у роботу та зміна їх статусу',
    'Запит додаткової інформації у користувача',
    'Коментування та фіксація результату виконання',
  ],
  ADMIN: [
    'Перегляд усіх заявок та історії змін',
    'Призначення та перепризначення спеціалістів',
    'Редагування заявок і керування їх статусом',
    'Керування користувачами, ролями та категоріями',
    'Перегляд аналітики та завантаженості спеціалістів',
  ],
}

export function ProfilePage() {
  const viewer = useViewer()
  return (
    <>
      <PageHeader title="Мій профіль" description="Інформація про ваш обліковий запис" />
      <Grid gap="lg">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <SectionCard>
            <Group gap="md" mb="lg" wrap="nowrap">
              <UserAvatar name={viewer.name} size={64} />
              <div style={{ minWidth: 0 }}>
                <Title order={3} fz="lg">
                  {viewer.name}
                </Title>
                <Text c="dimmed" size="sm" truncate>
                  {viewer.email}
                </Text>
              </div>
            </Group>
            <Stack gap={0}>
              <InfoRow label="Роль">
                <RoleBadge role={viewer.role} />
              </InfoRow>
              <InfoRow label="Зареєстровано">
                <Text size="sm">{formatDateTime(viewer.createdAt)}</Text>
              </InfoRow>
              <InfoRow label="Оновлено">
                <Text size="sm">{formatDateTime(viewer.updatedAt)}</Text>
              </InfoRow>
            </Stack>
            <Text size="xs" c="dimmed" mt="md">
              Для зміни імені, email або ролі зверніться до адміністратора системи.
            </Text>
          </SectionCard>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <SectionCard title="Ваші можливості">
            <Stack gap="xs" component="ul" style={{ paddingLeft: 18, margin: 0 }}>
              {permissionsByRole[viewer.role].map((permission) => (
                <Text key={permission} component="li" size="sm">
                  {permission}
                </Text>
              ))}
            </Stack>
          </SectionCard>
        </Grid.Col>
      </Grid>
    </>
  )
}
