export const TONES = ['neutral', 'accent', 'positive', 'warning', 'danger'] as const

export type Tone = (typeof TONES)[number]

export const toneColor: Record<Tone, string> = {
  neutral: 'gray',
  accent: 'petrol',
  positive: 'positive',
  warning: 'warning',
  danger: 'danger',
}

export const toneVars = (tone: Tone) => ({
  background: `var(--app-tone-${tone}-bg)`,
  color: `var(--app-tone-${tone}-fg)`,
  borderColor: `var(--app-tone-${tone}-border)`,
})

export const surface = {
  canvas: 'var(--app-surface-canvas)',
  primary: 'var(--app-surface-primary)',
  secondary: 'var(--app-surface-secondary)',
} as const

export const border = {
  subtle: 'var(--app-border-width) solid var(--app-border-subtle)',
  strong: 'var(--app-border-width) solid var(--app-border-strong)',
} as const

export const chartColor = {
  series: 'var(--app-chart-series)',
  muted: 'var(--app-chart-series-muted)',
  grid: 'var(--app-chart-grid)',
  neutralStrong: 'var(--app-chart-neutral-strong)',
  neutral: 'var(--app-chart-neutral)',
  neutralWeak: 'var(--app-chart-neutral-weak)',
  positive: 'var(--app-tone-positive-fg)',
  warning: 'var(--mantine-color-warning-5)',
  danger: 'var(--app-tone-danger-solid)',
} as const

export const fontDisplay = 'var(--app-font-display)'
