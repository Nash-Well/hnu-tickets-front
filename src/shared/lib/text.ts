export function shortId(id: string) {
  return id.slice(0, 8).toUpperCase()
}

export function truncate(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value
}

export function formatPercent(value: number) {
  return `${Number.isFinite(value) ? Math.round(value * 10) / 10 : 0}%`
}
