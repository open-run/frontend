import { useQuery } from '@tanstack/react-query'
import { QueryOptions } from '@openrun/types'
import {
  AdminChallengeResponse,
  AdminChallengesResponse,
  AdminMeResponse,
  AdminNftAvatarItemsResponse,
  AdminNftAvatarTryOnItemsResponse,
  AdminUsersResponse,
  fetchAdminChallenge,
  fetchAdminChallenges,
  fetchAdminMe,
  fetchAdminNftAvatarItems,
  fetchAdminNftAvatarTryOnItems,
  fetchAdminUsers,
} from './index'

export const ADMIN_ME_QUERY_KEY = ['admin', 'me'] as const
export const ADMIN_USERS_QUERY_KEY = ['admin', 'users'] as const
export const ADMIN_NFT_AVATAR_ITEMS_QUERY_KEY = ['admin', 'nftAvatarItems'] as const
export const ADMIN_NFT_AVATAR_TRY_ON_ITEMS_QUERY_KEY = ['admin', 'nftAvatarTryOnItems'] as const
export const ADMIN_CHALLENGES_QUERY_KEY = ['admin', 'challenges'] as const
export const ADMIN_CHALLENGE_QUERY_KEY = (challengeId: number) => ['admin', 'challenges', challengeId] as const

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

export function useAdminNftAvatarTryOnItemsQuery(options?: QueryOptions<AdminNftAvatarTryOnItemsResponse>) {
  return useQuery({
    queryKey: ADMIN_NFT_AVATAR_TRY_ON_ITEMS_QUERY_KEY,
    queryFn: fetchAdminNftAvatarTryOnItems,
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

export function useAdminChallengesQuery(options?: QueryOptions<AdminChallengesResponse>) {
  return useQuery({
    queryKey: ADMIN_CHALLENGES_QUERY_KEY,
    queryFn: fetchAdminChallenges,
    ...options,
  })
}

export function useAdminChallengeQuery(challengeId: number, options?: QueryOptions<AdminChallengeResponse>) {
  return useQuery({
    queryKey: ADMIN_CHALLENGE_QUERY_KEY(challengeId),
    queryFn: () => fetchAdminChallenge(challengeId),
    ...options,
  })
}
