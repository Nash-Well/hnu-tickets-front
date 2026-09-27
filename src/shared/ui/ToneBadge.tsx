import type { CSSProperties, ReactNode } from 'react'
import type { Tone } from '@/shared/config'
import classes from './ToneBadge.module.css'

export type ToneBadgeAppearance = {
  tone: Tone
  variant: 'soft' | 'outline' | 'solid' | 'text'
  weight?: 'regular' | 'medium' | 'semibold' | 'bold'
  dashed?: boolean
  italic?: boolean
  muted?: boolean
}

type ToneBadgeProps = ToneBadgeAppearance & {
  children: ReactNode
  title?: string
}

export function ToneBadge({
  tone,
  variant,
  weight = 'medium',
  dashed = false,
  italic = false,
  muted = false,
  children,
  title,
}: ToneBadgeProps) {
  const className = [
    classes.badge,
    classes[variant],
    classes[weight],
    dashed && classes.dashed,
    italic && classes.italic,
    muted && classes.muted,
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <span
      className={className}
      title={title}
      style={
        {
          '--tone-bg': `var(--app-tone-${tone}-bg)`,
          '--tone-fg': `var(--app-tone-${tone}-fg)`,
          '--tone-border': `var(--app-tone-${tone}-border)`,
        } as CSSProperties
      }
    >
      {children}
    </span>
  )
}
