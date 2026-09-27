import { chartColor } from '@/shared/config'

export const barChartStyle = {
  gridColor: chartColor.grid,
  textColor: 'var(--app-text-muted)',
  tickLine: 'none' as const,
  barProps: { radius: 2 },
  tooltipAnimationDuration: 0,
}

export const TICKET_FORMS: [string, string, string] = ['заявка', 'заявки', 'заявок']
