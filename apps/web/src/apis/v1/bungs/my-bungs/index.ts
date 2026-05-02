import { BungInfo } from '@type/bung'
import http from '@apis/axios'
import { PaginationResponse } from '@apis/type'

export type RequestType = {
  /* null : 전체, true : 내가 벙주인 벙, false : 내가 참여한 벙 */
  isOwned: boolean | null
  /*
   * null : 현재 일자보다 미래 시점의 모든 벙
   * PARTICIPATING : 시작은 했는데 안 끝난 벙
   * ACCOMPLISHED : 완료된 벙
   * ONGOING : 참여 예정 중이거나 진행 중인 벙
   */
  status: 'PARTICIPATING' | 'ACCOMPLISHED' | 'ONGOING' | null
  page: number
  limit: number
}

type ResponseType = PaginationResponse<
  Array<
    Omit<BungInfo, 'startDateTime' | 'endDateTime' | 'memberList'> & {
      startDateTime: string
      endDateTime: string
      isCompleted: boolean
      hasOwnership: boolean
    }
  >
>

/** 내가 참여하고 있는 벙 리스트 조회하기 */
export function fetchMyBungs(request: RequestType): Promise<ResponseType> {
  return http.get('/v1/bungs/my-bungs', { params: request })
}
