import { queryOptions, useQuery } from '@tanstack/react-query'
import { categoryApi } from './category-api'

export const categoryKeys = {
  all: ['categories'] as const,
}

export const categoriesQuery = () =>
  queryOptions({
    queryKey: categoryKeys.all,
    queryFn: ({ signal }) => categoryApi.list(signal),
    staleTime: 5 * 60 * 1000,
    select: (categories) => [...categories].sort((a, b) => a.name.localeCompare(b.name, 'uk')),
  })

export function useCategories() {
  return useQuery(categoriesQuery())
}

export function useCategoryOptions() {
  const query = useCategories()
  const options = (query.data ?? []).map((category) => ({ value: category.id, label: category.name }))
  return { ...query, options }
}
