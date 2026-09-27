import { useSyncExternalStore } from 'react'
import { tokenStorage } from '@/shared/api'

export function useAccessToken() {
  return useSyncExternalStore(tokenStorage.subscribe, tokenStorage.get, tokenStorage.get)
}
