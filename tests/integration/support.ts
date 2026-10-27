import { categoryApi } from '@/entities/category/api/category-api'
import { sessionApi } from '@/entities/session/api/session-api'
import { ticketApi } from '@/entities/ticket/api/ticket-api'
import type { CreateTicketPayload, Ticket, TicketStatus } from '@/entities/ticket/model/types'
import type { User } from '@/entities/user/model/types'
import { ApiError, tokenStorage } from '@/shared/api'

export const PASSWORD = 'password123'

export type Session = { token: string; user: User }

export type Actors = {
  admin: Session
  author: Session
  otherUser: Session
  assignee: Session
  otherSpecialist: Session
}

export async function signIn(email: string, password = PASSWORD): Promise<Session> {
  const { accessToken, user } = await sessionApi.login({ email, password })
  return { token: accessToken, user }
}

export async function register(name = 'Test User'): Promise<Session> {
  const email = `test.${crypto.randomUUID().slice(0, 12)}@example.com`
  const { accessToken, user } = await sessionApi.register({ name, email, password: PASSWORD })
  return { token: accessToken, user }
}

// Seeded by scripts/seed.sql of the server.
export async function signInDemoAccounts(): Promise<Actors> {
  const [admin, author, otherUser, assignee, otherSpecialist] = await Promise.all(
    ['admin', 'user', 'user2', 'specialist', 'specialist2'].map((name) => signIn(`${name}@example.com`)),
  )
  return { admin, author, otherUser, assignee, otherSpecialist }
}

// The HTTP client reads the token synchronously before its first await,
// so switching it right before each call is enough for sequential tests.
export function as<T>(session: Session, call: () => Promise<T>): Promise<T> {
  tokenStorage.set(session.token)
  return call()
}

export async function apiError(promise: Promise<unknown>) {
  const error = await promise.then(
    () => null,
    (caught: unknown) => caught,
  )
  if (!(error instanceof ApiError)) {
    throw new Error(`Expected an API error, got ${error === null ? 'a successful response' : String(error)}`)
  }
  return { status: error.status, code: error.code }
}

export function outcome(promise: Promise<unknown>) {
  return promise.then(
    () => 'accepted',
    (error: unknown) => {
      if (error instanceof ApiError) {
        return error.code
      }
      throw error
    },
  )
}

let categoryId: string | undefined

export async function anyCategoryId(session: Session) {
  categoryId ??= (await as(session, () => categoryApi.list()))[0].id
  return categoryId
}

export async function createTicket(author: Session, payload: Partial<CreateTicketPayload> = {}) {
  const category = await anyCategoryId(author)
  return as(author, () =>
    ticketApi.create({
      title: 'Printer in room 214 does not print',
      description: 'The printer shows a paper jam',
      categoryId: category,
      priority: 'MEDIUM',
      ...payload,
    }),
  )
}

const pathTo: Record<TicketStatus, [keyof Actors, TicketStatus][]> = {
  NEW: [],
  ASSIGNED: [],
  IN_PROGRESS: [['assignee', 'IN_PROGRESS']],
  WAITING_FOR_USER: [['assignee', 'IN_PROGRESS'], ['assignee', 'WAITING_FOR_USER']],
  RESOLVED: [['assignee', 'IN_PROGRESS'], ['assignee', 'RESOLVED']],
  CLOSED: [['assignee', 'IN_PROGRESS'], ['assignee', 'RESOLVED'], ['author', 'CLOSED']],
  CANCELLED: [['assignee', 'IN_PROGRESS'], ['author', 'CANCELLED']],
}

export async function ticketInStatus(actors: Actors, status: TicketStatus): Promise<Ticket> {
  let ticket = await createTicket(actors.author)
  if (status === 'NEW') {
    return ticket
  }
  ticket = await as(actors.admin, () => ticketApi.assign(ticket.id, actors.assignee.user.id))
  for (const [actor, next] of pathTo[status]) {
    ticket = await as(actors[actor], () => ticketApi.changeStatus(ticket.id, next))
  }
  return ticket
}
