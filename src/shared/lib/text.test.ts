import { describe, expect, it } from 'vitest'
import { countLabel, formatPercent, shortId, truncate } from './text'

const forms: [string, string, string] = ['заявка', 'заявки', 'заявок']

describe('text helpers', () => {
  it.each([
    [1, '1 заявка'],
    [2, '2 заявки'],
    [4, '4 заявки'],
    [5, '5 заявок'],
    [11, '11 заявок'],
    [12, '12 заявок'],
    [14, '14 заявок'],
    [21, '21 заявка'],
    [22, '22 заявки'],
    [0, '0 заявок'],
    [111, '111 заявок'],
  ])('declines the noun for %i', (count, expected) => {
    expect(countLabel(count, forms)).toBe(expected)
  })

  it('truncates long text with an ellipsis', () => {
    expect(truncate('Printer does not print', 10)).toBe('Printer d…')
    expect(truncate('Printer', 10)).toBe('Printer')
  })

  it('rounds percentages and hides invalid values', () => {
    expect(formatPercent(33.333)).toBe('33.3%')
    expect(formatPercent(Number.NaN)).toBe('0%')
  })

  it('shortens identifiers', () => {
    expect(shortId('3f2a9c1e-0000-4000-8000-000000000000')).toBe('3F2A9C1E')
  })
})
