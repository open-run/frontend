import { BungInfo } from '@type/bung'
import http from '@apis/axios'
import { PaginationResponse } from '@apis/type'

export type CreateBungRequestType = {
  name: string
  description: string
  location: string
  latitude: number
  longitude: number
  startDateTime: string
  endDateTime: string
  distance: number
  pace: string
  memberNumber: number
  hasAfterRun: boolean
  afterRunDescription: string
  hashtags: string[]
  mainImage: string
}

export function createBung(params: CreateBungRequestType) {
  return http.post('/v1/bungs', params)
}

export type FetchBungsRequestType = {
  /**
   * true : 참가할 수 있는 벙만 보여집니다.
   * false : 이미 참가한 벙도 보여집니다.
   */
  isAvailableOnly: boolean
  page: number
  limit: number
}

type FetchBungsResponseType = PaginationResponse<Array<BungInfo>>

/** 벙 목록을 보는 경우 (전체보기, 내가 참여한 벙만 보기) */
export function fetchBungs(request: FetchBungsRequestType): Promise<FetchBungsResponseType> {
  return http.get('/v1/bungs', { params: request })
}
