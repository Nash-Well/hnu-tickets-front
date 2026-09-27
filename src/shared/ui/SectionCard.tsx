import type { ReactNode } from 'react'
import { Box, type BoxProps, Text, Title } from '@mantine/core'
import classes from './SectionCard.module.css'

type SectionCardProps = BoxProps & {
  title?: ReactNode
  description?: ReactNode
  actions?: ReactNode
  variant?: 'primary' | 'secondary'
  flush?: boolean
  children: ReactNode
}

export function SectionCard({
  title,
  description,
  actions,
  variant = 'primary',
  flush = false,
  children,
  className,
  ...boxProps
}: SectionCardProps) {
  const rootClassName = [classes[variant], flush && classes.flush, className].filter(Boolean).join(' ')
  return (
    <Box component="section" className={rootClassName} {...boxProps}>
      {(title || actions) && (
        <div className={classes.header}>
          <div style={{ minWidth: 0 }}>
            {title && (
              <Title order={variant === 'primary' ? 3 : 4} c={variant === 'secondary' ? 'dimmed' : undefined}>
                {title}
              </Title>
            )}
            {description && (
              <Text size="xs" c="dimmed" mt={2}>
                {description}
              </Text>
            )}
          </div>
          {actions}
        </div>
      )}
      {children}
    </Box>
  )
}
