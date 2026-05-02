import { InfiniteData, UseInfiniteQueryOptions, UseQueryOptions } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export type QueryOptions<T> = Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> & {
  onSuccess?: (data: T) => void
  onError?: (error: AxiosError<T>) => void
}

export type UseInfiteQueryOptions<T> = Omit<
  UseInfiniteQueryOptions<T, AxiosError<T>, InfiniteData<T>>,
  'queryKey' | 'queryFn' | 'getNextPageParam' | 'getPreviousPageParam' | 'initialPageParam'
> & {
  onSuccess?: (data: T) => void
  onError?: (error: AxiosError<T>) => void
}
