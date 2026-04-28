import http from '@apis/axios'
import { ApiResponse } from '@apis/type'
import { MainCategory, Rarity, SubCategory } from '@type/avatar'

export type AdminMe = {
  admin: boolean
}

export type AdminNftAvatarItem = {
  nftItemId: number
  tokenId: string
  name: string
  category: string
  mainCategory: MainCategory
  subCategory: SubCategory | null
  rarity: Rarity
  thumbnailStorageKey: string
  thumbnailUrl: string | null
}

export type AdminUser = {
  userId: string
  nickname: string | null
  blockchainAddress: string
}

export type GrantAdminNftAvatarItemRequest = {
  recipientAddress: string
  nftItemId: number
}

export type AdminNftGrantResult = {
  recipientAddress: string
  nftItemId: number
  tokenId: string
  transactionHash: string
}

export type AdminMeResponse = ApiResponse<AdminMe>
export type AdminUsersResponse = ApiResponse<AdminUser[]>
export type AdminNftAvatarItemsResponse = ApiResponse<AdminNftAvatarItem[]>
export type AdminNftGrantResponse = ApiResponse<AdminNftGrantResult>

export function fetchAdminMe(): Promise<AdminMeResponse> {
  return http.get('/v1/admin/me')
}

export function fetchAdminUsers(): Promise<AdminUsersResponse> {
  return http.get('/v1/admin/users')
}

export function fetchAdminNftAvatarItems(): Promise<AdminNftAvatarItemsResponse> {
  return http.get('/v1/admin/nft/avatar-items')
}

export function grantAdminNftAvatarItem(
  request: GrantAdminNftAvatarItemRequest,
): Promise<AdminNftGrantResponse> {
  return http.post('/v1/admin/nft/avatar-items/grants', request)
}
