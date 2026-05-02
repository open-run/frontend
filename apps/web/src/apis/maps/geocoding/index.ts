import { Geolocation } from '@type/geolocation'

export type RequestType = {
  address: string
}
export type ResponseType = Geolocation

export async function fetchGeocoding(request: RequestType): Promise<ResponseType> {
  const params = new URLSearchParams({
    address: request.address,
  })

  const response = await fetch(`/api/geocoding?${params}`)
  const data: ResponseType = await response.json()

  return data
}
