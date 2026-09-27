export type AnalyticsPeriod = {
  from?: string
  to?: string
}

export type AnalyticsOverview = {
  totalTickets: number
  openTickets: number
  inProgressTickets: number
  resolvedTickets: number
  closedTickets: number
  averageResolutionSeconds: number
}

export type AnalyticsCount = {
  value: string
  count: number
}

export type CategoryCount = {
  id: string
  name: string
  count: number
}

export type SpecialistWorkload = {
  id: string
  name: string
  openTickets: number
}
