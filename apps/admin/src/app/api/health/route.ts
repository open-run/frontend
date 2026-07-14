import { NextResponse } from 'next/server'

// 컨테이너 헬스체크 및 배포 게이트용 엔드포인트. proxy.ts matcher가 /api/* 를 제외하므로 인증 없이 접근 가능.
export const dynamic = 'force-dynamic'

export function GET() {
  return NextResponse.json({ status: 'ok' })
}
