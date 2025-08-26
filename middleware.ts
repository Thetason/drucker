import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 인증이 필요한 경로들
const protectedRoutes = [
  '/persona',
  '/planning',
  '/projects'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 보호된 경로인지 확인
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  if (isProtectedRoute) {
    // 쿠키에서 인증 정보 확인 (브라우저 localStorage는 미들웨어에서 접근 불가)
    const authCookie = request.cookies.get('drucker-auth')
    
    if (!authCookie) {
      // 인증되지 않은 사용자를 로그인 페이지로 리다이렉트
      const url = request.nextUrl.clone()
      url.pathname = '/auth'
      url.searchParams.set('from', pathname)
      return NextResponse.redirect(url)
    }
  }
  
  return NextResponse.next()
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth (authentication page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth).*)',
  ],
}