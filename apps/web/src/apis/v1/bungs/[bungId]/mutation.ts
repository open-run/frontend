import { useMutation } from '@tanstack/react-query'
import { deleteBung, modifyBung } from './index'

export function useModifyBung() {
  return useMutation({
    mutationFn: modifyBung,
  })
}

export function useDeleteBung() {
  return useMutation({
    mutationFn: deleteBung,
  })
}
