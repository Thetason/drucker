import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const MAX_USERS = 30 // 서비스 초기 사용자 30명 제한

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    // 입력값 검증
    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호는 필수입니다.' },
        { status: 400 }
      )
    }

    // 이메일 중복 체크
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: '이미 등록된 이메일입니다.' },
        { status: 409 }
      )
    }

    // 활성 사용자 수 체크 (관리자 제외)
    const activeUserCount = await prisma.user.count({
      where: {
        isActive: true,
        role: 'USER'
      }
    })

    if (activeUserCount >= MAX_USERS) {
      return NextResponse.json(
        { 
          error: '죄송합니다. 현재 모집이 마감되었습니다.' 
        },
        { status: 403 }
      )
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10)

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'USER',
        isActive: true
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    })

    // 현재 사용자 수 반환
    const currentUserCount = activeUserCount + 1

    return NextResponse.json({
      message: `환영합니다! 회원가입이 완료되었습니다.`,
      user,
      userCount: {
        current: currentUserCount,
        max: MAX_USERS,
        remaining: MAX_USERS - currentUserCount
      }
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: '회원가입 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
