import { Grid, List, Text, ThemeIcon } from '@mantine/core'
import { IconBulb } from '@tabler/icons-react'
import { useNavigate } from 'react-router'
import { PriorityBadge, priorityDescriptions, TICKET_PRIORITIES } from '@/entities/ticket'
import { CreateTicketForm } from '@/features/ticket-create'
import { paths } from '@/shared/routes'
import { PageHeader, SectionCard } from '@/shared/ui'

export function TicketCreatePage() {
  const navigate = useNavigate()
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: 'Мої заявки', to: paths.tickets }, { label: 'Нова заявка' }]}
        title="Нова заявка"
        description="Опишіть технічну проблему — спеціаліст служби підтримки зв’яжеться з вами."
      />
      <Grid gap="lg">
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <SectionCard>
            <CreateTicketForm
              onCreated={(ticket) => navigate(paths.ticket(ticket.id), { replace: true })}
              onCancel={() => navigate(-1)}
            />
          </SectionCard>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <SectionCard title="Як обрати пріоритет">
            <List spacing="sm" listStyleType="none" p={0}>
              {[...TICKET_PRIORITIES].reverse().map((priority) => (
                <List.Item key={priority}>
                  <PriorityBadge priority={priority} />
                  <Text size="xs" c="dimmed" mt={4}>
                    {priorityDescriptions[priority]}
                  </Text>
                </List.Item>
              ))}
            </List>
          </SectionCard>
          <SectionCard mt="lg">
            <ThemeIcon variant="light" color="yellow" radius="xl" mb="sm">
              <IconBulb size={18} />
            </ThemeIcon>
            <Text size="sm" fw={600} mb={4}>
              Порада
            </Text>
            <Text size="sm" c="dimmed">
              Вкажіть, коли виникла проблема, що саме не працює та які дії ви вже виконали. Це допоможе вирішити
              заявку швидше.
            </Text>
          </SectionCard>
        </Grid.Col>
      </Grid>
    </>
  )
}
