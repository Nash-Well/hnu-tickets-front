import { afterEach, describe, expect, it, vi } from 'vitest'
import { sessionApi } from '@/entities/session/api/session-api'
import { ticketApi } from '@/entities/ticket/api/ticket-api'
import { http, onUnauthorized, tokenStorage } from '@/shared/api'
import { apiError, as, PASSWORD, register, signIn } from './support'

afterEach(() => {
  tokenStorage.clear()
})

describe('registration', () => {
  it('creates an account with the USER role and a working token', async () => {
    const session = await register('Olena Test')
    expect(session.user).toMatchObject({ name: 'Olena Test', role: 'USER' })
    expect(await as(session, () => sessionApi.me())).toMatchObject({ id: session.user.id, role: 'USER' })
  })

  it('rejects a second account with the same email', async () => {
    const { user } = await register()
    expect(await apiError(sessionApi.register({ name: 'Copy', email: user.email, password: PASSWORD }))).toEqual({
      status: 409,
      code: 'EMAIL_ALREADY_EXISTS',
    })
  })

  it.each([
    ['a name of 1 character', { name: 'A' }, 'INVALID_NAME'],
    ['an email without a domain', { email: 'user@' }, 'INVALID_EMAIL'],
    ['a password of 7 characters', { password: 'passwor' }, 'INVALID_PASSWORD'],
  ])('rejects %s', async (_, override, code) => {
    const payload = { name: 'Test User', email: `test.${crypto.randomUUID()}@example.com`, password: PASSWORD }
    expect(await apiError(sessionApi.register({ ...payload, ...override }))).toEqual({ status: 400, code })
  })

  it('does not let a new account choose its role', async () => {
    const payload = { name: 'Intruder', email: `test.${crypto.randomUUID()}@example.com`, password: PASSWORD }
    const attempt = http.post('/auth/register', { ...payload, role: 'ADMIN' }, { authenticated: false })
    expect(await apiError(attempt)).toEqual({ status: 400, code: 'INVALID_JSON' })
  })
})

describe('login and tokens', () => {
  it('signs in a seeded account', async () => {
    const session = await signIn('admin@example.com')
    expect(session.user.role).toBe('ADMIN')
    expect(session.token.split('.')).toHaveLength(3)
  })

  it('gives the same answer for a wrong password and for an unknown email', async () => {
    const wrongPassword = await apiError(sessionApi.login({ email: 'user@example.com', password: 'wrong-password' }))
    const unknownEmail = await apiError(sessionApi.login({ email: 'nobody@example.com', password: PASSWORD }))
    expect(wrongPassword).toEqual({ status: 401, code: 'INVALID_CREDENTIALS' })
    expect(unknownEmail).toEqual(wrongPassword)
  })

  it('requires a token for protected routes', async () => {
    expect(await apiError(ticketApi.list({}))).toEqual({ status: 401, code: 'UNAUTHORIZED' })
  })

  it('rejects a modified token and ends the client session', async () => {
    const { token } = await signIn('user@example.com')
    const [header, payload] = token.split('.')
    const handler = vi.fn()
    const unsubscribe = onUnauthorized(handler)
    tokenStorage.set(`${header}.${payload}.forged-signature`)
    const result = await apiError(sessionApi.me())
    unsubscribe()
    expect(result).toEqual({ status: 401, code: 'INVALID_TOKEN' })
    expect(handler).toHaveBeenCalledTimes(1)
  })
})
