import { describe, expect, it } from 'vitest'
import { formatDate, formatDurationSeconds } from './dates'

describe('date helpers', () => {
  it.each([
    [0, '—'],
    [-5, '—'],
    [30, '< 1 хв'],
    [90, '1 хв'],
    [3_700, '1 год 1 хв'],
    [90_000, '1 д 1 год'],
  ])('formats a duration of %i seconds', (seconds, expected) => {
    expect(formatDurationSeconds(seconds)).toBe(expected)
  })

  it('shows a dash for a missing date', () => {
    expect(formatDate(null)).toBe('—')
    expect(formatDate(undefined)).toBe('—')
  })
})
