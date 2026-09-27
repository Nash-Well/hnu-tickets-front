import { getErrorMessage, isApiError } from '@/shared/api'

type FormWithErrors = {
  setFieldError: (path: string, error: string) => void
}

export function applyApiErrorToForm(
  form: FormWithErrors,
  error: unknown,
  fieldsByCode: Record<string, string>,
): boolean {
  if (!isApiError(error)) {
    return false
  }
  const field = fieldsByCode[error.code]
  if (!field) {
    return false
  }
  form.setFieldError(field, getErrorMessage(error))
  return true
}
