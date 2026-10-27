import { describe, expect, it } from 'vitest'
import { userEmailSchema, userNameSchema, userPasswordSchema } from './validation'

describe('user field schemas', () => {
  it.each([
    ['a name of 1 character', userNameSchema, 'A', 'Ім’я має містити щонайменше 2 символи'],
    ['a name of 101 characters', userNameSchema, 'a'.repeat(101), 'Ім’я має містити не більше 100 символів'],
    ['an empty email', userEmailSchema, '  ', 'Введіть email'],
    ['an email without a domain', userEmailSchema, 'user@', 'Некоректна адреса електронної пошти'],
    ['a password of 7 characters', userPasswordSchema, 'passwor', 'Пароль має містити щонайменше 8 символів'],
  ])('rejects %s', (_, schema, value, message) => {
    const result = schema.safeParse(value)
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe(message)
  })

  it('accepts boundary values', () => {
    expect(userNameSchema.parse(' Al ')).toBe('Al')
    expect(userNameSchema.safeParse('a'.repeat(100)).success).toBe(true)
    expect(userEmailSchema.parse(' user@example.com ')).toBe('user@example.com')
    expect(userPasswordSchema.safeParse('password').success).toBe(true)
  })
})
