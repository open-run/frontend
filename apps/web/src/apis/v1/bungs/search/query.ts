import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { QueryOptions, UseInfiteQueryOptions } from '@type/react-query'
import { SearchBungsRequestType, SearchBungsResponseType, searchBungs } from './index'

export const SEARCH_BUNGS_QUERY_KEY = 'searchBungs'

export function useSearchBungsQuery(
  request: SearchBungsRequestType,
  options?: QueryOptions<SearchBungsResponseType>,
) {
  return useQuery({
    queryKey: [SEARCH_BUNGS_QUERY_KEY, request] as const,
    queryFn: () => searchBungs(request),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useInfiniteSearchBungsQuery(
  request: SearchBungsRequestType,
  options?: UseInfiteQueryOptions<SearchBungsResponseType>,
) {
  return useInfiniteQuery({
    queryKey: [SEARCH_BUNGS_QUERY_KEY, 'infinite', request] as const,
    queryFn: ({ pageParam = 0 }) => searchBungs({ ...request, page: pageParam as number }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const categoryResult = lastPage.data.categories[0]
      if (!categoryResult || categoryResult.last || categoryResult.empty) {
        return undefined
      }

      return allPages.length
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
    ...options,
  })
}
