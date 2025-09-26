import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: '이메일을 입력해주세요.' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json(
        { error: '등록되지 않은 이메일입니다.' },
        { status: 404 }
      )
    }

    const existingPending = await prisma.passwordResetRequest.findFirst({
      where: {
        userId: user.id,
        status: 'PENDING'
      }
    })

    if (existingPending) {
      return NextResponse.json({
        message: '이미 처리 중인 비밀번호 재설정 요청이 있습니다. 관리자 승인을 기다려주세요.'
      })
    }

    await prisma.passwordResetRequest.create({
      data: {
        userId: user.id,
        status: 'PENDING'
      }
    })

    return NextResponse.json({
      message: '비밀번호 재설정 요청이 접수되었습니다. 관리자가 승인하면 안내해드립니다.'
    })
  } catch (error) {
    console.error('Password reset request error:', error)
    return NextResponse.json(
      { error: '요청을 처리하지 못했습니다.' },
      { status: 500 }
    )
  }
}
