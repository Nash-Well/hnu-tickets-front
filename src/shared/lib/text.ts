export function shortId(id: string) {
  return id.slice(0, 8).toUpperCase()
}

export function truncate(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value
}

export function formatPercent(value: number) {
  return `${Number.isFinite(value) ? Math.round(value * 10) / 10 : 0}%`
}

export function pluralize(count: number, forms: [one: string, few: string, many: string]) {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) {
    return forms[0]
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return forms[1]
  }
  return forms[2]
}

export function countLabel(count: number, forms: [one: string, few: string, many: string]) {
  return `${count} ${pluralize(count, forms)}`
}
