import { NextRequest, NextResponse } from 'next/server'
import { Geolocation } from '@type/geolocation'

/**
 * GET /api/geocoding
 * query params:
 * {
 *   address: string; (주소)
 * }
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const address = searchParams.get('address')
  if (!address) {
    return NextResponse.json({ error: '올바른 주소를 입력해주세요' }, { status: 400 })
  }

  try {
    /**
     * https://developers.google.com/maps/documentation/geocoding/overview?hl=ko
     */
    const url = new URL('https://maps.googleapis.com/maps/api/geocode/json')
    url.searchParams.append('key', process.env.GOOGLE_API_KEY)
    url.searchParams.append('address', address)
    url.searchParams.append('language', 'ko')

    const response = await fetch(url.toString())
    if (!response.ok) {
      return NextResponse.json({ error: '주소를 찾을 수 없습니다' }, { status: 500 })
    }

    const data: ResponseType = await response.json()
    return NextResponse.json(data.results[0].geometry.location)
  } catch (error) {
    return NextResponse.json({ error: '경로 조회 실패' }, { status: 500 })
  }
}

type ResponseType = {
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
    partial_match: boolean
    place_id: string
    plus_code: {
      compound_code: string
      global_code: string
    }
    types: string[]
  }>
  status: string
}
