import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

// GET: 사용자 기획서 목록 조회
export async function GET() {
  try {
    const cookieStore = await cookies()
    const userEmail = cookieStore.get('user')?.value

    if (!userEmail) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { 
        contentPlans: {
          orderBy: { updatedAt: 'desc' }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: '사용자를 찾을 수 없습니다' }, { status: 404 })
    }

    return NextResponse.json({ plans: user.contentPlans })
  } catch (error) {
    console.error('기획서 조회 오류:', error)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}

// POST: 기획서 생성
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userEmail = cookieStore.get('user')?.value

    if (!userEmail) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 })
    }

    const data = await request.json()
    
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    })

    if (!user) {
      return NextResponse.json({ error: '사용자를 찾을 수 없습니다' }, { status: 404 })
    }

    const plan = await prisma.contentPlan.create({
      data: {
        userId: user.id,
        title: data.title,
        platform: data.platform,
        targetAudience: data.targetAudience || data.target,
        hook: data.hook,
        mainContent: data.mainContent || [],
        keywords: data.keywords || [],
        duration: data.duration,
        goal: data.goal,
      }
    })

    return NextResponse.json({ plan })
  } catch (error) {
    console.error('기획서 생성 오류:', error)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}

// PUT: 기획서 수정
export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userEmail = cookieStore.get('user')?.value

    if (!userEmail) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 })
    }

    const data = await request.json()
    
    if (!data.id) {
      return NextResponse.json({ error: '기획서 ID가 필요합니다' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    })

    if (!user) {
      return NextResponse.json({ error: '사용자를 찾을 수 없습니다' }, { status: 404 })
    }

    // 권한 확인
    const existingPlan = await prisma.contentPlan.findFirst({
      where: {
        id: data.id,
        userId: user.id
      }
    })

    if (!existingPlan) {
      return NextResponse.json({ error: '기획서를 찾을 수 없습니다' }, { status: 404 })
    }

    const plan = await prisma.contentPlan.update({
      where: { id: data.id },
      data: {
        title: data.title,
        platform: data.platform,
        targetAudience: data.targetAudience || data.target,
        hook: data.hook,
        mainContent: data.mainContent || [],
        keywords: data.keywords || [],
        duration: data.duration,
        goal: data.goal,
      }
    })

    return NextResponse.json({ plan })
  } catch (error) {
    console.error('기획서 수정 오류:', error)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}

// DELETE: 기획서 삭제
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userEmail = cookieStore.get('user')?.value

    if (!userEmail) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const planId = searchParams.get('id')
    
    if (!planId) {
      return NextResponse.json({ error: '기획서 ID가 필요합니다' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    })

    if (!user) {
      return NextResponse.json({ error: '사용자를 찾을 수 없습니다' }, { status: 404 })
    }

    // 권한 확인 및 삭제
    const deleted = await prisma.contentPlan.deleteMany({
      where: {
        id: planId,
        userId: user.id
      }
    })

    if (deleted.count === 0) {
      return NextResponse.json({ error: '기획서를 찾을 수 없습니다' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('기획서 삭제 오류:', error)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}