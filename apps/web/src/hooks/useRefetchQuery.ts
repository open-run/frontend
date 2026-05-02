import { useQueryClient } from '@tanstack/react-query'

export function useRefetchQuery(queryKey: string) {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: [queryKey] })
  }
}
