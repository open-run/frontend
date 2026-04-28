import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { COOKIE } from '@constants/cookie'

export async function middleware(request: NextRequest) {
  /* 토큰이 없는 경우 로그인 페이지로 리다이렉트 */
  const token = request.cookies.get(COOKIE.ACCESSTOKEN)?.value
  if (!token) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }
}

// 미들웨어를 적용할 경로 설정
export const config = {
  matcher: ['/', '/admin/:path*', '/avatar', '/bung/:bungId', '/explore', '/explore', '/challenges'],
}
