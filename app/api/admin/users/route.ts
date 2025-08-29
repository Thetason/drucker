import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    // TODO: 실제로는 세션 기반 인증 확인이 필요합니다
    // 임시로 헤더 체크
    const authHeader = request.headers.get('x-admin-auth')
    if (authHeader !== 'master-admin-2025') {
      return NextResponse.json(
        { error: '권한이 없습니다.' },
        { status: 403 }
      )
    }

    // 모든 사용자 조회
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            contentPlans: true,
            tasks: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // 통계 계산
    const stats = {
      total: users.length,
      active: users.filter(u => u.isActive).length,
      masters: users.filter(u => u.role === 'MASTER').length,
      admins: users.filter(u => u.role === 'ADMIN').length,
      users: users.filter(u => u.role === 'USER').length,
      activeUsers: users.filter(u => u.role === 'USER' && u.isActive).length
    }

    return NextResponse.json({
      users,
      stats,
      maxUsers: 21
    })
  } catch (error) {
    console.error('Admin API error:', error)
    return NextResponse.json(
      { error: '사용자 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// 사용자 상태 업데이트 (활성화/비활성화)
export async function PATCH(request: Request) {
  try {
    // 권한 체크
    const authHeader = request.headers.get('x-admin-auth')
    if (authHeader !== 'master-admin-2025') {
      return NextResponse.json(
        { error: '권한이 없습니다.' },
        { status: 403 }
      )
    }

    const { userId, isActive } = await request.json()

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isActive }
    })

    return NextResponse.json({
      message: `사용자 상태가 ${isActive ? '활성화' : '비활성화'}되었습니다.`,
      user: updatedUser
    })
  } catch (error) {
    console.error('User update error:', error)
    return NextResponse.json(
      { error: '사용자 상태 업데이트에 실패했습니다.' },
      { status: 500 }
    )
  }
}