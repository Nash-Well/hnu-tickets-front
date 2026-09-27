import type { ReactNode } from 'react'
import { Skeleton } from '@mantine/core'
import classes from './StatStrip.module.css'

export type StatItem = {
  label: string
  value: ReactNode
  hint?: ReactNode
  attention?: boolean
}

type StatStripProps = {
  items: StatItem[]
  loading?: boolean
  ariaLabel: string
}

export function StatStrip({ items, loading = false, ariaLabel }: StatStripProps) {
  return (
    <dl className={classes.strip} aria-label={ariaLabel} style={{ margin: 0 }}>
      {items.map((item) => (
        <div key={item.label} className={classes.cell}>
          <dt className={classes.label}>{item.label}</dt>
          <dd style={{ margin: 0 }}>
            {loading ? (
              <Skeleton height={26} width={64} mt={6} />
            ) : (
              <div className={['app-numeral', classes.value, item.attention && classes.attention].filter(Boolean).join(' ')}>
                {item.value}
              </div>
            )}
            {item.hint && !loading && <div className={classes.hint}>{item.hint}</div>}
          </dd>
        </div>
      ))}
    </dl>
  )
}
