import { useMutation } from '@tanstack/react-query'
import { dropoutMember } from './index'

export function useDropoutMember() {
  return useMutation({
    mutationFn: dropoutMember,
  })
}
