import { beforeAll, describe, expect, it } from 'vitest'
import { categoryApi } from '@/entities/category/api/category-api'
import { commentApi } from '@/entities/comment/api/comment-api'
import { ticketApi } from '@/entities/ticket/api/ticket-api'
import type { TicketListParams } from '@/entities/ticket/model/types'
import { ticketFormSchema } from '@/entities/ticket/model/validation'
import { http } from '@/shared/api'
import { type Actors, anyCategoryId, apiError, as, createTicket, outcome, signInDemoAccounts } from './support'

let actors: Actors

beforeAll(async () => {
  actors = await signInDemoAccounts()
})

describe('ticket fields', () => {
  it.each([
    ['2 characters', 'ab'],
    ['3 characters', 'abc'],
    ['2 characters inside spaces', '   ab   '],
    ['255 characters', 't'.repeat(255)],
    ['256 characters', 't'.repeat(256)],
  ])('client and server agree on a title of %s', async (_, title) => {
    const categoryId = await anyCategoryId(actors.author)
    const clientAccepts = ticketFormSchema.safeParse({ title, description: 'Text', categoryId, priority: 'LOW' }).success
    expect(await outcome(createTicket(actors.author, { title }))).toBe(clientAccepts ? 'accepted' : 'INVALID_TITLE')
  })

  it.each([
    ['a blank description', { description: '   ' }, 'INVALID_DESCRIPTION'],
    ['an unknown category', { categoryId: crypto.randomUUID() }, 'INVALID_CATEGORY'],
    ['an unknown priority', { priority: 'URGENT' as never }, 'INVALID_PRIORITY'],
  ])('rejects %s', async (_, payload, code) => {
    expect(await apiError(createTicket(actors.author, payload))).toEqual({ status: 400, code })
  })
})

describe('comments', () => {
  it.each([
    ['an empty comment', '', 'INVALID_COMMENT'],
    ['1 character', '+', 'accepted'],
    ['5000 Cyrillic characters (10000 bytes)', 'ї'.repeat(5000), 'accepted'],
    ['5001 characters', 'x'.repeat(5001), 'INVALID_COMMENT'],
  ])('handles %s', async (_, content, expected) => {
    const ticket = await createTicket(actors.author)
    expect(await outcome(as(actors.author, () => commentApi.create(ticket.id, content)))).toBe(expected)
  })
})

describe('request errors', () => {
  it.each<[string, TicketListParams, string]>([
    ['an unknown status', { status: 'DONE' as never }, 'INVALID_STATUS'],
    ['an unknown sort field', { sort: 'title' as never }, 'INVALID_SORT'],
    ['an unknown order', { order: 'up' as never }, 'INVALID_ORDER'],
    ['a malformed date', { createdFrom: 'yesterday' }, 'INVALID_FILTER'],
  ])('rejects a list filter with %s', async (_, params, code) => {
    expect(await apiError(as(actors.admin, () => ticketApi.list(params)))).toEqual({ status: 400, code })
  })

  it('distinguishes a malformed identifier from a missing ticket', async () => {
    expect(await apiError(as(actors.admin, () => ticketApi.get('not-a-uuid')))).toEqual({ status: 400, code: 'INVALID_ID' })
    expect(await apiError(as(actors.admin, () => ticketApi.get(crypto.randomUUID())))).toEqual({
      status: 404,
      code: 'TICKET_NOT_FOUND',
    })
  })

  it('rejects unknown fields in the request body', async () => {
    const ticket = await createTicket(actors.author)
    const attempt = as(actors.author, () => http.patch(`/tickets/${ticket.id}`, { title: 'Valid title', status: 'CLOSED' }))
    expect(await apiError(attempt)).toEqual({ status: 400, code: 'INVALID_JSON' })
  })

  it('answers an unknown route with a structured error', async () => {
    expect(await apiError(as(actors.admin, () => http.get('/reports')))).toEqual({ status: 404, code: 'ROUTE_NOT_FOUND' })
  })
})

describe('categories', () => {
  it('keeps category names unique and protects categories in use', async () => {
    const name = `Test category ${crypto.randomUUID().slice(0, 8)}`
    const category = await as(actors.admin, () => categoryApi.create({ name, description: '' }))
    expect(await apiError(as(actors.admin, () => categoryApi.create({ name, description: '' })))).toEqual({
      status: 409,
      code: 'CATEGORY_NAME_EXISTS',
    })
    await createTicket(actors.author, { categoryId: category.id })
    expect(await apiError(as(actors.admin, () => categoryApi.remove(category.id)))).toEqual({
      status: 409,
      code: 'CATEGORY_IN_USE',
    })
  })
})
