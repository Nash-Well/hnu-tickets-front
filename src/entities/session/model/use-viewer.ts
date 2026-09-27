import { useContext } from 'react'
import type { User } from '@/entities/user/@x/session'
import { ViewerContext } from './viewer-context'

export function useViewer(): User {
  const viewer = useContext(ViewerContext)
  if (!viewer) {
    throw new Error('useViewer must be used inside ViewerProvider')
  }
  return viewer
}

