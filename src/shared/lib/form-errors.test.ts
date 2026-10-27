import { describe, expect, it, vi } from 'vitest'
import { ApiError } from '@/shared/api'
import { applyApiErrorToForm } from './form-errors'

const fields = { EMAIL_ALREADY_EXISTS: 'email', INVALID_PASSWORD: 'password' }

describe('applyApiErrorToForm', () => {
  it('shows a server validation error next to its field', () => {
    const form = { setFieldError: vi.fn() }
    const handled = applyApiErrorToForm(form, new ApiError(409, 'EMAIL_ALREADY_EXISTS', 'exists'), fields)
    expect(handled).toBe(true)
    expect(form.setFieldError).toHaveBeenCalledWith('email', 'Користувач з таким email вже існує.')
  })

  it('leaves errors without a field to the caller', () => {
    const form = { setFieldError: vi.fn() }
    expect(applyApiErrorToForm(form, new ApiError(500, 'INTERNAL_ERROR', 'failure'), fields)).toBe(false)
    expect(applyApiErrorToForm(form, new Error('offline'), fields)).toBe(false)
    expect(form.setFieldError).not.toHaveBeenCalled()
  })
})
