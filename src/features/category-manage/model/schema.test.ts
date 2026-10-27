import { describe, expect, it } from 'vitest'
import { categorySchema } from './schema'

describe('categorySchema', () => {
  it('accepts a name with an empty description', () => {
    expect(categorySchema.parse({ name: ' Network ', description: '' })).toEqual({ name: 'Network', description: '' })
  })

  it.each([
    ['a name of 1 character', { name: 'N', description: '' }],
    ['a name of 101 characters', { name: 'n'.repeat(101), description: '' }],
    ['a description of 1001 characters', { name: 'Network', description: 'd'.repeat(1001) }],
  ])('rejects %s', (_, values) => {
    expect(categorySchema.safeParse(values).success).toBe(false)
  })
})
