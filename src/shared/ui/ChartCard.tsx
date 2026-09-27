import type { ReactNode } from 'react'
import { Skeleton } from '@mantine/core'
import { EmptyState } from './EmptyState'
import { ErrorState } from './ErrorState'
import { SectionCard } from './SectionCard'

type ChartCardProps = {
  title: string
  description?: string
  loading?: boolean
  error?: unknown
  isEmpty?: boolean
  emptyMessage?: string
  onRetry?: () => void
  height?: number
  footer?: ReactNode
  children: ReactNode
}

export function ChartCard({
  title,
  description,
  loading = false,
  error,
  isEmpty = false,
  emptyMessage = 'За обраний період даних немає.',
  onRetry,
  height = 240,
  footer,
  children,
}: ChartCardProps) {
  const renderContent = () => {
    if (loading) {
      return <Skeleton height={height} radius="sm" />
    }
    if (error) {
      return <ErrorState error={error} onRetry={onRetry} compact />
    }
    if (isEmpty) {
      return <EmptyState compact title={emptyMessage} />
    }
    return children
  }

  return (
    <SectionCard title={title} description={description} h="100%">
      {renderContent()}
      {footer && !loading && !error && !isEmpty && footer}
    </SectionCard>
  )
}
