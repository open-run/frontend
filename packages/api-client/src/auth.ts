import http from './client'
import type { ApiResponse } from './type'

export type SmartWalletLoginRequest = {
  code: string
}

export type SmartWalletLoginResponse = ApiResponse<{
  email: string
  identifier: string
  nickname: string | null
  jwtToken: string
}>

export function smartWalletLogin(params: SmartWalletLoginRequest): Promise<SmartWalletLoginResponse> {
  return http.get('/v1/users/login/smart_wallet', { params })
}
