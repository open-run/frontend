import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { QueryOptions } from '@type/react-query'
import {
  OwnedNftAvatarItemsResponse,
  WearingNftAvatarResponse,
  fetchOwnedNftAvatarItems,
  fetchWearingNftAvatar,
} from './index'

export const OWNED_NFT_AVATAR_ITEMS_QUERY_KEY = ['nftAvatarItems', 'me'] as const
export const WEARING_NFT_AVATAR_QUERY_KEY = ['nftAvatarItems', 'wearing', 'me'] as const

export function useOwnedNftAvatarItemsQuery(options?: QueryOptions<OwnedNftAvatarItemsResponse>) {
  return useQuery({
    queryKey: OWNED_NFT_AVATAR_ITEMS_QUERY_KEY,
    queryFn: fetchOwnedNftAvatarItems,
    ...options,
  })
}

export function useWearingNftAvatarQuery(options?: QueryOptions<WearingNftAvatarResponse>) {
  return useQuery({
    queryKey: WEARING_NFT_AVATAR_QUERY_KEY,
    queryFn: fetchWearingNftAvatar,
    staleTime: Infinity,
    gcTime: Infinity,
    ...options,
  })
}

export function useSuspenseOwnedNftAvatarItemsQuery() {
  return useSuspenseQuery({
    queryKey: OWNED_NFT_AVATAR_ITEMS_QUERY_KEY,
    queryFn: fetchOwnedNftAvatarItems,
  })
}

export function useSuspenseWearingNftAvatarQuery() {
  return useSuspenseQuery({
    queryKey: WEARING_NFT_AVATAR_QUERY_KEY,
    queryFn: fetchWearingNftAvatar,
    staleTime: Infinity,
    gcTime: Infinity,
  })
}
