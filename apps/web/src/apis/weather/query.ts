import { useQuery } from '@tanstack/react-query'
import { QueryOptions } from '@type/react-query'
import { RequestType, ResponseType, fetchCurrentWeather } from './index'

export function useCurrentWeather(request: RequestType, options?: QueryOptions<ResponseType>) {
  return useQuery({
    queryKey: ['current-weather', request],
    queryFn: () => fetchCurrentWeather(request),
    staleTime: 1_000 * 60 * 60, // 1시간
    gcTime: 1_000 * 60 * 60, // 1시간
    ...options,
  })
}
