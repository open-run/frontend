import http from '@apis/axios'

type RequestType = {
  bungId: string
  newOwnerUserId: string
}

export function delegateOwner({ bungId, newOwnerUserId }: RequestType): Promise<ResponseType> {
  return http.patch(`/v1/bungs/${bungId}/change-owner?newOwnerUserId=${newOwnerUserId}`)
}
