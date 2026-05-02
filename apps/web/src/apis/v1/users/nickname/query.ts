import { useMutation } from '@tanstack/react-query'
import { searchByNickname } from './index'

export function useSearchByNicknameMutation() {
  return useMutation({
    mutationFn: searchByNickname,
  })
}
