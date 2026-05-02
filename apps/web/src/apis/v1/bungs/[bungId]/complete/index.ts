import http from '@apis/axios'

type RequestType = {
  bungId: string
}

export function completeBung({ bungId }: RequestType) {
  return http.patch(`/v1/bungs/${bungId}/complete`)
}
