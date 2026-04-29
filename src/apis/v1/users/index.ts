import { UserRegister } from '@type/register'
import { UserInfo } from '@type/user'
import http, { ApiResponse } from '@apis/axios'

type RegisterRequestType = UserRegister

/**
 * 설문조사 결과 저장
 * https://open-run.xyz/swagger-ui/index.html#/user-controller/saveSurveyResult
 */
export function register(params: RegisterRequestType) {
  return http.patch('/v1/users', params)
}

export type FetchUserInfoResponseType = ApiResponse<UserInfo>

/**
 * 유저 로그인 성공 시 정보 반환
 * # 로그인 토큰 함께 보내야 함
 * https://open-run.xyz/swagger-ui/index.html#/user-controller/getUserInfo
 */
export function fetchUserInfo(): Promise<FetchUserInfoResponseType> {
  return http.get('/v1/users')
}

export function uploadProfileImage(image: Blob): Promise<FetchUserInfoResponseType> {
  const formData = new FormData()
  const file = image instanceof File ? image : new File([image], 'profile.png', { type: 'image/png' })
  formData.append('image', file)

  return http.put('/v1/users/profile-image', formData)
}

export function deleteUser() {
  return http.delete('/v1/users')
}
