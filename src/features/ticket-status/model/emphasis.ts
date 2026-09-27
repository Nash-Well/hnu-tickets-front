import type { ButtonProps } from '@mantine/core'
import { toneColor } from '@/shared/config'
import type { TransitionEmphasis } from './transition-config'

export const emphasisButtonProps: Record<TransitionEmphasis, Pick<ButtonProps, 'variant' | 'color' | 'c'>> = {
  primary: { variant: 'filled' },
  secondary: { variant: 'default' },
  danger: { variant: 'subtle', color: toneColor.danger, c: 'var(--app-tone-danger-fg)' },
}

export const emphasisConfirmColor: Record<TransitionEmphasis, string | undefined> = {
  primary: undefined,
  secondary: undefined,
  danger: toneColor.danger,
}
