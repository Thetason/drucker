import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureSuperAdmin } from '@/lib/admin'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

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

function generateTemporaryPassword(length = 12) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%'
  let result = ''
  for (let i = 0; i < length; i += 1) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
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

    const requests = await prisma.passwordResetRequest.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const pendingCount = requests.filter(request => request.status === 'PENDING').length

    return NextResponse.json({
      requests,
      pendingCount,
      maxUsers: MAX_USERS,
      currentUser: {
        id: currentUser.id,
        email: currentUser.email,
        role: currentUser.role
      }
    })
  } catch (error) {
    console.error('Admin password reset GET error:', error)
    return NextResponse.json(
      { error: '재설정 요청을 불러오지 못했습니다.' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const currentUser = await requireAdmin()

    if (!currentUser) {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { id, action, note, newPassword } = body as {
      id?: string
      action?: 'approve' | 'reject'
      note?: string
      newPassword?: string
    }

    if (!id || !action) {
      return NextResponse.json(
        { error: '요청 ID와 동작이 필요합니다.' },
        { status: 400 }
      )
    }

    const resetRequest = await prisma.passwordResetRequest.findUnique({
      where: { id },
      include: {
        user: true
      }
    })

    if (!resetRequest) {
      return NextResponse.json(
        { error: '요청을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    if (resetRequest.status !== 'PENDING') {
      return NextResponse.json(
        { error: '이미 처리된 요청입니다.' },
        { status: 400 }
      )
    }

    if (action === 'approve') {
      const temporaryPassword = typeof newPassword === 'string' && newPassword.trim().length > 0
        ? newPassword.trim()
        : generateTemporaryPassword()

      if (temporaryPassword.length < 8) {
        return NextResponse.json(
          { error: '비밀번호는 최소 8자 이상이어야 합니다.' },
          { status: 400 }
        )
      }

      const hashedPassword = await bcrypt.hash(temporaryPassword, 10)

      await prisma.user.update({
        where: { id: resetRequest.userId },
        data: { password: hashedPassword }
      })

      const updatedRequest = await prisma.passwordResetRequest.update({
        where: { id },
        data: {
          status: 'APPROVED',
          resolverEmail: currentUser.email,
          resolverNote: note || null
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          }
        }
      })

      return NextResponse.json({
        request: updatedRequest,
        temporaryPassword
      })
    }

    const updatedRequest = await prisma.passwordResetRequest.update({
      where: { id },
      data: {
        status: 'REJECTED',
        resolverEmail: currentUser.email,
        resolverNote: note || null
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({ request: updatedRequest })
  } catch (error) {
    console.error('Admin password reset PATCH error:', error)
    return NextResponse.json(
      { error: '비밀번호 재설정 요청을 처리하지 못했습니다.' },
      { status: 500 }
    )
  }
}
