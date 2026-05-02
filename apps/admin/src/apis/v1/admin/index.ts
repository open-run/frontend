import http from '@openrun/api-client'
import { ApiResponse } from '@openrun/api-client'
import { Avatar, MainCategory, Rarity, SubCategory } from '@openrun/types'

export type AdminChallengeType = 'tuto' | 'normal' | 'hidden' | 'repetitive'
export type AdminRewardType = 'face' | 'hair' | 'accessory' | 'top' | 'bottom' | 'footwear' | 'pairs' | 'skin'
export type AdminCompletedType = 'date' | 'place' | 'wearing' | 'pace' | 'count'

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

export type AdminChallengeStage = {
  stageId: number
  stageNumber: number
  conditionCount: number
  assignedUserChallengeCount: number
  removable: boolean
}

export type AdminChallenge = {
  challengeId: number
  name: string
  description: string
  challengeType: AdminChallengeType
  rewardType: AdminRewardType
  completedType: AdminCompletedType
  conditionDate: string | null
  conditionText: string | null
  assignedUserChallengeCount: number
  deletable: boolean
  stages: AdminChallengeStage[]
}

export type AdminChallengeStageRequest = {
  stageId?: number
  stageNumber: number
  conditionCount: number
}

export type AdminChallengeRequest = {
  name: string
  description: string
  challengeType: AdminChallengeType
  rewardType: AdminRewardType
  completedType: AdminCompletedType
  conditionDate: string | null
  conditionText: string | null
  stages: AdminChallengeStageRequest[]
}

export type AdminMeResponse = ApiResponse<AdminMe>
export type AdminUsersResponse = ApiResponse<AdminUser[]>
export type AdminNftAvatarItemsResponse = ApiResponse<AdminNftAvatarItem[]>
export type AdminNftAvatarTryOnItemsResponse = ApiResponse<Avatar[]>
export type AdminNftGrantResponse = ApiResponse<AdminNftGrantResult>
export type AdminChallengesResponse = ApiResponse<AdminChallenge[]>
export type AdminChallengeResponse = ApiResponse<AdminChallenge>

export function fetchAdminMe(): Promise<AdminMeResponse> {
  return http.get('/v1/admin/me')
}

export function fetchAdminUsers(): Promise<AdminUsersResponse> {
  return http.get('/v1/admin/users')
}

export function fetchAdminNftAvatarItems(): Promise<AdminNftAvatarItemsResponse> {
  return http.get('/v1/admin/nft/avatar-items')
}

export function fetchAdminNftAvatarTryOnItems(): Promise<AdminNftAvatarTryOnItemsResponse> {
  return http.get('/v1/admin/nft/avatar-items/try-on')
}

export function grantAdminNftAvatarItem(
  request: GrantAdminNftAvatarItemRequest,
): Promise<AdminNftGrantResponse> {
  return http.post('/v1/admin/nft/avatar-items/grants', request)
}

export function fetchAdminChallenges(): Promise<AdminChallengesResponse> {
  return http.get('/v1/admin/challenges')
}

export function fetchAdminChallenge(challengeId: number): Promise<AdminChallengeResponse> {
  return http.get(`/v1/admin/challenges/${challengeId}`)
}

export function createAdminChallenge(request: AdminChallengeRequest): Promise<AdminChallengeResponse> {
  return http.post('/v1/admin/challenges', request)
}

export function updateAdminChallenge({
  challengeId,
  request,
}: {
  challengeId: number
  request: AdminChallengeRequest
}): Promise<AdminChallengeResponse> {
  return http.put(`/v1/admin/challenges/${challengeId}`, request)
}

export function deleteAdminChallenge(challengeId: number): Promise<ApiResponse<null>> {
  return http.delete(`/v1/admin/challenges/${challengeId}`)
}
