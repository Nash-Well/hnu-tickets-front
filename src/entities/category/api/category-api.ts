import { http } from '@/shared/api'
import type { Category, CategoryPayload } from '../model/types'

export const categoryApi = {
  list: (signal?: AbortSignal) => http.get<Category[]>('/categories', { signal }),
  create: (payload: CategoryPayload) => http.post<Category>('/categories', payload),
  update: (id: string, payload: CategoryPayload) => http.patch<Category>(`/categories/${id}`, payload),
  remove: (id: string) => http.delete<void>(`/categories/${id}`),
}
