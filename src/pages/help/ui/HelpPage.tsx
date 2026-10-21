import type { ReactNode } from 'react'
import { Box, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { useViewer } from '@/entities/session'
import {
  PriorityBadge,
  priorityDescriptions,
  StatusBadge,
  statusDescriptions,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
} from '@/entities/ticket'
import { roleLabels, USER_ROLES } from '@/entities/user'
import { PageHeader, SectionCard } from '@/shared/ui'
import { type HelpTopic, roleGuides, roleSummaries, statusNextSteps, tips } from '../model/content'

function TopicGrid({ topics }: { topics: HelpTopic[] }) {
  return (
    <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }} spacing="xl" verticalSpacing="lg">
      {topics.map((topic) => (
        <div key={topic.title}>
          <Title order={4} mb={4}>
            {topic.title}
          </Title>
          <Text size="sm">{topic.text}</Text>
        </div>
      ))}
    </SimpleGrid>
  )
}

function TermList({ children }: { children: ReactNode }) {
  return (
    <Stack component="dl" gap="md" m={0}>
      {children}
    </Stack>
  )
}

function TermRow({ term, children }: { term: ReactNode; children: ReactNode }) {
  return (
    <Group align="flex-start" gap="xs" wrap="wrap">
      <Box component="dt" w={180} style={{ flexShrink: 0 }}>
        {term}
      </Box>
      <Box component="dd" m={0} style={{ flex: '1 1 260px', minWidth: 0 }}>
        {children}
      </Box>
    </Group>
  )
}

export function HelpPage() {
  const viewer = useViewer()
  return (
    <>
      <PageHeader title="Довідка" description="Як працює HNU Tickets і що ви можете тут робити" />
      <Stack gap="lg">
        <SectionCard title="Про систему">
          <Text size="sm" mb="lg" maw={760}>
            HNU Tickets — система заявок до служби технічної підтримки. Користувач описує проблему, адміністратор
            передає заявку спеціалісту, а спеціаліст вирішує її та звітує про результат. Коментарі, зміни статусу та
            відповідальних зберігаються на сторінці заявки.
          </Text>
          <TermList>
            {USER_ROLES.map((role) => (
              <TermRow
                key={role}
                term={
                  <Text size="sm" fw={600}>
                    {roleLabels[role]}
                    {role === viewer.role && (
                      <Text span size="xs" c="dimmed" fw={400}>
                        {' '}
                        (ваша роль)
                      </Text>
                    )}
                  </Text>
                }
              >
                <Text size="sm">{roleSummaries[role]}</Text>
              </TermRow>
            ))}
          </TermList>
        </SectionCard>

        <SectionCard title="Що ви можете робити" description={`Роль: ${roleLabels[viewer.role]}`}>
          <TopicGrid topics={roleGuides[viewer.role]} />
        </SectionCard>

        <SectionCard title="Шлях заявки" description="Статуси в порядку, у якому заявка зазвичай їх проходить">
          <TermList>
            {TICKET_STATUSES.map((status) => (
              <TermRow key={status} term={<StatusBadge status={status} />}>
                <Text size="sm">{statusDescriptions[status]}.</Text>
                <Text size="sm" c="dimmed">
                  {statusNextSteps[status]}
                </Text>
              </TermRow>
            ))}
          </TermList>
        </SectionCard>

        <SectionCard title="Пріоритети" description="Обирайте за тим, наскільки проблема заважає роботі">
          <TermList>
            {TICKET_PRIORITIES.map((priority) => (
              <TermRow key={priority} term={<PriorityBadge priority={priority} />}>
                <Text size="sm">{priorityDescriptions[priority]}.</Text>
              </TermRow>
            ))}
          </TermList>
        </SectionCard>

        <SectionCard title="Корисно знати" variant="secondary">
          <TopicGrid topics={tips} />
        </SectionCard>
      </Stack>
    </>
  )
}
