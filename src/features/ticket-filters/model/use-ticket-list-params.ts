import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import {
  type SortOrder,
  TICKET_PRIORITIES,
  TICKET_SORT_FIELDS,
  TICKET_STATUSES,
  type TicketListParams,
  type TicketPriority,
  type TicketSortField,
  type TicketStatus,
} from '@/entities/ticket'
import { toEndOfDayIso, toStartOfDayIso } from '@/shared/lib'

export const DEFAULT_PAGE_SIZE = 20

export type TicketFilterValues = {
  q: string
  status: TicketStatus | null
  priority: TicketPriority | null
  categoryId: string | null
  assignedTo: string | null
  createdFrom: string | null
  createdTo: string | null
}

type FilterKey = keyof TicketFilterValues

const FILTER_KEYS: FilterKey[] = ['q', 'status', 'priority', 'categoryId', 'assignedTo', 'createdFrom', 'createdTo']

function pickEnum<T extends string>(value: string | null, allowed: readonly T[]): T | null {
  return value && (allowed as readonly string[]).includes(value) ? (value as T) : null
}

function positiveInt(value: string | null, fallback: number) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

export function useTicketListParams() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo<TicketFilterValues>(
    () => ({
      q: searchParams.get('q') ?? '',
      status: pickEnum(searchParams.get('status'), TICKET_STATUSES),
      priority: pickEnum(searchParams.get('priority'), TICKET_PRIORITIES),
      categoryId: searchParams.get('categoryId'),
      assignedTo: searchParams.get('assignedTo'),
      createdFrom: searchParams.get('createdFrom'),
      createdTo: searchParams.get('createdTo'),
    }),
    [searchParams],
  )

  const page = positiveInt(searchParams.get('page'), 1)
  const pageSize = positiveInt(searchParams.get('pageSize'), DEFAULT_PAGE_SIZE)
  const sort = pickEnum<TicketSortField>(searchParams.get('sort'), TICKET_SORT_FIELDS) ?? 'createdAt'
  const order: SortOrder = searchParams.get('order') === 'asc' ? 'asc' : 'desc'

  const apiParams = useMemo<TicketListParams>(
    () => ({
      page,
      pageSize,
      sort,
      order,
      q: filters.q.trim() || undefined,
      status: filters.status ?? undefined,
      priority: filters.priority ?? undefined,
      categoryId: filters.categoryId ?? undefined,
      assignedTo: filters.assignedTo ?? undefined,
      createdFrom: filters.createdFrom ? toStartOfDayIso(filters.createdFrom) : undefined,
      createdTo: filters.createdTo ? toEndOfDayIso(filters.createdTo) : undefined,
    }),
    [filters, page, pageSize, sort, order],
  )

  const update = useCallback(
    (changes: Record<string, string | number | null | undefined>, resetPage = true) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current)
          Object.entries(changes).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '') {
              next.delete(key)
            } else {
              next.set(key, String(value))
            }
          })
          if (resetPage) {
            next.delete('page')
          }
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const setFilter = useCallback(
    <K extends FilterKey>(key: K, value: TicketFilterValues[K]) => update({ [key]: value }),
    [update],
  )

  const setDateRange = useCallback(
    (from: string | null, to: string | null) => update({ createdFrom: from, createdTo: to }),
    [update],
  )

  const resetFilters = useCallback(
    () => update(Object.fromEntries(FILTER_KEYS.map((key) => [key, null]))),
    [update],
  )

  const setPage = useCallback((value: number) => update({ page: value }, false), [update])

  const setPageSize = useCallback((value: number) => update({ pageSize: value }), [update])

  const setSort = useCallback(
    (field: TicketSortField) => {
      const nextOrder: SortOrder = sort === field && order === 'desc' ? 'asc' : 'desc'
      update({ sort: field, order: nextOrder }, false)
    },
    [order, sort, update],
  )

  const activeFilterCount = FILTER_KEYS.filter((key) => key !== 'createdTo' && Boolean(filters[key])).length

  return {
    filters,
    apiParams,
    page,
    pageSize,
    sort,
    order,
    activeFilterCount,
    setFilter,
    setDateRange,
    resetFilters,
    setPage,
    setPageSize,
    setSort,
  }
}
