import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from './api-error'
import { http, onUnauthorized } from './http-client'
import { tokenStorage } from './token-storage'

function respond(status: number, body?: unknown, statusText = '') {
  const payload = body === undefined ? null : typeof body === 'string' ? body : JSON.stringify(body)
  const fetchMock = vi.fn().mockResolvedValue(new Response(payload, { status, statusText }))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

function sentRequest(fetchMock: ReturnType<typeof vi.fn>) {
  const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
  return { url, init, headers: init.headers as Headers }
}

afterEach(() => {
  vi.unstubAllGlobals()
  tokenStorage.clear()
})

describe('http client', () => {
  it('builds the URL and skips empty query values', async () => {
    const fetchMock = respond(200, { items: [] })
    await http.get('/tickets', { query: { page: 2, q: 'printer', status: undefined, priority: null, categoryId: '' } })
    expect(sentRequest(fetchMock).url).toBe('/api/v1/tickets?page=2&q=printer')
  })

  it('sends the bearer token and a JSON body', async () => {
    tokenStorage.set('token-123')
    const fetchMock = respond(201, { id: 'ticket' })
    await http.post('/tickets', { title: 'Printer' })
    const { init, headers } = sentRequest(fetchMock)
    expect(init.method).toBe('POST')
    expect(init.body).toBe('{"title":"Printer"}')
    expect(headers.get('Authorization')).toBe('Bearer token-123')
    expect(headers.get('Content-Type')).toBe('application/json')
  })

  it('does not send the token to public endpoints', async () => {
    tokenStorage.set('token-123')
    const fetchMock = respond(200, { accessToken: 'new' })
    await http.post('/auth/login', { email: 'user@example.com' }, { authenticated: false })
    expect(sentRequest(fetchMock).headers.has('Authorization')).toBe(false)
  })

  it('turns the error envelope into an ApiError', async () => {
    respond(409, { error: { code: 'INVALID_STATUS_TRANSITION', message: 'cannot transition' } })
    const error = await http.patch('/tickets/1/status', { status: 'CLOSED' }).catch((caught: unknown) => caught)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 409, code: 'INVALID_STATUS_TRANSITION', message: 'cannot transition' })
  })

  it('keeps the status when the error body is not JSON', async () => {
    respond(502, '<html>Bad Gateway</html>', 'Bad Gateway')
    await expect(http.get('/tickets')).rejects.toMatchObject({ status: 502, code: 'UNKNOWN_ERROR' })
  })

  it('reports an expired session only for authenticated requests', async () => {
    const handler = vi.fn()
    const unsubscribe = onUnauthorized(handler)
    respond(401, { error: { code: 'INVALID_TOKEN', message: 'expired' } })
    await expect(http.get('/auth/me')).rejects.toMatchObject({ isUnauthorized: true })
    respond(401, { error: { code: 'INVALID_CREDENTIALS', message: 'wrong' } })
    await expect(http.post('/auth/login', {}, { authenticated: false })).rejects.toMatchObject({ status: 401 })
    expect(handler).toHaveBeenCalledTimes(1)
    unsubscribe()
  })

  it('returns undefined for responses without a body', async () => {
    respond(204)
    await expect(http.delete('/categories/1')).resolves.toBeUndefined()
    respond(200, '')
    await expect(http.patch('/users/1/role', { role: 'ADMIN' })).resolves.toBeUndefined()
  })

  it('maps a failed connection to a network error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('fetch failed')))
    await expect(http.get('/tickets')).rejects.toMatchObject({ status: 0, code: 'NETWORK_ERROR', isNetworkError: true })
  })

  it('passes an aborted request through unchanged', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new DOMException('aborted', 'AbortError')))
    await expect(http.get('/tickets')).rejects.toMatchObject({ name: 'AbortError' })
  })
})
