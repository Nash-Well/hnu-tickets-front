import { useQueryClient } from '@tanstack/react-query'
import type { SessionResponse } from './types'
import { sessionKeys } from './use-current-user'
import { tokenStorage } from '@/shared/api'

export function useStartSession() {
  const queryClient = useQueryClient()
  return (session: SessionResponse) => {
    queryClient.clear()
    queryClient.setQueryData(sessionKeys.currentUser, session.user)
    tokenStorage.set(session.accessToken)
  }
}
