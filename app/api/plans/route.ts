import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

const toStringOrDefault = (value: unknown, fallback = ''): string => {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : fallback
  }
  return fallback
}

const coerceJson = (primary: unknown, secondary: unknown, fallback: any) => {
  if (primary !== undefined && primary !== null) return primary
  if (secondary !== undefined && secondary !== null) return secondary
  return fallback
}

const buildMetadata = (data: any) => ({
  storyType: data.storyType ?? null,
  story: data.story ?? null,
  retention: data.retention ?? null,
  retentionEnabled: data.retentionEnabled ?? null,
  dmKeyword: data.dmKeyword ?? null,
  cta: data.cta ?? null,
  contentMix: data.contentMix ?? null,
  script: data.script ?? null,
  altTitle: data.altTitle ?? null
})

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

    const metadata = buildMetadata(data)

    const plan = await prisma.contentPlan.create({
      data: {
        userId: user.id,
        title: toStringOrDefault(data.title, '제목 없는 기획'),
        platform: toStringOrDefault(data.platform, 'custom'),
        targetAudience: toStringOrDefault(data.targetAudience ?? data.target, ''),
        hook: toStringOrDefault(data.hook, ''),
        mainContent: coerceJson(data.mainContent, data.story, []),
        keywords: coerceJson(data.keywords, data.thumbnailKeywords, []),
        duration: toStringOrDefault(data.duration, ''),
        goal: toStringOrDefault(data.goal, ''),
        metadata
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

    const metadata = buildMetadata(data)

    const plan = await prisma.contentPlan.update({
      where: { id: data.id },
      data: {
        title: toStringOrDefault(data.title, existingPlan.title),
        platform: toStringOrDefault(data.platform, existingPlan.platform),
        targetAudience: toStringOrDefault(data.targetAudience ?? data.target, existingPlan.targetAudience ?? ''),
        hook: toStringOrDefault(data.hook, existingPlan.hook ?? ''),
        mainContent: coerceJson(data.mainContent, data.story, existingPlan.mainContent || []),
        keywords: coerceJson(data.keywords, data.thumbnailKeywords, existingPlan.keywords || []),
        duration: toStringOrDefault(data.duration, existingPlan.duration ?? ''),
        goal: toStringOrDefault(data.goal, existingPlan.goal ?? ''),
        metadata
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
    const existingPlan = await prisma.contentPlan.findFirst({
      where: {
        id: planId,
        userId: user.id
      }
    })

    if (!existingPlan) {
      return NextResponse.json({ error: '기획서를 찾을 수 없습니다' }, { status: 404 })
    }

    await prisma.task.deleteMany({
      where: {
        planId,
        userId: user.id
      }
    })

    await prisma.contentPlan.delete({
      where: { id: planId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('기획서 삭제 오류:', error)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
