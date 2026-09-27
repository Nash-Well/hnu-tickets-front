import type { UserRole } from '@/entities/user/@x/ticket'
import type { Ticket, TicketStatus } from './types'

type Viewer = { id: string; role: UserRole }

const transitions: Record<TicketStatus, TicketStatus[]> = {
  NEW: ['ASSIGNED', 'CANCELLED'],
  ASSIGNED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['WAITING_FOR_USER', 'RESOLVED', 'CANCELLED'],
  WAITING_FOR_USER: ['IN_PROGRESS'],
  RESOLVED: ['IN_PROGRESS', 'CLOSED'],
  CLOSED: [],
  CANCELLED: [],
}

function isRoleAllowed(viewer: Viewer, ticket: Ticket, next: TicketStatus) {
  if (viewer.role === 'ADMIN') {
    return next !== 'ASSIGNED'
  }
  if (viewer.role === 'SPECIALIST') {
    return ticket.assignedTo?.id === viewer.id && ['IN_PROGRESS', 'WAITING_FOR_USER', 'RESOLVED'].includes(next)
  }
  if (ticket.createdBy.id !== viewer.id) {
    return false
  }
  return next === 'CLOSED' || next === 'CANCELLED' || (ticket.status === 'WAITING_FOR_USER' && next === 'IN_PROGRESS')
}

export function getAvailableTransitions(ticket: Ticket, viewer: Viewer): TicketStatus[] {
  return transitions[ticket.status].filter((next) => isRoleAllowed(viewer, ticket, next))
}

export function canEditTicket(ticket: Ticket, viewer: Viewer) {
  if (viewer.role === 'ADMIN') {
    return true
  }
  return viewer.role === 'USER' && ticket.createdBy.id === viewer.id && ticket.status === 'NEW'
}

export function canAssignTicket(ticket: Ticket, viewer: Viewer) {
  return viewer.role === 'ADMIN' && ticket.status !== 'CLOSED' && ticket.status !== 'CANCELLED'
}
