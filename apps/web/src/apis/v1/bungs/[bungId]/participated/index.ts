import http from '@apis/axios'

export type RequestType = {
  bungId: string
}

export function certifyParticipation({ bungId }: RequestType) {
  return http.patch(`/v1/bungs/${bungId}/participated`)
}
