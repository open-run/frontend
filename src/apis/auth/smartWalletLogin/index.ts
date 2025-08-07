import http, { ApiResponse } from '@apis/axios'

export type RequestType = {
  address: string
}

export type ResponseType = ApiResponse<{
  identifier: string
  nickname: string | null
  jwtToken: string
}>

/**
 * 스마트 월렛 로그인
 */
export function smartWalletLogin(params: RequestType): Promise<ResponseType> {
  return http.get('/v1/users/login/smart_wallet', { params })
}
