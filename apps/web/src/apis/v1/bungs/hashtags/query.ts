import { useMutation } from '@tanstack/react-query'
import { fetchHashtags } from './index'

export function useHashtagsMutation() {
  return useMutation({
    mutationFn: fetchHashtags,
  })
}
