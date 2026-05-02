import { useMutation } from '@tanstack/react-query'
import { certifyParticipation } from './index'

export function useCertifyParticipation() {
  return useMutation({
    mutationFn: certifyParticipation,
  })
}
