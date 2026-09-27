import { Grid, Group, Stack, Tabs, Text } from '@mantine/core'
import { IconHistory, IconMessageCircle } from '@tabler/icons-react'
import { useTicketComments } from '@/entities/comment'
import { useTicketHistory } from '@/entities/history'
import { useViewer } from '@/entities/session'
import { canEditTicket, StatusBadge, type Ticket, TicketId } from '@/entities/ticket'
import { EditTicketButton } from '@/features/ticket-edit'
import { paths } from '@/shared/routes'
import { PageHeader, SectionCard } from '@/shared/ui'
import { useNameResolver } from '../model/use-name-resolver'
import { TicketActionsCard } from './TicketActionsCard'
import { TicketComments } from './TicketComments'
import { TicketHistory } from './TicketHistory'
import { TicketSummaryCard } from './TicketSummaryCard'

export function TicketDetails({ ticket }: { ticket: Ticket }) {
  const viewer = useViewer()
  const comments = useTicketComments(ticket.id)
  const history = useTicketHistory(ticket.id)
  const names = useNameResolver(ticket, comments.data)
  const listLabel = viewer.role === 'USER' ? 'Мої заявки' : viewer.role === 'SPECIALIST' ? 'Мої задачі' : 'Усі заявки'

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: listLabel, to: paths.tickets }, { label: 'Заявка' }]}
        title={ticket.title}
        description={
          <Group gap="xs">
            <TicketId id={ticket.id} withCopy />
            <StatusBadge status={ticket.status} withTooltip />
          </Group>
        }
        actions={canEditTicket(ticket, viewer) && <EditTicketButton ticket={ticket} />}
      />
      <Grid gap="xl">
        <Grid.Col span={{ base: 12, md: 8 }} order={{ base: 2, md: 1 }}>
          <Stack gap="lg">
            <SectionCard title="Опис проблеми">
              <Text size="sm" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {ticket.description}
              </Text>
            </SectionCard>
            <SectionCard flush>
              <Tabs defaultValue="comments" keepMounted={false}>
                <Tabs.List px="md">
                  <Tabs.Tab
                    value="comments"
                    leftSection={<IconMessageCircle size={16} />}
                    rightSection={
                      comments.data && (
                        <Text span size="xs" c="dimmed" className="app-tabular">
                          {comments.data.length}
                        </Text>
                      )
                    }
                  >
                    Коментарі
                  </Tabs.Tab>
                  <Tabs.Tab value="history" leftSection={<IconHistory size={16} />}>
                    Історія змін
                  </Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="comments" p="lg">
                  <TicketComments
                    ticket={ticket}
                    comments={comments.data}
                    loading={comments.isLoading}
                    error={comments.error}
                    onRetry={() => comments.refetch()}
                    names={names}
                  />
                </Tabs.Panel>
                <Tabs.Panel value="history" p="lg">
                  <TicketHistory
                    entries={history.data}
                    loading={history.isLoading}
                    error={history.error}
                    onRetry={() => history.refetch()}
                    names={names}
                  />
                </Tabs.Panel>
              </Tabs>
            </SectionCard>
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }} order={{ base: 1, md: 2 }}>
          <Stack gap="xl">
            <TicketActionsCard ticket={ticket} />
            <TicketSummaryCard ticket={ticket} />
          </Stack>
        </Grid.Col>
      </Grid>
    </>
  )
}
