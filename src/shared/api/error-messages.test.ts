import { describe, expect, it } from 'vitest'
import { ApiError } from './api-error'
import { getErrorMessage } from './error-messages'

describe('getErrorMessage', () => {
  it('translates a known error code', () => {
    expect(getErrorMessage(new ApiError(409, 'INVALID_STATUS_TRANSITION', 'cannot transition'))).toBe(
      'Такий перехід статусу недопустимий.',
    )
  })

  it('falls back to the server message for an unknown code', () => {
    expect(getErrorMessage(new ApiError(418, 'TEAPOT', 'I am a teapot'))).toBe('I am a teapot')
  })

  it('uses the fallback for errors that did not come from the API', () => {
    expect(getErrorMessage(new Error('boom'))).toBe('Щось пішло не так. Спробуйте ще раз.')
    expect(getErrorMessage(undefined, 'Не вдалося зберегти')).toBe('Не вдалося зберегти')
  })
})
