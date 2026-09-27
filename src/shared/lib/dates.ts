import dayjs from 'dayjs'
import 'dayjs/locale/uk'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(relativeTime)
dayjs.extend(duration)
dayjs.extend(customParseFormat)
dayjs.locale('uk')

export { dayjs }

export function formatDateTime(value: string | null | undefined) {
  return value ? dayjs(value).format('DD.MM.YYYY, HH:mm') : '—'
}

export function formatDate(value: string | null | undefined) {
  return value ? dayjs(value).format('DD.MM.YYYY') : '—'
}

export function formatRelative(value: string) {
  return dayjs(value).fromNow()
}

export function formatDurationSeconds(totalSeconds: number) {
  if (!totalSeconds || totalSeconds <= 0) {
    return '—'
  }
  const value = dayjs.duration(totalSeconds, 'seconds')
  const days = Math.floor(value.asDays())
  const hours = value.hours()
  const minutes = value.minutes()
  if (days > 0) {
    return `${days} д ${hours} год`
  }
  if (hours > 0) {
    return `${hours} год ${minutes} хв`
  }
  if (minutes > 0) {
    return `${minutes} хв`
  }
  return '< 1 хв'
}

export function toStartOfDayIso(value: string | Date) {
  return dayjs(value).startOf('day').toISOString()
}

export function toEndOfDayIso(value: string | Date) {
  return dayjs(value).endOf('day').toISOString()
}
