'server-only'

import http from '@apis/axios'
import { ApiResponse } from '@apis/type'
import { RepetitiveChallengeDetail } from '../../type'

export type RequestType = {
  challengeId: number
}

type ResponseType = ApiResponse<RepetitiveChallengeDetail>

export async function fetchRepetitiveChallengeDetail({ challengeId }: RequestType): Promise<ResponseType> {
  return http.get(`/v1/challenges/repetitive/${challengeId}`)
}
