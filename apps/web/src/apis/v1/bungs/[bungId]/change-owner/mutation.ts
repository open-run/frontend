import { useMutation } from '@tanstack/react-query'
import { delegateOwner } from './index'

export function useDelegateOwner() {
  return useMutation({
    mutationFn: delegateOwner,
  })
}
