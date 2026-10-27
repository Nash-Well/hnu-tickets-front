import { beforeAll, describe, expect, it } from 'vitest'
import { analyticsApi } from '@/entities/analytics/api/analytics-api'
import { categoryApi } from '@/entities/category/api/category-api'
import { commentApi } from '@/entities/comment/api/comment-api'
import { ticketApi } from '@/entities/ticket/api/ticket-api'
import { getAvailableTransitions } from '@/entities/ticket/model/permissions'
import { TICKET_STATUSES } from '@/entities/ticket/model/types'
import { userApi } from '@/entities/user/api/user-api'
import { ApiError } from '@/shared/api'
import { type Actors, apiError, as, createTicket, signInDemoAccounts, ticketInStatus } from './support'

let actors: Actors

beforeAll(async () => {
  actors = await signInDemoAccounts()
})

describe('ticket visibility', () => {
  it('shows a ticket to its author, its assignee and the administrator only', async () => {
    const { admin, author, otherUser, assignee, otherSpecialist } = actors
    const ticket = await ticketInStatus(actors, 'ASSIGNED')
    for (const session of [author, assignee, admin]) {
      expect(await as(session, () => ticketApi.get(ticket.id))).toMatchObject({ id: ticket.id })
    }
    for (const session of [otherUser, otherSpecialist]) {
      expect(await apiError(as(session, () => ticketApi.get(ticket.id)))).toEqual({ status: 403, code: 'FORBIDDEN' })
      expect(await apiError(as(session, () => commentApi.list(ticket.id)))).toEqual({ status: 403, code: 'FORBIDDEN' })
    }
  })

  it('limits the ticket list to the role scope', async () => {
    const { admin, author, assignee } = actors
    const own = await as(author, () => ticketApi.listAll({}))
    expect(own.length).toBeGreaterThan(0)
    expect(own.every((ticket) => ticket.createdBy.id === author.user.id)).toBe(true)

    const assigned = await as(assignee, () => ticketApi.listAll({}))
    expect(assigned.every((ticket) => ticket.assignedTo?.id === assignee.user.id)).toBe(true)

    const all = await as(admin, () => ticketApi.list({ pageSize: 1 }))
    expect(all.total).toBeGreaterThan(own.length)
  })
})

describe('role restrictions', () => {
  it('lets only users create tickets', async () => {
    for (const session of [actors.admin, actors.assignee]) {
      expect(await apiError(createTicket(session))).toEqual({ status: 403, code: 'FORBIDDEN' })
    }
  })

  it('lets only the administrator assign tickets', async () => {
    const ticket = await createTicket(actors.author)
    for (const session of [actors.author, actors.assignee]) {
      expect(await apiError(as(session, () => ticketApi.assign(ticket.id, actors.assignee.user.id)))).toEqual({
        status: 403,
        code: 'FORBIDDEN',
      })
    }
  })

  it('keeps users, categories and analytics administrative', async () => {
    for (const session of [actors.author, actors.assignee]) {
      expect(await apiError(as(session, () => userApi.list()))).toMatchObject({ status: 403 })
      expect(await apiError(as(session, () => categoryApi.create({ name: 'Unauthorized', description: '' })))).toMatchObject({
        status: 403,
      })
      expect(await apiError(as(session, () => analyticsApi.overview({})))).toMatchObject({ status: 403 })
    }
  })
})

describe('status changes', () => {
  // A rejected change leaves the ticket as it was, so one ticket per status serves all
  // rejected attempts; an accepted change consumes it and a fresh one is prepared.
  it('the server accepts exactly the transitions that the client offers, except direct assignment', async () => {
    const mismatches: string[] = []
    const rejections = new Set<number>()
    for (const from of TICKET_STATUSES) {
      let ticket = await ticketInStatus(actors, from)
      for (const [name, session] of Object.entries(actors)) {
        for (const to of TICKET_STATUSES) {
          const offered = getAvailableTransitions(ticket, session.user).includes(to)
          const accepted = await as(session, () => ticketApi.changeStatus(ticket.id, to)).then(
            () => true,
            (error: unknown) => {
              if (!(error instanceof ApiError)) {
                throw error
              }
              rejections.add(error.status)
              return false
            },
          )
          if (accepted) {
            ticket = await ticketInStatus(actors, from)
          }
          if (offered !== accepted) {
            mismatches.push(`${name}: ${from} → ${to} ${accepted ? 'accepted by the server only' : 'offered by the client only'}`)
          }
        }
      }
    }
    expect(mismatches).toEqual(['admin: NEW → ASSIGNED accepted by the server only'])
    expect([...rejections].sort()).toEqual([403, 409])
  })
})
