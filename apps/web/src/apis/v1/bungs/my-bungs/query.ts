import { useSuspenseQuery } from '@tanstack/react-query'
import { RequestType, fetchMyBungs } from './index'

export const queryKey = 'fetchMyBungs'

export function useMyBungsQuery(request: RequestType) {
  return useSuspenseQuery({
    queryKey: [queryKey, request],
    queryFn: () => fetchMyBungs(request),
  })
}
