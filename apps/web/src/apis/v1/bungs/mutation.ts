import { useMutation } from '@tanstack/react-query'
import { createBung } from './index'

export function useCreateBung() {
  return useMutation({
    mutationFn: createBung,
  })
}
