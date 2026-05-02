import { useQuery } from '@tanstack/react-query'
import { QueryOptions } from '@type/react-query'
import { MintJobsResponseType, getMyMintJobs } from './index'

export const MINT_JOBS_QUERY_KEY = ['mintJobs'] as const

export function useMyMintJobsQuery(options?: QueryOptions<MintJobsResponseType>) {
  return useQuery({
    queryKey: MINT_JOBS_QUERY_KEY,
    queryFn: getMyMintJobs,
    ...options,
  })
}
