import { NextRequest, NextResponse } from 'next/server'

const ACCESSTOKEN = 'ACCESSTOKEN'

export function middleware(request: NextRequest) {
  const token = request.cookies.get(ACCESSTOKEN)?.value
  const { pathname } = request.nextUrl
  const isSignInPath = pathname === '/signin' || pathname.startsWith('/signin/')

  if (!token && !isSignInPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/signin'
    return NextResponse.redirect(url)
  }

  if (token && isSignInPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
}
