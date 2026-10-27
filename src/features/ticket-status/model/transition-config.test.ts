import { describe, expect, it } from 'vitest'
import { TICKET_STATUSES } from '@/entities/ticket/model/types'
import { getTransitionConfig } from './transition-config'

describe('getTransitionConfig', () => {
  it('requires a comment only for a request for information and for a resolution', () => {
    const required = TICKET_STATUSES.flatMap((from) =>
      TICKET_STATUSES.filter((to) => getTransitionConfig(from, to, false).commentRequired),
    )
    expect(new Set(required)).toEqual(new Set(['WAITING_FOR_USER', 'RESOLVED']))
  })

  it('distinguishes reopening from taking a ticket into work', () => {
    expect(getTransitionConfig('RESOLVED', 'IN_PROGRESS', false).label).toBe('Відкрити повторно')
    expect(getTransitionConfig('ASSIGNED', 'IN_PROGRESS', false).label).toBe('Взяти в роботу')
  })

  it('words the answer to a request differently for the author and for the specialist', () => {
    expect(getTransitionConfig('WAITING_FOR_USER', 'IN_PROGRESS', true).label).toBe('Інформацію надано')
    expect(getTransitionConfig('WAITING_FOR_USER', 'IN_PROGRESS', false).label).toBe('Продовжити роботу')
    expect(getTransitionConfig('RESOLVED', 'CLOSED', true).label).toBe('Підтвердити та закрити')
  })

  it('marks cancellation as a dangerous action', () => {
    expect(getTransitionConfig('NEW', 'CANCELLED', true).emphasis).toBe('danger')
  })
})
