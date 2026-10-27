import { beforeAll, describe, expect, it } from 'vitest'
import { commentApi } from '@/entities/comment/api/comment-api'
import { historyApi } from '@/entities/history/api/history-api'
import { ticketApi } from '@/entities/ticket/api/ticket-api'
import { userApi } from '@/entities/user/api/user-api'
import { type Actors, apiError, as, createTicket, register, signIn, signInDemoAccounts, ticketInStatus } from './support'

let actors: Actors

beforeAll(async () => {
  actors = await signInDemoAccounts()
})

// Each it.fails test states the required behaviour. It passes while the defect is present
// and starts failing once the defect is fixed, which is the signal to drop the marker.
describe('known defects', () => {
  it.fails('rejects a direct NEW → ASSIGNED status change that leaves the ticket without a specialist', async () => {
    const ticket = await createTicket(actors.author)
    expect(await apiError(as(actors.admin, () => ticketApi.changeStatus(ticket.id, 'ASSIGNED')))).toMatchObject({
      status: 409,
    })
  })

  it.fails('withdraws specialist rights from a token issued before the role was changed to USER', async () => {
    const account = await register('Former Specialist')
    await as(actors.admin, () => userApi.updateRole(account.user.id, 'SPECIALIST'))
    const specialist = await signIn(account.user.email)
    const ticket = await createTicket(actors.author)
    await as(actors.admin, () => ticketApi.assign(ticket.id, account.user.id))
    await as(actors.admin, () => userApi.updateRole(account.user.id, 'USER'))

    expect(await apiError(as(specialist, () => ticketApi.changeStatus(ticket.id, 'IN_PROGRESS')))).toMatchObject({
      status: 403,
    })
  })

  it.fails('sorts the specialist dashboard by priority from critical to low', async () => {
    const specialist = await register('Priority Specialist')
    await as(actors.admin, () => userApi.updateRole(specialist.user.id, 'SPECIALIST'))
    for (const priority of ['LOW', 'CRITICAL', 'MEDIUM', 'HIGH'] as const) {
      const ticket = await createTicket(actors.author, { priority })
      await as(actors.admin, () => ticketApi.assign(ticket.id, specialist.user.id))
    }
    const session = await signIn(specialist.user.email)
    // The same parameters as SpecialistDashboard uses for its "assigned" list.
    const page = await as(session, () => ticketApi.list({ status: 'ASSIGNED', pageSize: 5, sort: 'priority', order: 'desc' }))
    expect(page.items.map((ticket) => ticket.priority)).toEqual(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'])
  })

  it.fails('searches for the percent sign as a character, not as a wildcard', async () => {
    const reporter = await register('Wildcard Reporter')
    await createTicket(reporter, { title: 'Disk is 100% full' })
    await createTicket(reporter, { title: 'Mouse wheel is broken' })
    expect((await as(reporter, () => ticketApi.list({ q: '%' }))).total).toBe(1)
  })
})

describe('documented boundaries', () => {
  it('a new login after a role change receives the new role', async () => {
    const account = await register('Demoted Specialist')
    await as(actors.admin, () => userApi.updateRole(account.user.id, 'SPECIALIST'))
    await as(actors.admin, () => userApi.updateRole(account.user.id, 'USER'))
    expect((await signIn(account.user.email)).user.role).toBe('USER')
  })

  it('keeps a committed status change when the following comment request fails', async () => {
    const { assignee } = actors
    const ticket = await ticketInStatus(actors, 'IN_PROGRESS')
    // The status dialog sends the status first and the explanation second, as two requests.
    await as(assignee, () => ticketApi.changeStatus(ticket.id, 'RESOLVED'))
    expect(await apiError(as(assignee, () => commentApi.create(ticket.id, 'x'.repeat(5001))))).toEqual({
      status: 400,
      code: 'INVALID_COMMENT',
    })

    expect((await as(assignee, () => ticketApi.get(ticket.id))).status).toBe('RESOLVED')
    expect((await as(assignee, () => historyApi.list(ticket.id))).at(-1)?.action).toBe('RESOLVED')
    expect(await as(assignee, () => commentApi.list(ticket.id))).toEqual([])
  })
})
