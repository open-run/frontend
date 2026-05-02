import { useSuspenseQuery } from '@tanstack/react-query'
import { FetchBungsRequestType, fetchBungs } from './index'

export const BUNGS_QUERY_KEY = 'fetchBungs'

export function useBungsQuery(request: FetchBungsRequestType) {
  return useSuspenseQuery({
    queryKey: [BUNGS_QUERY_KEY, request],
    queryFn: () => fetchBungs(request),
  })
}
