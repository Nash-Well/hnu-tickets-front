import { Box, Group, Stack, Text, Title } from '@mantine/core'
import { useViewer } from '@/entities/session'
import { RoleBadge } from '@/entities/user'
import { formatDateTime } from '@/shared/lib'
import { InfoRow, PageHeader, SectionCard, UserAvatar } from '@/shared/ui'

export function ProfilePage() {
  const viewer = useViewer()
  return (
    <Box maw={560}>
      <PageHeader title="Мій профіль" />
      <SectionCard>
        <Group gap="md" mb="md" wrap="nowrap">
          <UserAvatar name={viewer.name} size={48} />
          <div style={{ minWidth: 0 }}>
            <Title order={3}>{viewer.name}</Title>
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
            <Text size="sm" component="time" dateTime={viewer.createdAt}>
              {formatDateTime(viewer.createdAt)}
            </Text>
          </InfoRow>
          <InfoRow label="Оновлено">
            <Text size="sm" component="time" dateTime={viewer.updatedAt}>
              {formatDateTime(viewer.updatedAt)}
            </Text>
          </InfoRow>
        </Stack>
        <Text size="xs" c="dimmed" mt="md">
          Для зміни імені, email або ролі зверніться до адміністратора системи.
        </Text>
      </SectionCard>
    </Box>
  )
}
