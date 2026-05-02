'server-only'

import { http } from '@apis/http.server'
import { PaginationResponse } from '@apis/type'
import { ChallengeInfo } from '../type'

type RequestType = {
  page?: number
  limit?: number
}

type ResponseType = PaginationResponse<ChallengeInfo>

export async function fetchRepetitiveChallengeList(params?: RequestType): Promise<ResponseType> {
  return http.get({
    url: `${process.env.NEXT_PUBLIC_API_SERVER_URL}/v1/challenges/repetitive`,
    params,
  })
}
