import { describe, expect, it } from 'vitest'
import { ticketFormSchema } from './validation'

const valid = { title: 'Printer does not print', description: 'Paper jam', categoryId: 'category', priority: 'HIGH' }

function firstError(values: Record<string, unknown>) {
  const result = ticketFormSchema.safeParse(values)
  return result.success ? null : result.error.issues[0].message
}

describe('ticketFormSchema', () => {
  it('accepts a complete ticket and trims the text', () => {
    const result = ticketFormSchema.parse({ ...valid, title: '  Printer  ', description: ' Jam ' })
    expect(result.title).toBe('Printer')
    expect(result.description).toBe('Jam')
  })

  it.each([
    ['a title of 2 characters', { title: 'ab' }, 'Назва має містити щонайменше 3 символи'],
    ['a title of spaces around 2 characters', { title: '  ab  ' }, 'Назва має містити щонайменше 3 символи'],
    ['a title of 256 characters', { title: 'a'.repeat(256) }, 'Назва має містити не більше 255 символів'],
    ['an empty description', { description: '   ' }, 'Опишіть проблему'],
    ['a missing category', { categoryId: '' }, 'Оберіть категорію'],
    ['an unknown priority', { priority: 'URGENT' }, 'Оберіть пріоритет'],
  ])('rejects %s', (_, override, message) => {
    expect(firstError({ ...valid, ...override })).toBe(message)
  })

  it.each([3, 255])('accepts a title of %i characters', (length) => {
    expect(firstError({ ...valid, title: 'a'.repeat(length) })).toBeNull()
  })
})
