import { beforeAll, describe, expect, it } from 'vitest'
import { analyticsApi } from '@/entities/analytics/api/analytics-api'
import { ticketApi } from '@/entities/ticket/api/ticket-api'
import { TICKET_STATUSES } from '@/entities/ticket/model/types'
import { type Actors, apiError, as, createTicket, register, type Session, signInDemoAccounts } from './support'

let actors: Actors
let reporter: Session
let marker: string

beforeAll(async () => {
  actors = await signInDemoAccounts()
  reporter = await register('Search Reporter')
  marker = crypto.randomUUID().slice(0, 8)
  await createTicket(reporter, { title: `Scanner jams on page two ${marker}`, priority: 'LOW' })
  await createTicket(reporter, { title: `SCANNER driver is missing ${marker}`, priority: 'HIGH' })
  await createTicket(reporter, { title: `Projector is dim ${marker}`, priority: 'HIGH' })
})

describe('search and filters', () => {
  it('finds title text regardless of case', async () => {
    const page = await as(reporter, () => ticketApi.list({ q: 'scanner' }))
    expect(page.total).toBe(2)
  })

  it('finds a ticket by its exact identifier', async () => {
    const [ticket] = (await as(reporter, () => ticketApi.list({ q: 'projector' }))).items
    const page = await as(actors.admin, () => ticketApi.list({ q: ticket.id }))
    expect(page.items.map((item) => item.id)).toEqual([ticket.id])
  })

  it('combines the search with filters', async () => {
    expect((await as(reporter, () => ticketApi.list({ priority: 'HIGH' }))).total).toBe(2)
    expect((await as(reporter, () => ticketApi.list({ q: 'scanner', priority: 'HIGH' }))).total).toBe(1)
    expect((await as(reporter, () => ticketApi.list({ status: 'ASSIGNED' }))).total).toBe(0)
  })

  it('splits the result into pages', async () => {
    const first = await as(reporter, () => ticketApi.list({ pageSize: 2, page: 1, sort: 'createdAt', order: 'asc' }))
    const second = await as(reporter, () => ticketApi.list({ pageSize: 2, page: 2, sort: 'createdAt', order: 'asc' }))
    expect([first.items.length, second.items.length, first.total]).toEqual([2, 1, 3])
    expect(second.items[0].title).toContain('Projector')
  })

  it('treats SQL in the search text as plain text', async () => {
    expect((await as(reporter, () => ticketApi.list({ q: "' OR 1=1 --" }))).total).toBe(0)
    expect((await as(actors.admin, () => ticketApi.list({ q: "'; DROP TABLE tickets; --" }))).total).toBe(0)
    expect((await as(reporter, () => ticketApi.list({}))).total).toBe(3)
  })

  it('does not show the tickets of another user', async () => {
    expect((await as(actors.otherUser, () => ticketApi.list({ q: marker }))).total).toBe(0)
  })
})

describe('analytics', () => {
  it('agrees with the ticket list', async () => {
    const overview = await as(actors.admin, () => analyticsApi.overview({}))
    const statuses = await as(actors.admin, () => analyticsApi.statuses({}))
    const totals = Object.fromEntries(
      await Promise.all(
        TICKET_STATUSES.map(
          async (status) => [status, (await as(actors.admin, () => ticketApi.list({ status, pageSize: 1 }))).total] as const,
        ),
      ),
    )
    const listed = (await as(actors.admin, () => ticketApi.list({ pageSize: 1 }))).total

    expect(overview.totalTickets).toBe(listed)
    expect(Object.fromEntries(statuses.map((item) => [item.value, item.count]))).toEqual(
      Object.fromEntries(Object.entries(totals).filter(([, count]) => count > 0)),
    )
    expect(overview.openTickets).toBe(totals.NEW + totals.ASSIGNED + totals.IN_PROGRESS + totals.WAITING_FOR_USER)
    expect([overview.inProgressTickets, overview.resolvedTickets, overview.closedTickets]).toEqual([
      totals.IN_PROGRESS,
      totals.RESOLVED,
      totals.CLOSED,
    ])
  })

  it('counts the active tickets of every specialist', async () => {
    const workload = await as(actors.admin, () => analyticsApi.specialists({}))
    for (const specialist of workload) {
      const counts = await Promise.all(
        (['ASSIGNED', 'IN_PROGRESS', 'WAITING_FOR_USER'] as const).map(async (status) =>
          (await as(actors.admin, () => ticketApi.list({ assignedTo: specialist.id, status, pageSize: 1 }))).total,
        ),
      )
      expect(specialist.openTickets).toBe(counts.reduce((sum, count) => sum + count, 0))
    }
  })

  it('returns zeros for a period without tickets and rejects a reversed period', async () => {
    const future = { from: '2099-01-01T00:00:00Z', to: '2099-01-31T23:59:59Z' }
    expect((await as(actors.admin, () => analyticsApi.overview(future))).totalTickets).toBe(0)
    const reversed = { from: '2026-10-31T00:00:00Z', to: '2026-10-01T00:00:00Z' }
    expect(await apiError(as(actors.admin, () => analyticsApi.overview(reversed)))).toEqual({
      status: 400,
      code: 'INVALID_PERIOD',
    })
  })
})
