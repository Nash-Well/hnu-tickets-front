import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import type { AnalyticsPeriod } from '@/entities/analytics'
import { dayjs, toEndOfDayIso, toStartOfDayIso } from '@/shared/lib'

export const PERIOD_PRESETS = [
  { value: '7', label: '7 днів' },
  { value: '30', label: '30 днів' },
  { value: '90', label: '90 днів' },
  { value: 'all', label: 'Весь час' },
] as const

const DATE_FORMAT = 'YYYY-MM-DD'

export type PeriodRange = { from: string | null; to: string | null }

function isValidDate(value: string | null) {
  return Boolean(value && dayjs(value, DATE_FORMAT, true).isValid())
}

export function presetToRange(preset: string): PeriodRange {
  if (preset === 'all') {
    return { from: null, to: null }
  }
  const today = dayjs()
  return {
    from: today.subtract(Number(preset) - 1, 'day').format(DATE_FORMAT),
    to: today.format(DATE_FORMAT),
  }
}

export function useAnalyticsPeriod(defaultPreset = '30') {
  const [searchParams, setSearchParams] = useSearchParams()
  const rawFrom = searchParams.get('from')
  const rawTo = searchParams.get('to')
  const isAllTime = searchParams.get('period') === 'all'

  const range = useMemo<PeriodRange>(() => {
    if (isAllTime) {
      return { from: null, to: null }
    }
    if (isValidDate(rawFrom) && isValidDate(rawTo)) {
      return { from: rawFrom, to: rawTo }
    }
    return presetToRange(defaultPreset)
  }, [defaultPreset, isAllTime, rawFrom, rawTo])

  const period = useMemo<AnalyticsPeriod>(
    () => ({
      from: range.from ? toStartOfDayIso(range.from) : undefined,
      to: range.to ? toEndOfDayIso(range.to) : undefined,
    }),
    [range],
  )

  const activePreset =
    PERIOD_PRESETS.find((preset) => {
      const presetRange = presetToRange(preset.value)
      return presetRange.from === range.from && presetRange.to === range.to
    })?.value ?? null

  const setRange = (next: PeriodRange) => {
    setSearchParams(
      (current) => {
        const params = new URLSearchParams(current)
        params.delete('from')
        params.delete('to')
        params.delete('period')
        if (next.from && next.to) {
          params.set('from', next.from)
          params.set('to', next.to)
        } else {
          params.set('period', 'all')
        }
        return params
      },
      { replace: true },
    )
  }

  return { range, period, activePreset, setRange }
}
