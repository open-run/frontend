import http from '@apis/axios'

import { ResponseType } from './type'

/**
 * 유저 로그인 성공 시 정보 반환
 * # 로그인 토큰 함께 보내야 함
 * https://open-run.xyz/swagger-ui/index.html#/user-controller/getUserInfo
 */
export function fetchUserInfo(): Promise<ResponseType> {
  return http.get('/v1/users')
}
