import { NextRequest, NextResponse } from 'next/server'
import { Weather } from '@type/weather'

/**
 * GET /api/weather
 * query params:
 * {
 *   lat: string; (위도)
 *   lng: string; (경도)
 * }
 * 구글 weather의 경우 일부 지역에 대한 데이터 지원을 하지 않는 이슈로 Open Weather API 사용
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  if (!lat || !lng) {
    return NextResponse.json({ error: '올바른 좌표를 입력해주세요' }, { status: 400 })
  }

  try {
    /**
     * https://openweathermap.org/api/one-call-3
     * units=metric : 섭씨 온도로 변환
     */
    const url = new URL('https://api.openweathermap.org/data/3.0/onecall')
    url.searchParams.append('lat', lat)
    url.searchParams.append('lon', lng)
    url.searchParams.append('appid', process.env.OPENWEATHER_API_KEY)
    url.searchParams.append('exclude', 'hourly,daily,minutely,alerts')
    url.searchParams.append('units', 'metric')

    const response = await fetch(url.toString())
    if (!response.ok) {
      return NextResponse.json({ error: '날씨 정보를 찾을 수 없습니다' }, { status: 500 })
    }

    /** https://openweathermap.org/weather-conditions */
    const data: ResponseType = await response.json()
    const result = {
      weather: getWeather(data.current.weather[0].id),
      temperature: data.current.temp,
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: '경로 조회 실패' }, { status: 500 })
  }
}

type ResponseType = {
  current: {
    clouds: number
    dew_point: number
    dt: string
    feels_like: number
    humidity: number
    pressure: number
    snow: { '1h': number }
    sunrise: number
    sunset: number
    temp: number /* 온도 */
    uvi: number
    visibility: Number
    weather: Array<{
      id: number
      main: string /* 날씨 */
      description: string
      icon: string
    }>
    wind_deg: number
    wind_speed: number
  }
  lat: number
  lon: number
  timezone: string
  timezone_offset: number
}

/**
 * Group ID
 * 2** : Thunderstorm -> Rain
 * 3** : Drizzle -> Rain
 * 5** : Rain
 * 6** : Snow
 * 800 : Clear
 * 9** : Clouds
 */
function getWeather(id: number): Weather {
  if (id >= 200 && id < 300) return 'rain'
  if (id >= 300 && id < 400) return 'rain'
  if (id >= 500 && id < 600) return 'rain'
  if (id >= 600 && id < 700) return 'snow'
  if (id === 800) return 'clear'
  if (id >= 800 && id < 900) return 'clouds'
  return 'clear'
}
