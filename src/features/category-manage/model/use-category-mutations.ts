import { useMutation, useQueryClient } from '@tanstack/react-query'
import { categoryApi, categoryKeys, type CategoryPayload } from '@/entities/category'
import { notifyError, notifySuccess } from '@/shared/lib'

export function useSaveCategory(categoryId?: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CategoryPayload) =>
      categoryId ? categoryApi.update(categoryId, payload) : categoryApi.create(payload),
    onSuccess: async (category) => {
      await queryClient.invalidateQueries({ queryKey: categoryKeys.all })
      notifySuccess(`Категорію «${category.name}» ${categoryId ? 'оновлено' : 'створено'}.`)
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: string; name: string }) => categoryApi.remove(id),
    onSuccess: async (_, { name }) => {
      await queryClient.invalidateQueries({ queryKey: categoryKeys.all })
      notifySuccess(`Категорію «${name}» видалено.`)
    },
    onError: (error) => notifyError(error, 'Не вдалося видалити категорію'),
  })
}
