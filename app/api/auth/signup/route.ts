import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const MAX_USERS = 21 // 드러커 21 - 창업자 포함 21명 한정

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

    if (activeUserCount >= MAX_USERS - 1) { // 창업자 1명 제외하고 20명만
      return NextResponse.json(
        { 
          error: '드러커 21 멤버 모집이 완료되었습니다. 창업자 포함 21명의 첫 번째 부족이 구성되었습니다. 다음 기회를 기다려주세요.' 
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
      message: `드러커 21 멤버 #${currentUserCount + 1} 환영합니다! (${currentUserCount + 1}/21명)`,
      user,
      userCount: {
        current: currentUserCount + 1,
        max: MAX_USERS,
        remaining: MAX_USERS - currentUserCount - 1
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