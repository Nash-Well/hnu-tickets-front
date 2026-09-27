import type { Ticket } from '@/entities/ticket'
import { dayjs } from '@/shared/lib'

export type CreatedPoint = { label: string; count: number }

const MAX_DAILY_BUCKETS = 92

export function groupTicketsByCreationDate(tickets: Ticket[], from?: string, to?: string): CreatedPoint[] {
  if (tickets.length === 0 && (!from || !to)) {
    return []
  }
  const dates = tickets.map((ticket) => dayjs(ticket.createdAt))
  const start = from ? dayjs(from) : dates.reduce((min, date) => (date.isBefore(min) ? date : min), dates[0])
  const end = to ? dayjs(to) : dayjs()
  const unit = end.diff(start, 'day') > MAX_DAILY_BUCKETS ? 'month' : 'day'
  const format = unit === 'month' ? 'MM.YYYY' : 'DD.MM'
  const counts = new Map<string, number>()
  dates.forEach((date) => {
    const key = date.startOf(unit).format(format)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  })
  const points: CreatedPoint[] = []
  for (let cursor = start.startOf(unit); !cursor.isAfter(end, unit); cursor = cursor.add(1, unit)) {
    const key = cursor.format(format)
    points.push({ label: key, count: counts.get(key) ?? 0 })
  }
  return points
}
