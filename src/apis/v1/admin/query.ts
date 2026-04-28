import { useQuery } from '@tanstack/react-query'
import { QueryOptions } from '@type/react-query'
import {
  AdminMeResponse,
  AdminNftAvatarItemsResponse,
  AdminUsersResponse,
  fetchAdminMe,
  fetchAdminNftAvatarItems,
  fetchAdminUsers,
} from './index'

export const ADMIN_ME_QUERY_KEY = ['admin', 'me'] as const
export const ADMIN_USERS_QUERY_KEY = ['admin', 'users'] as const
export const ADMIN_NFT_AVATAR_ITEMS_QUERY_KEY = ['admin', 'nftAvatarItems'] as const

export function useAdminMeQuery(options?: QueryOptions<AdminMeResponse>) {
  return useQuery({
    queryKey: ADMIN_ME_QUERY_KEY,
    queryFn: fetchAdminMe,
    staleTime: Infinity,
    gcTime: Infinity,
    ...options,
  })
}

export function useAdminNftAvatarItemsQuery(options?: QueryOptions<AdminNftAvatarItemsResponse>) {
  return useQuery({
    queryKey: ADMIN_NFT_AVATAR_ITEMS_QUERY_KEY,
    queryFn: fetchAdminNftAvatarItems,
    ...options,
  })
}

export function useAdminUsersQuery(options?: QueryOptions<AdminUsersResponse>) {
  return useQuery({
    queryKey: ADMIN_USERS_QUERY_KEY,
    queryFn: fetchAdminUsers,
    ...options,
  })
}
