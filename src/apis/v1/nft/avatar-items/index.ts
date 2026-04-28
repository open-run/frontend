import { Avatar, WearingAvatar } from '@type/avatar'
import http from '@apis/axios'
import { ApiResponse } from '@apis/type'

export type OwnedNftAvatarItemsResponse = ApiResponse<Avatar[]>

export type WearingNftAvatarResponse = ApiResponse<WearingAvatar>

export type SaveWearingNftAvatarRequest = {
  fullSet: number | null
  upperClothing: number | null
  lowerClothing: number | null
  footwear: number | null
  face: number | null
  skin: number | null
  hair: number | null
  accessories: {
    'head-accessories': number | null
    'eye-accessories': number | null
    'ear-accessories': number | null
    'body-accessories': number | null
  }
}

export function fetchOwnedNftAvatarItems(): Promise<OwnedNftAvatarItemsResponse> {
  return http.get('/v1/nft/avatar-items/me')
}

export function fetchWearingNftAvatar(): Promise<WearingNftAvatarResponse> {
  return http.get('/v1/nft/avatar-items/me/wearing')
}

export function saveWearingNftAvatar(request: SaveWearingNftAvatarRequest): Promise<WearingNftAvatarResponse> {
  return http.put('/v1/nft/avatar-items/me/wearing', request)
}
