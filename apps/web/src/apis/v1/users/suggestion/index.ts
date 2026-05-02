import http, { ApiResponse } from '@apis/axios'
import { Pagination } from '@apis/type'

type RequestType = {
  page: number
  limit: number
}

type ResponseType = Pagination &
  ApiResponse<
    Array<{
      userId: string
      nickname: string
      email: string
      runningPace: string
      runningFrequency: number
      collabCount: number
    }>
  >

/**
 * 자주 함께한 사용자 목록
 */
export function fetchSuggestion(params: RequestType): Promise<ResponseType> {
  return http.get('/v1/users/suggestion', { params })
}
