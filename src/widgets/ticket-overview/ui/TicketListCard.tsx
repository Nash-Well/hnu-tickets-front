import { Button } from '@mantine/core'
import { IconArrowRight } from '@tabler/icons-react'
import { Link } from 'react-router'
import { type TicketListParams, TicketsTable, useTickets } from '@/entities/ticket'
import { EmptyState, ErrorState, SectionCard } from '@/shared/ui'

type TicketListCardProps = {
  title: string
  params: TicketListParams
  emptyTitle: string
  viewAllTo?: string
  showAuthor?: boolean
  showAssignee?: boolean
}

export function TicketListCard({
  title,
  params,
  emptyTitle,
  viewAllTo,
  showAuthor = false,
  showAssignee = true,
}: TicketListCardProps) {
  const tickets = useTickets(params)
  const items = tickets.data?.items ?? []

  const renderContent = () => {
    if (tickets.isError && !tickets.data) {
      return <ErrorState error={tickets.error} onRetry={() => tickets.refetch()} compact />
    }
    if (tickets.isSuccess && items.length === 0) {
      return <EmptyState compact title={emptyTitle} />
    }
    return (
      <TicketsTable
        tickets={items}
        loading={tickets.isLoading}
        skeletonRows={params.pageSize ?? 5}
        showAuthor={showAuthor}
        showAssignee={showAssignee}
        compact
      />
    )
  }

  return (
    <SectionCard
      title={title}
      actions={
        viewAllTo &&
        (tickets.data?.total ?? 0) > 0 && (
          <Button component={Link} to={viewAllTo} variant="subtle" size="xs" rightSection={<IconArrowRight size={14} />}>
            Переглянути всі
          </Button>
        )
      }
    >
      {renderContent()}
    </SectionCard>
  )
}
