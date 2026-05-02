import { Geolocation } from '@type/geolocation'

export type RequestType = Geolocation
export type ResponseType = string

export async function fetchReverseGeocoding(request: RequestType): Promise<ResponseType> {
  const params = new URLSearchParams({
    lat: request.lat.toString(),
    lng: request.lng.toString(),
  })

  const response = await fetch(`/api/reverse-geocoding?${params}`)
  const data: ResponseType = await response.json()

  return data
}
