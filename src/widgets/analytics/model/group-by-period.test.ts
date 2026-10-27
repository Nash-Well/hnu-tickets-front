import { describe, expect, it } from 'vitest'
import type { Ticket } from '@/entities/ticket'
import { groupTicketsByCreationDate } from './group-by-period'

function created(createdAt: string) {
  return { createdAt } as Ticket
}

describe('groupTicketsByCreationDate', () => {
  it('counts tickets per day and fills empty days with zero', () => {
    const tickets = [created('2026-09-01T09:00:00'), created('2026-09-01T15:00:00'), created('2026-09-03T10:00:00')]
    expect(groupTicketsByCreationDate(tickets, '2026-09-01', '2026-09-04')).toEqual([
      { label: '01.09', count: 2 },
      { label: '02.09', count: 0 },
      { label: '03.09', count: 1 },
      { label: '04.09', count: 0 },
    ])
  })

  it('switches to months for a period longer than 92 days', () => {
    const tickets = [created('2026-01-15T09:00:00'), created('2026-03-02T09:00:00'), created('2026-03-20T09:00:00')]
    const points = groupTicketsByCreationDate(tickets, '2026-01-01', '2026-06-30')
    expect(points.map((point) => point.label)).toEqual(['01.2026', '02.2026', '03.2026', '04.2026', '05.2026', '06.2026'])
    expect(points.map((point) => point.count)).toEqual([1, 0, 2, 0, 0, 0])
  })

  it('returns no points without tickets and without a period', () => {
    expect(groupTicketsByCreationDate([])).toEqual([])
  })
})
