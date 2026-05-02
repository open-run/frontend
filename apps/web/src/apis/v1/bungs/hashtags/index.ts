import http, { ApiResponse } from '@apis/axios'

export type RequestType = {
  tag: string
}

export type ResponseType = ApiResponse<string[]>

/**
 * 벙 목록을 보는 경우 (전체보기, 내가 참여한 벙만 보기)
 */
export function fetchHashtags(params: RequestType): Promise<ResponseType> {
  return http.get('/v1/bungs/hashtags', { params })
}
