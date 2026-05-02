import { useMutation } from '@tanstack/react-query'
import { completeBung } from './index'

export function useCompleteBung() {
  return useMutation({
    mutationFn: completeBung,
  })
}
