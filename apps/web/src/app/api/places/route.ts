import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/places
 * body:
 * {
 *   input: string; (검색어)
 * }
 */
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { input } = body

  if (!input) {
    return NextResponse.json({ error: '검색어를 입력해주세요' }, { status: 400 })
  }

  try {
    const url = new URL('https://places.googleapis.com/v1/places:autocomplete')

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.GOOGLE_API_KEY,
        'X-Goog-FieldMask': 'suggestions.placePrediction.placeId,suggestions.placePrediction.structuredFormat',
      },
      body: JSON.stringify({
        input,
        languageCode: 'ko',
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: '장소를 찾을 수 없습니다' }, { status: 500 })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: '장소 검색 실패' }, { status: 500 })
  }
}
