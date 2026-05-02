import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { QueryOptions } from '@type/react-query'
import { FetchUserInfoResponseType, fetchUserInfo } from './index'

export const USERINFO_QUERY_KEY = 'fetchUserInfo'

export function useUserInfo(options?: QueryOptions<FetchUserInfoResponseType>) {
  const { onSuccess, ...queryOptions } = options ?? {}

  const query = useQuery({
    queryKey: [USERINFO_QUERY_KEY],
    queryFn: fetchUserInfo,
    staleTime: Infinity,
    gcTime: Infinity,
    ...queryOptions,
  })

  useEffect(() => {
    if (query.data) {
      onSuccess?.(query.data)
    }
  }, [query.data])

  return query
}
