import { Button, Group, Pagination, Paper, Select, Text } from '@mantine/core'
import { IconPlus, IconSearchOff } from '@tabler/icons-react'
import { Link } from 'react-router'
import { useViewer } from '@/entities/session'
import { TicketsTable, useTickets } from '@/entities/ticket'
import { TicketFiltersBar, useTicketListParams } from '@/features/ticket-filters'
import { paths } from '@/shared/routes'
import { EmptyState, ErrorState } from '@/shared/ui'

const PAGE_SIZE_OPTIONS = ['10', '20', '50', '100']

const paginationLabels = {
  first: 'Перша сторінка',
  previous: 'Попередня сторінка',
  next: 'Наступна сторінка',
  last: 'Остання сторінка',
}

const emptyStateByRole = {
  USER: {
    title: 'У вас ще немає заявок',
    description: 'Створіть заявку, щоб повідомити службу підтримки про технічну проблему.',
  },
  SPECIALIST: {
    title: 'Немає призначених заявок',
    description: 'Коли адміністратор призначить вам заявку, вона з’явиться тут.',
  },
  ADMIN: {
    title: 'Заявок поки немає',
    description: 'Тут з’являться всі заявки, створені користувачами.',
  },
}

export function TicketBrowser() {
  const viewer = useViewer()
  const params = useTicketListParams()
  const tickets = useTickets(params.apiParams)
  const isAdmin = viewer.role === 'ADMIN'
  const hasFilters = params.activeFilterCount > 0
  const items = tickets.data?.items ?? []
  const total = tickets.data?.total ?? 0
  const pageCount = Math.max(1, Math.ceil(total / params.pageSize))
  const rangeStart = total === 0 ? 0 : (params.page - 1) * params.pageSize + 1
  const rangeEnd = Math.min(params.page * params.pageSize, total)

  const renderBody = () => {
    if (tickets.isError && !tickets.data) {
      return <ErrorState error={tickets.error} onRetry={() => tickets.refetch()} />
    }
    if (tickets.isSuccess && items.length === 0) {
      return hasFilters ? (
        <EmptyState
          icon={<IconSearchOff size={28} stroke={1.5} />}
          title="Нічого не знайдено"
          description="Спробуйте змінити параметри пошуку або скинути фільтри."
          action={
            <Button variant="light" onClick={params.resetFilters}>
              Скинути фільтри
            </Button>
          }
        />
      ) : (
        <EmptyState
          title={emptyStateByRole[viewer.role].title}
          description={emptyStateByRole[viewer.role].description}
          action={
            viewer.role === 'USER' && (
              <Button component={Link} to={paths.ticketCreate} leftSection={<IconPlus size={16} />}>
                Створити заявку
              </Button>
            )
          }
        />
      )
    }
    return (
      <TicketsTable
        tickets={items}
        loading={tickets.isLoading}
        sort={params.sort}
        order={params.order}
        onSort={params.setSort}
        showAuthor={viewer.role !== 'USER'}
        showAssignee={viewer.role !== 'SPECIALIST'}
      />
    )
  }

  return (
    <>
      <TicketFiltersBar params={params} showSpecialistFilter={isAdmin} />
      <Paper withBorder radius="md" style={{ opacity: tickets.isPlaceholderData ? 0.6 : 1, transition: 'opacity 150ms' }}>
        {renderBody()}
        {total > 0 && (
          <Group justify="space-between" p="md" gap="sm" wrap="wrap" style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}>
            <Group gap="sm">
              <Text size="sm" c="dimmed" aria-live="polite">
                {rangeStart}–{rangeEnd} з {total}
              </Text>
              <Select
                aria-label="Кількість заявок на сторінці"
                data={PAGE_SIZE_OPTIONS}
                value={String(params.pageSize)}
                onChange={(value) => value && params.setPageSize(Number(value))}
                allowDeselect={false}
                size="xs"
                w={80}
              />
            </Group>
            <Pagination
              total={pageCount}
              value={Math.min(params.page, pageCount)}
              onChange={params.setPage}
              size="sm"
              withEdges
              getControlProps={(control) => ({ 'aria-label': paginationLabels[control] })}
            />
          </Group>
        )}
      </Paper>
    </>
  )
}
