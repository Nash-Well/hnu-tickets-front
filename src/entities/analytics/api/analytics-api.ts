import { http } from '@/shared/api'
import type {
  AnalyticsCount,
  AnalyticsOverview,
  AnalyticsPeriod,
  CategoryCount,
  SpecialistWorkload,
} from '../model/types'

export const analyticsApi = {
  overview: (period: AnalyticsPeriod, signal?: AbortSignal) =>
    http.get<AnalyticsOverview>('/analytics/overview', { query: period, signal }),
  statuses: (period: AnalyticsPeriod, signal?: AbortSignal) =>
    http.get<AnalyticsCount[]>('/analytics/statuses', { query: period, signal }),
  priorities: (period: AnalyticsPeriod, signal?: AbortSignal) =>
    http.get<AnalyticsCount[]>('/analytics/priorities', { query: period, signal }),
  categories: (period: AnalyticsPeriod, signal?: AbortSignal) =>
    http.get<CategoryCount[]>('/analytics/categories', { query: period, signal }),
  specialists: (period: AnalyticsPeriod, signal?: AbortSignal) =>
    http.get<SpecialistWorkload[]>('/analytics/specialists', { query: period, signal }),
}
