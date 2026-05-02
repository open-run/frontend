import { NextRequest, NextResponse } from 'next/server'
import { Geolocation } from '@type/geolocation'

/**
 * GET /api/reverse-geocoding
 * query params:
 * {
 *   lat: string; (위도)
 *   lng: string; (경도)
 * }
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
     * https://developers.google.com/maps/documentation/geocoding/overview?hl=ko
     */
    const url = new URL('https://maps.googleapis.com/maps/api/geocode/json')
    url.searchParams.append('key', process.env.GOOGLE_API_KEY)
    url.searchParams.append('latlng', `${lat},${lng}`)
    url.searchParams.append('language', 'ko')

    const response = await fetch(url.toString())
    if (!response.ok) {
      return NextResponse.json({ error: '주소를 찾을 수 없습니다' }, { status: 500 })
    }

    const data: ResponseType = await response.json()
    const firstResultAddress = data.results[0].formatted_address

    return NextResponse.json(firstResultAddress)
  } catch (error) {
    return NextResponse.json({ error: '경로 조회 실패' }, { status: 500 })
  }
}

type ResponseType = {
  plus_code: {
    compound_code: string
    global_code: string
  }
  results: Array<{
    address_components: Array<{
      long_name: string
      short_name: string
      types: string[]
    }>
    formatted_address: string
    geometry: {
      location: Geolocation
      location_type: string
      viewport: {
        northeast: Geolocation
        southwest: Geolocation
      }
    }
    place_id: string
    plus_code: {
      compound_code: string
      global_code: string
    }
    types: string[]
  }>
}
