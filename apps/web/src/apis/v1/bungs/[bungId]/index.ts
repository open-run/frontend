import { BungInfo } from '@type/bung'
import http from '@apis/axios'
import { ApiResponse } from '@apis/type'

type FetchBungDetailRequestType = {
  bungId: string
}

type FetchBungDetailResponseType = ApiResponse<
  Omit<BungInfo, 'startDateTime' | 'endDateTime'> & {
    startDateTime: string
    endDateTime: string
  }
>

/** 벙 정보 상세보기 */
export function fetchBungDetail({ bungId }: FetchBungDetailRequestType): Promise<FetchBungDetailResponseType> {
  return http.get(`/v1/bungs/${bungId}`)
}

type ModifyBungRequestType = {
  bungId: string
  name: string
  description: string
  memberNumber: number
  hasAfterRun: boolean
  afterRunDescription: string
  hashtags: string[]
}

export function modifyBung({ bungId, ...rest }: ModifyBungRequestType) {
  return http.patch(`/v1/bungs/${bungId}`, rest)
}

type DeleteBungRequestType = {
  bungId: string
}

export function deleteBung({ bungId }: DeleteBungRequestType) {
  return http.delete(`/v1/bungs/${bungId}`)
}
