import type { ReactNode } from 'react'
import { Skeleton } from '@mantine/core'
import { IconChartBar } from '@tabler/icons-react'
import { EmptyState } from './EmptyState'
import { ErrorState } from './ErrorState'
import { SectionCard } from './SectionCard'

type ChartCardProps = {
  title: string
  description?: string
  loading?: boolean
  error?: unknown
  isEmpty?: boolean
  onRetry?: () => void
  height?: number
  children: ReactNode
}

export function ChartCard({
  title,
  description,
  loading = false,
  error,
  isEmpty = false,
  onRetry,
  height = 280,
  children,
}: ChartCardProps) {
  const renderContent = () => {
    if (loading) {
      return <Skeleton height={height} radius="md" />
    }
    if (error) {
      return <ErrorState error={error} onRetry={onRetry} compact />
    }
    if (isEmpty) {
      return (
        <EmptyState
          compact
          icon={<IconChartBar size={20} stroke={1.5} />}
          title="Немає даних"
          description="За обраний період даних для відображення немає."
        />
      )
    }
    return children
  }

  return (
    <SectionCard title={title} description={description} h="100%">
      {renderContent()}
    </SectionCard>
  )
}
