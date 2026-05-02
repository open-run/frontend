import { Geolocation } from '@type/geolocation'
import { Weather } from '@type/weather'

export type RequestType = Geolocation
export type ResponseType = {
  weather: Weather
  temperature: number
}

export async function fetchCurrentWeather(request: RequestType) {
  const params = new URLSearchParams({
    lat: request.lat.toString(),
    lng: request.lng.toString(),
  })

  const response = await fetch(`/api/weather?${params}`)
  const data: ResponseType = await response.json()
  return data
}
