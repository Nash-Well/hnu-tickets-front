import type { ReactNode } from 'react'
import type { User } from '@/entities/user/@x/session'
import { ViewerContext } from './viewer-context'

export function ViewerProvider({ viewer, children }: { viewer: User; children: ReactNode }) {
  return <ViewerContext.Provider value={viewer}>{children}</ViewerContext.Provider>
}
