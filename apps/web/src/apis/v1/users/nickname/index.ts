import http, { ApiResponse } from '@apis/axios'

export type RequestType = {
  nickname: string
}

export type ResponseType = ApiResponse<
  Array<{
    userId: string
    nickname: string
    email: string
    identityAuthenticated: boolean
    provider: 'smart_wallet'
    blackListed: boolean
    createdDate: string // 2024-11-27T06:39:53.326Z
    lastLoginDate: string // 2024-11-27T06:39:53.326Z
    blockchainAddress: string
    runningPace: string
    runningFrequency: number
  }>
>

/**
 * 닉네임으로 사용자 검색
 */
export function searchByNickname(params: RequestType): Promise<ResponseType> {
  return http.get('/v1/users/nickname', { params })
}
