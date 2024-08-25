import http from '@apis/axios'

import { RequestType, ResponseType } from './type'

/**
 * 벙 목록을 보는 경우 (전체보기, 내가 참여한 벙만 보기)
 */
export function fetchBungs(params: RequestType): Promise<ResponseType> {
  return http.get('/v1/bungs', { params })
}
