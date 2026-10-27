import { afterEach, describe, expect, it, vi } from 'vitest'
import { presetToRange } from './use-analytics-period'

afterEach(() => {
  vi.useRealTimers()
})

describe('presetToRange', () => {
  it('includes today in the last N days', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 9, 27, 12, 0))
    expect(presetToRange('7')).toEqual({ from: '2026-10-21', to: '2026-10-27' })
    expect(presetToRange('30')).toEqual({ from: '2026-09-28', to: '2026-10-27' })
  })

  it('leaves the period open for all time', () => {
    expect(presetToRange('all')).toEqual({ from: null, to: null })
  })
})
