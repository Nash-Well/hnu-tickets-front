import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { tokenStorage } from '@/shared/api'
import { paths } from '@/shared/routes'

export function useLogout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  return () => {
    tokenStorage.clear()
    queryClient.clear()
    navigate(paths.login, { replace: true })
  }
}
