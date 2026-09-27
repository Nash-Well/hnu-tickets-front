import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sessionApi, sessionKeys } from '@/entities/session'
import { type UpdateUserPayload, userApi, userKeys, type UserRole } from '@/entities/user'
import { notifyError, notifySuccess } from '@/shared/lib'
import type { CreateUserValues } from './schema'

function useInvalidateUsers() {
  const queryClient = useQueryClient()
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: userKeys.all }),
      queryClient.invalidateQueries({ queryKey: sessionKeys.currentUser }),
      queryClient.invalidateQueries({ queryKey: ['analytics'] }),
    ])
}

export function useUpdateUser(userId: string) {
  const invalidateUsers = useInvalidateUsers()
  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => userApi.update(userId, payload),
    onSuccess: async (user) => {
      await invalidateUsers()
      notifySuccess(`Дані користувача «${user.name}» оновлено.`)
    },
  })
}

export function useChangeUserRole() {
  const invalidateUsers = useInvalidateUsers()
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole; name: string }) => userApi.updateRole(id, role),
    onSuccess: async (_, { name }) => {
      await invalidateUsers()
      notifySuccess(`Роль користувача «${name}» змінено.`)
    },
    onError: (error) => notifyError(error, 'Не вдалося змінити роль'),
  })
}

export function useCreateUser() {
  const invalidateUsers = useInvalidateUsers()
  return useMutation({
    mutationFn: async ({ role, ...account }: CreateUserValues) => {
      const { user } = await sessionApi.register(account)
      if (role !== user.role) {
        try {
          await userApi.updateRole(user.id, role)
        } catch (error) {
          notifyError(error, 'Користувача створено, але роль не призначено')
          return user
        }
      }
      return { ...user, role }
    },
    onSuccess: async (user) => {
      await invalidateUsers()
      notifySuccess(`Користувача «${user.name}» створено.`)
    },
  })
}
