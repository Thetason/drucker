import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // 활성 일반 사용자 수 카운트
    const activeUserCount = await prisma.user.count({
      where: {
        isActive: true,
        role: 'USER'
      }
    })

    const remaining = Math.max(0, 20 - activeUserCount)

    return NextResponse.json({
      total: 20,
      used: activeUserCount,
      remaining: remaining
    })
  } catch (error) {
    console.error('Spots API error:', error)
    return NextResponse.json(
      { error: '남은 자리 정보를 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}