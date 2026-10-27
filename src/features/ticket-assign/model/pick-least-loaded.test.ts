import { describe, expect, it } from 'vitest'
import { pickLeastLoadedSpecialist } from './pick-least-loaded'

const workload = [
  { id: 'b', name: 'Богдан', openTickets: 3 },
  { id: 'a', name: 'Андрій', openTickets: 1 },
  { id: 'v', name: 'Василь', openTickets: 1 },
]

describe('pickLeastLoadedSpecialist', () => {
  it('suggests the specialist with the fewest open tickets', () => {
    expect(pickLeastLoadedSpecialist(workload)?.id).toBe('a')
  })

  it('breaks a tie by name in Ukrainian alphabetical order', () => {
    const tied = [
      { id: 'ye', name: 'Євген', openTickets: 2 },
      { id: 'ie', name: 'Іван', openTickets: 2 },
      { id: 'd', name: 'Дмитро', openTickets: 2 },
    ]
    expect(pickLeastLoadedSpecialist(tied)?.id).toBe('d')
    expect(pickLeastLoadedSpecialist(tied, 'd')?.id).toBe('ye')
  })

  it('excludes the current assignee', () => {
    expect(pickLeastLoadedSpecialist(workload, 'a')?.id).toBe('v')
  })

  it('returns undefined when nobody is available', () => {
    expect(pickLeastLoadedSpecialist([])).toBeUndefined()
    expect(pickLeastLoadedSpecialist([workload[0]], 'b')).toBeUndefined()
  })

  it('does not reorder the input', () => {
    const input = [...workload]
    pickLeastLoadedSpecialist(input)
    expect(input).toEqual(workload)
  })
})
