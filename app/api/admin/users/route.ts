import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    // 간단한 관리자 체크 (실제로는 더 강력한 인증 필요)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
      return NextResponse.json(
        { error: '권한이 없습니다.' },
        { status: 403 }
      )
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        _count: {
          select: {
            contentPlans: true,
            tasks: true
          }
        },
        persona: {
          select: {
            name: true,
            primaryPlatform: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      users,
      totalCount: users.length
    })
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: '사용자 목록을 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}