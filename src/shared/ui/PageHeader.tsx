import type { ReactNode } from 'react'
import { Anchor, Breadcrumbs, Group, Stack, Text, Title } from '@mantine/core'
import { Link } from 'react-router'

type Crumb = { label: string; to?: string }

type PageHeaderProps = {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  breadcrumbs?: Crumb[]
}

export function PageHeader({ title, description, actions, breadcrumbs }: PageHeaderProps) {
  return (
    <Stack gap="xs" mb="lg">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs separatorMargin={6} fz="sm">
          {breadcrumbs.map((crumb) =>
            crumb.to ? (
              <Anchor key={crumb.label} component={Link} to={crumb.to} size="sm" c="dimmed">
                {crumb.label}
              </Anchor>
            ) : (
              <Text key={crumb.label} size="sm">
                {crumb.label}
              </Text>
            ),
          )}
        </Breadcrumbs>
      )}
      <Group justify="space-between" align="flex-start" gap="md" wrap="wrap">
        <Stack gap={4} style={{ flex: '1 1 280px', minWidth: 0 }}>
          <Title order={2} fw={700} style={{ wordBreak: 'break-word' }}>
            {title}
          </Title>
          {typeof description === 'string' ? (
            <Text c="dimmed" size="sm">
              {description}
            </Text>
          ) : (
            description
          )}
        </Stack>
        {actions && (
          <Group gap="sm" wrap="wrap">
            {actions}
          </Group>
        )}
      </Group>
    </Stack>
  )
}
