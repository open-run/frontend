import { useMutation } from '@tanstack/react-query'
import { sendMemberLike } from './index'

export function useSendMemberLike() {
  return useMutation({
    mutationFn: sendMemberLike,
  })
}
