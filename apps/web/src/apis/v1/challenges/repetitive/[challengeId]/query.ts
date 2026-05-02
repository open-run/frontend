import { useQuery } from '@tanstack/react-query'
import { RequestType, fetchRepetitiveChallengeDetail } from './index'

export const useRepetitiveChallengeDetail = (request: RequestType) => {
  return useQuery({
    queryKey: ['repetitiveChallengeDetail', request],
    queryFn: () => fetchRepetitiveChallengeDetail(request),
  })
}
