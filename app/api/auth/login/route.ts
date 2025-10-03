import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureSuperAdmin } from '@/lib/admin'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // 입력값 검증
    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      )
    }

    // 슈퍼 어드민 계정 자동 보장
    await ensureSuperAdmin()

    // 사용자 찾기
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      )
    }

    // 비밀번호 확인
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      )
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: '비활성화된 계정입니다. 관리자에게 문의해주세요.' },
        { status: 403 }
      )
    }

    const userAgent = request.headers.get('user-agent') ?? undefined
    const forwardedFor = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip')
    const ipAddress = forwardedFor?.split(',')[0]?.trim() ?? undefined

    const [, updatedUser] = await prisma.$transaction([
      prisma.loginActivity.create({
        data: {
          userId: user.id,
          userAgent,
          ipAddress
        }
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          loginCount: { increment: 1 },
          lastLoginAt: new Date()
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          loginCount: true,
          lastLoginAt: true
        }
      })
    ])

    // 성공 응답
    const response = NextResponse.json({
      message: '로그인 성공',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        isActive: updatedUser.isActive,
        loginCount: updatedUser.loginCount,
        lastLoginAt: updatedUser.lastLoginAt
      }
    })

    // 쿠키 설정
    response.cookies.set('drucker-auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7일
    })
    response.cookies.set('user', updatedUser.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: '로그인 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
