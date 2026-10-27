import { beforeAll, describe, expect, it } from 'vitest'
import { commentApi } from '@/entities/comment/api/comment-api'
import { historyApi } from '@/entities/history/api/history-api'
import { ticketApi } from '@/entities/ticket/api/ticket-api'
import type { Ticket } from '@/entities/ticket/model/types'
import { type Actors, apiError, as, createTicket, signInDemoAccounts, ticketInStatus } from './support'

let actors: Actors

beforeAll(async () => {
  actors = await signInDemoAccounts()
})

describe('ticket life cycle', () => {
  it('goes from creation to closing with every intermediate status', async () => {
    const { admin, author, assignee } = actors
    let ticket: Ticket = await createTicket(author, { title: 'No access to the shared drive', priority: 'HIGH' })
    expect(ticket).toMatchObject({ status: 'NEW', assignedTo: null, createdBy: { id: author.user.id } })

    ticket = await as(author, () => ticketApi.update(ticket.id, { title: 'No access to the shared network drive' }))
    expect(ticket.title).toBe('No access to the shared network drive')

    ticket = await as(admin, () => ticketApi.assign(ticket.id, assignee.user.id))
    expect(ticket).toMatchObject({ status: 'ASSIGNED', assignedTo: { id: assignee.user.id } })
    expect(await apiError(as(author, () => ticketApi.update(ticket.id, { title: 'Changed later' })))).toEqual({
      status: 403,
      code: 'FORBIDDEN',
    })

    ticket = await as(assignee, () => ticketApi.changeStatus(ticket.id, 'IN_PROGRESS'))
    ticket = await as(assignee, () => ticketApi.changeStatus(ticket.id, 'WAITING_FOR_USER'))
    await as(assignee, () => commentApi.create(ticket.id, 'Which drive letter is mapped?'))
    await as(author, () => commentApi.create(ticket.id, 'Drive S:'))
    ticket = await as(author, () => ticketApi.changeStatus(ticket.id, 'IN_PROGRESS'))

    ticket = await as(assignee, () => ticketApi.changeStatus(ticket.id, 'RESOLVED'))
    expect(ticket.resolvedAt).not.toBeNull()
    ticket = await as(assignee, () => ticketApi.changeStatus(ticket.id, 'IN_PROGRESS'))
    expect(ticket.resolvedAt).toBeNull()
    ticket = await as(assignee, () => ticketApi.changeStatus(ticket.id, 'RESOLVED'))
    ticket = await as(author, () => ticketApi.changeStatus(ticket.id, 'CLOSED'))
    expect(ticket).toMatchObject({ status: 'CLOSED' })
    expect(ticket.closedAt).not.toBeNull()

    const history = await as(author, () => historyApi.list(ticket.id))
    expect(history.map((entry) => [entry.action, entry.oldValue, entry.newValue])).toEqual([
      ['CREATED', null, null],
      ['UPDATED', 'No access to the shared drive', 'No access to the shared network drive'],
      ['ASSIGNED', null, assignee.user.id],
      ['STATUS_CHANGED', 'ASSIGNED', 'IN_PROGRESS'],
      ['STATUS_CHANGED', 'IN_PROGRESS', 'WAITING_FOR_USER'],
      ['STATUS_CHANGED', 'WAITING_FOR_USER', 'IN_PROGRESS'],
      ['RESOLVED', 'IN_PROGRESS', 'RESOLVED'],
      ['STATUS_CHANGED', 'RESOLVED', 'IN_PROGRESS'],
      ['RESOLVED', 'IN_PROGRESS', 'RESOLVED'],
      ['CLOSED', 'RESOLVED', 'CLOSED'],
    ])
    const [byAuthor, byAdmin, byAssignee] = [author.user.id, admin.user.id, assignee.user.id]
    expect(history.map((entry) => entry.changedBy)).toEqual([
      byAuthor,
      byAuthor,
      byAdmin,
      byAssignee,
      byAssignee,
      byAuthor,
      byAssignee,
      byAssignee,
      byAssignee,
      byAuthor,
    ])

    const comments = await as(admin, () => commentApi.list(ticket.id))
    expect(comments.map((comment) => [comment.author.name, comment.content])).toEqual([
      [assignee.user.name, 'Which drive letter is mapped?'],
      [author.user.name, 'Drive S:'],
    ])
  })

  it('keeps a closed ticket unchanged', async () => {
    const ticket = await ticketInStatus(actors, 'CLOSED')
    expect(await apiError(as(actors.admin, () => ticketApi.changeStatus(ticket.id, 'IN_PROGRESS')))).toEqual({
      status: 409,
      code: 'INVALID_STATUS_TRANSITION',
    })
    expect(await apiError(as(actors.admin, () => ticketApi.assign(ticket.id, actors.otherSpecialist.user.id)))).toEqual({
      status: 409,
      code: 'TERMINAL_TICKET',
    })
  })

  it('reassigns a ticket in progress and moves the access to the new specialist', async () => {
    const { admin, assignee, otherSpecialist } = actors
    const ticket = await ticketInStatus(actors, 'IN_PROGRESS')
    const reassigned = await as(admin, () => ticketApi.assign(ticket.id, otherSpecialist.user.id))
    expect(reassigned).toMatchObject({ status: 'IN_PROGRESS', assignedTo: { id: otherSpecialist.user.id } })

    const last = (await as(admin, () => historyApi.list(ticket.id))).at(-1)
    expect(last).toMatchObject({ action: 'REASSIGNED', oldValue: assignee.user.id, newValue: otherSpecialist.user.id })
    expect(await apiError(as(assignee, () => ticketApi.get(ticket.id)))).toEqual({ status: 403, code: 'FORBIDDEN' })
    expect(await as(otherSpecialist, () => ticketApi.get(ticket.id))).toMatchObject({ id: ticket.id })
  })

  it('assigns only users with the SPECIALIST role', async () => {
    const ticket = await createTicket(actors.author)
    expect(await apiError(as(actors.admin, () => ticketApi.assign(ticket.id, actors.otherUser.user.id)))).toEqual({
      status: 400,
      code: 'SPECIALIST_REQUIRED',
    })
    expect(await apiError(as(actors.admin, () => ticketApi.assign(ticket.id, crypto.randomUUID())))).toEqual({
      status: 400,
      code: 'INVALID_SPECIALIST',
    })
  })
})
