import { queryOptions, useQuery } from '@tanstack/react-query'
import { userApi } from './user-api'

export const userKeys = {
  all: ['users'] as const,
  list: () => [...userKeys.all, 'list'] as const,
}

export const usersQuery = () =>
  queryOptions({
    queryKey: userKeys.list(),
    queryFn: ({ signal }) => userApi.list(signal),
  })

export function useUsers(enabled = true) {
  return useQuery({ ...usersQuery(), enabled })
}

export function useSpecialists(enabled = true) {
  return useQuery({
    ...usersQuery(),
    enabled,
    select: (users) => users.filter((user) => user.role === 'SPECIALIST'),
  })
}
