import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { ensureSuperAdmin } from '@/lib/admin'

const MAX_USERS = 30

async function requireAdmin() {
  await ensureSuperAdmin()

  const cookieStore = await cookies()
  const email = cookieStore.get('user')?.value

  if (!email) {
    return null
  }

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !user.isActive) {
    return null
  }

  if (user.role !== 'MASTER' && user.role !== 'ADMIN') {
    return null
  }

  return user
}

export async function GET() {
  try {
    const currentUser = await requireAdmin()

    if (!currentUser) {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      )
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
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
      maxUsers: MAX_USERS,
      currentUser: {
        id: currentUser.id,
        email: currentUser.email,
        role: currentUser.role
      }
    })
  } catch (error) {
    console.error('Admin API error:', error)
    return NextResponse.json(
      { error: '사용자 목록을 불러오지 못했습니다.' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const currentUser = await requireAdmin()

    if (!currentUser) {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { userId, isActive, role, password } = body

    if (!userId) {
      return NextResponse.json(
        { error: '사용자 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    const targetUser = await prisma.user.findUnique({ where: { id: userId } })

    if (!targetUser) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    const updates: Record<string, unknown> = {}

    if (typeof isActive === 'boolean') {
      if (currentUser.role === 'ADMIN' && targetUser.role === 'MASTER') {
        return NextResponse.json(
          { error: '마스터 계정을 변경할 권한이 없습니다.' },
          { status: 403 }
        )
      }

      if (targetUser.id === currentUser.id && !isActive) {
        return NextResponse.json(
          { error: '본인 계정은 비활성화할 수 없습니다.' },
          { status: 400 }
        )
      }

      if (targetUser.role === 'MASTER' && !isActive) {
        const otherMasters = await prisma.user.count({
          where: {
            role: 'MASTER',
            NOT: { id: targetUser.id }
          }
        })

        if (otherMasters === 0) {
          return NextResponse.json(
            { error: '최소 한 명의 마스터 계정이 필요합니다.' },
            { status: 400 }
          )
        }
      }

      updates.isActive = isActive
    }

    if (role) {
      if (currentUser.role !== 'MASTER') {
        return NextResponse.json(
          { error: '역할 변경 권한이 없습니다.' },
          { status: 403 }
        )
      }

      const allowedRoles = ['MASTER', 'ADMIN', 'USER']
      if (!allowedRoles.includes(role)) {
        return NextResponse.json(
          { error: '지원하지 않는 역할입니다.' },
          { status: 400 }
        )
      }

      if (targetUser.id === currentUser.id && role !== 'MASTER') {
        return NextResponse.json(
          { error: '본인 역할을 변경할 수 없습니다.' },
          { status: 400 }
        )
      }

      if (targetUser.role === 'MASTER' && role !== 'MASTER') {
        const otherMasters = await prisma.user.count({
          where: {
            role: 'MASTER',
            NOT: { id: targetUser.id }
          }
        })

        if (otherMasters === 0) {
          return NextResponse.json(
            { error: '최소 한 명의 마스터 계정이 필요합니다.' },
            { status: 400 }
          )
        }
      }

      updates.role = role
    }

    if (typeof password === 'string' && password.trim().length > 0) {
      if (password.length < 8) {
        return NextResponse.json(
          { error: '비밀번호는 최소 8자 이상이어야 합니다.' },
          { status: 400 }
        )
      }

      if (currentUser.role === 'ADMIN' && targetUser.role === 'MASTER') {
        return NextResponse.json(
          { error: '마스터 비밀번호는 변경할 수 없습니다.' },
          { status: 403 }
        )
      }

      updates.password = await bcrypt.hash(password, 10)
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: '변경할 항목이 없습니다.' },
        { status: 400 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updates
    })

    return NextResponse.json({
      message: '사용자 정보가 업데이트되었습니다.',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        isActive: updatedUser.isActive,
        updatedAt: updatedUser.updatedAt
      }
    })
  } catch (error) {
    console.error('User update error:', error)
    return NextResponse.json(
      { error: '사용자 정보를 업데이트하지 못했습니다.' },
      { status: 500 }
    )
  }
}
