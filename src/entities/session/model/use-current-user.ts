import { queryOptions, useQuery } from '@tanstack/react-query'
import { sessionApi } from '../api/session-api'
import { useAccessToken } from './use-access-token'

export const sessionKeys = {
  currentUser: ['session', 'current-user'] as const,
}

export const currentUserQuery = () =>
  queryOptions({
    queryKey: sessionKeys.currentUser,
    queryFn: ({ signal }) => sessionApi.me(signal),
    staleTime: 5 * 60 * 1000,
    retry: false,
  })

export function useCurrentUser() {
  const token = useAccessToken()
  const query = useQuery({ ...currentUserQuery(), enabled: Boolean(token) })
  return { ...query, isAuthenticated: Boolean(token) }
}
