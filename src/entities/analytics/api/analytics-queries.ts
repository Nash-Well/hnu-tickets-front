import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { AnalyticsPeriod } from '../model/types'
import { analyticsApi } from './analytics-api'

export const analyticsKeys = {
  all: ['analytics'] as const,
  metric: (metric: string, period: AnalyticsPeriod) => [...analyticsKeys.all, metric, period] as const,
}

export function useAnalyticsOverview(period: AnalyticsPeriod) {
  return useQuery({
    queryKey: analyticsKeys.metric('overview', period),
    queryFn: ({ signal }) => analyticsApi.overview(period, signal),
    placeholderData: keepPreviousData,
  })
}

export function useStatusAnalytics(period: AnalyticsPeriod) {
  return useQuery({
    queryKey: analyticsKeys.metric('statuses', period),
    queryFn: ({ signal }) => analyticsApi.statuses(period, signal),
    placeholderData: keepPreviousData,
  })
}

export function usePriorityAnalytics(period: AnalyticsPeriod) {
  return useQuery({
    queryKey: analyticsKeys.metric('priorities', period),
    queryFn: ({ signal }) => analyticsApi.priorities(period, signal),
    placeholderData: keepPreviousData,
  })
}

export function useCategoryAnalytics(period: AnalyticsPeriod) {
  return useQuery({
    queryKey: analyticsKeys.metric('categories', period),
    queryFn: ({ signal }) => analyticsApi.categories(period, signal),
    placeholderData: keepPreviousData,
  })
}

export function useSpecialistAnalytics(period: AnalyticsPeriod) {
  return useQuery({
    queryKey: analyticsKeys.metric('specialists', period),
    queryFn: ({ signal }) => analyticsApi.specialists(period, signal),
    placeholderData: keepPreviousData,
  })
}
