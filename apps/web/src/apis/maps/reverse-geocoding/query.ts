import { useQuery } from '@tanstack/react-query'
import { QueryOptions } from '@type/react-query'
import { RequestType, ResponseType, fetchReverseGeocoding } from './index'

export function useReverseGeocoding(request: RequestType, options?: QueryOptions<ResponseType>) {
  return useQuery({
    queryKey: ['reverse-geocoding', request],
    queryFn: () => fetchReverseGeocoding(request),
    staleTime: Infinity,
    gcTime: Infinity,
    ...options,
  })
}
