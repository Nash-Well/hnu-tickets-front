import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { onUnauthorized, tokenStorage } from '@/shared/api'
import { notifyInfo } from '@/shared/lib'

export function UnauthorizedHandler() {
  const queryClient = useQueryClient()
  useEffect(
    () =>
      onUnauthorized(() => {
        if (!tokenStorage.get()) {
          return
        }
        tokenStorage.clear()
        queryClient.clear()
        notifyInfo('Сесія завершилась. Увійдіть повторно.', 'Потрібна авторизація')
      }),
    [queryClient],
  )
  return null
}
