import { useMutation } from '@tanstack/react-query'
import { joinBung } from './index'

export function useJoinBung() {
  return useMutation({
    mutationFn: joinBung,
  })
}
