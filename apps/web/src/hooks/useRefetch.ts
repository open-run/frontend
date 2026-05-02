import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

export function useRefetch() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return () => {
    queryClient.invalidateQueries()
    router.refresh()
  }
}
