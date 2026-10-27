import { describe, expect, it } from 'vitest'
import type { UserRole } from '@/entities/user/@x/ticket'
import { canAssignTicket, canEditTicket, getAvailableTransitions } from './permissions'
import type { Ticket, TicketStatus } from './types'

const author = { id: 'author', role: 'USER' as const }
const otherUser = { id: 'other-user', role: 'USER' as const }
const specialist = { id: 'specialist', role: 'SPECIALIST' as const }
const otherSpecialist = { id: 'other-specialist', role: 'SPECIALIST' as const }
const admin = { id: 'admin', role: 'ADMIN' as const }

function ticket(status: TicketStatus): Ticket {
  return {
    id: 'ticket',
    title: 'Printer does not print',
    description: 'Paper jam',
    status,
    priority: 'MEDIUM',
    category: { id: 'category', name: 'Peripherals' },
    createdBy: { id: author.id, name: 'Author' },
    assignedTo: status === 'NEW' ? null : { id: specialist.id, name: 'Specialist' },
    createdAt: '2026-09-25T10:00:00Z',
    updatedAt: '2026-09-25T10:00:00Z',
    resolvedAt: null,
    closedAt: null,
  }
}

describe('getAvailableTransitions', () => {
  it.each<[string, { id: string; role: UserRole }, TicketStatus, TicketStatus[]]>([
    ['author cancels a new ticket', author, 'NEW', ['CANCELLED']],
    ['author cancels an assigned ticket', author, 'ASSIGNED', ['CANCELLED']],
    ['author cancels a ticket in progress', author, 'IN_PROGRESS', ['CANCELLED']],
    ['author answers a request for information', author, 'WAITING_FOR_USER', ['IN_PROGRESS']],
    ['author confirms a resolved ticket', author, 'RESOLVED', ['CLOSED']],
    ['assignee takes a ticket into work', specialist, 'ASSIGNED', ['IN_PROGRESS']],
    ['assignee requests information or resolves', specialist, 'IN_PROGRESS', ['WAITING_FOR_USER', 'RESOLVED']],
    ['assignee continues after the answer', specialist, 'WAITING_FOR_USER', ['IN_PROGRESS']],
    ['assignee reopens a resolved ticket', specialist, 'RESOLVED', ['IN_PROGRESS']],
    ['administrator assigns only through the assign action', admin, 'NEW', ['CANCELLED']],
    ['administrator sees every domain transition', admin, 'IN_PROGRESS', ['WAITING_FOR_USER', 'RESOLVED', 'CANCELLED']],
    ['administrator closes or reopens a resolved ticket', admin, 'RESOLVED', ['IN_PROGRESS', 'CLOSED']],
  ])('%s', (_, viewer, status, expected) => {
    expect(getAvailableTransitions(ticket(status), viewer)).toEqual(expected)
  })

  it.each<TicketStatus>(['NEW', 'ASSIGNED', 'IN_PROGRESS', 'WAITING_FOR_USER', 'RESOLVED'])(
    'offers nothing to a user or specialist outside the %s ticket',
    (status) => {
      expect(getAvailableTransitions(ticket(status), otherUser)).toEqual([])
      expect(getAvailableTransitions(ticket(status), otherSpecialist)).toEqual([])
    },
  )

  it.each<TicketStatus>(['CLOSED', 'CANCELLED'])('offers nothing for a %s ticket', (status) => {
    for (const viewer of [author, specialist, admin]) {
      expect(getAvailableTransitions(ticket(status), viewer)).toEqual([])
    }
  })
})

describe('canEditTicket', () => {
  it('lets the author edit only a new ticket', () => {
    expect(canEditTicket(ticket('NEW'), author)).toBe(true)
    expect(canEditTicket(ticket('ASSIGNED'), author)).toBe(false)
  })

  it('lets the administrator edit any ticket', () => {
    expect(canEditTicket(ticket('IN_PROGRESS'), admin)).toBe(true)
  })

  it('denies other users and specialists', () => {
    expect(canEditTicket(ticket('NEW'), otherUser)).toBe(false)
    expect(canEditTicket(ticket('ASSIGNED'), specialist)).toBe(false)
  })
})

describe('canAssignTicket', () => {
  it('lets the administrator assign an active ticket', () => {
    expect(canAssignTicket(ticket('NEW'), admin)).toBe(true)
    expect(canAssignTicket(ticket('WAITING_FOR_USER'), admin)).toBe(true)
  })

  it('denies assignment of closed and cancelled tickets', () => {
    expect(canAssignTicket(ticket('CLOSED'), admin)).toBe(false)
    expect(canAssignTicket(ticket('CANCELLED'), admin)).toBe(false)
  })

  it('denies assignment to non-administrators', () => {
    expect(canAssignTicket(ticket('NEW'), author)).toBe(false)
    expect(canAssignTicket(ticket('NEW'), specialist)).toBe(false)
  })
})
