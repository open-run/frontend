import { queryOptions, useQuery } from '@tanstack/react-query'
import { QueryOptions } from '@openrun/types'
import {
  fetchAdminChallenge,
  fetchAdminChallengeCompletions,
  fetchAdminChallenges,
  fetchAdminMe,
  fetchAdminNftAvatarItems,
  fetchAdminNftAvatarTryOnItems,
  fetchAdminOwnedNftAvatarItems,
  fetchAdminUsers,
} from './index'

export const adminQueries = {
  me: () =>
    queryOptions({
      queryKey: ['admin', 'me'] as const,
      queryFn: fetchAdminMe,
      staleTime: Infinity,
      gcTime: Infinity,
    }),
  users: () =>
    queryOptions({
      queryKey: ['admin', 'users'] as const,
      queryFn: fetchAdminUsers,
    }),
  nftAvatarTryOnItems: () =>
    queryOptions({
      queryKey: ['admin', 'nftAvatarTryOnItems'] as const,
      queryFn: fetchAdminNftAvatarTryOnItems,
    }),
  nftAvatarItems: () =>
    queryOptions({
      queryKey: ['admin', 'nftAvatarItems'] as const,
      queryFn: fetchAdminNftAvatarItems,
      // 민팅 카탈로그는 사실상 정적 — Drawer를 여닫을 때마다 재요청하지 않는다
      staleTime: 5 * 60 * 1000,
    }),
  ownedNftAvatarItems: (address: string) =>
    queryOptions({
      queryKey: ['admin', 'ownedNftAvatarItems', address] as const,
      queryFn: () => fetchAdminOwnedNftAvatarItems(address),
    }),
  challenges: () =>
    queryOptions({
      queryKey: ['admin', 'challenges'] as const,
      queryFn: fetchAdminChallenges,
    }),
  challenge: (challengeId: number) =>
    queryOptions({
      queryKey: ['admin', 'challenges', challengeId] as const,
      queryFn: () => fetchAdminChallenge(challengeId),
    }),
  challengeCompletions: (challengeId: number) =>
    queryOptions({
      queryKey: ['admin', 'challenges', challengeId, 'completions'] as const,
      queryFn: () => fetchAdminChallengeCompletions(challengeId),
    }),
}

export function useAdminMeQuery(options?: QueryOptions<ReturnType<typeof adminQueries.me>>) {
  return useQuery({
    ...adminQueries.me(),
    ...options,
  })
}

export function useAdminNftAvatarTryOnItemsQuery(
  options?: QueryOptions<ReturnType<typeof adminQueries.nftAvatarTryOnItems>>,
) {
  return useQuery({
    ...adminQueries.nftAvatarTryOnItems(),
    ...options,
  })
}

export function useAdminUsersQuery(options?: QueryOptions<ReturnType<typeof adminQueries.users>>) {
  return useQuery({
    ...adminQueries.users(),
    ...options,
  })
}

export function useAdminNftAvatarItemsQuery(options?: QueryOptions<ReturnType<typeof adminQueries.nftAvatarItems>>) {
  return useQuery({
    ...adminQueries.nftAvatarItems(),
    ...options,
  })
}

export function useAdminOwnedNftAvatarItemsQuery(
  address: string | null,
  options?: QueryOptions<ReturnType<typeof adminQueries.ownedNftAvatarItems>>,
) {
  return useQuery({
    ...adminQueries.ownedNftAvatarItems(address ?? ''),
    ...options,
    // 호출자가 enabled를 넘겨도 null 주소 가드는 항상 유지한다
    enabled: address != null && (options?.enabled ?? true),
  })
}

export function useAdminChallengesQuery(options?: QueryOptions<ReturnType<typeof adminQueries.challenges>>) {
  return useQuery({
    ...adminQueries.challenges(),
    ...options,
  })
}

export function useAdminChallengeQuery(
  challengeId: number,
  options?: QueryOptions<ReturnType<typeof adminQueries.challenge>>,
) {
  return useQuery({
    ...adminQueries.challenge(challengeId),
    ...options,
  })
}

export function useAdminChallengeCompletionsQuery(
  challengeId: number,
  options?: QueryOptions<ReturnType<typeof adminQueries.challengeCompletions>>,
) {
  return useQuery({
    ...adminQueries.challengeCompletions(challengeId),
    ...options,
  })
}
