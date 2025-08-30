import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

// GET: 사용자 페르소나 조회
export async function GET() {
  try {
    const cookieStore = await cookies()
    const userEmail = cookieStore.get('user')?.value

    if (!userEmail) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { persona: true }
    })

    if (!user) {
      return NextResponse.json({ error: '사용자를 찾을 수 없습니다' }, { status: 404 })
    }

    return NextResponse.json({ persona: user.persona })
  } catch (error) {
    console.error('페르소나 조회 오류:', error)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}

// POST: 페르소나 저장/업데이트
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

    // 페르소나 업서트 (있으면 업데이트, 없으면 생성)
    const persona = await prisma.persona.upsert({
      where: { userId: user.id },
      update: {
        name: data.name || '',
        tagline: data.tagline,
        expertise: Array.isArray(data.expertise) ? data.expertise.join(',') : data.expertise,
        monetizationPlan: Array.isArray(data.monetizationPlan) ? data.monetizationPlan.join(',') : data.monetizationPlan,
        whatICanDo: data.whatICanDo || [],
        whatILove: data.whatILove || [],
        whoCanIHelp: data.whoCanIHelp || [],
        contentTopics: data.contentTopics || [],
        targetInterests: data.targetInterests || [],
        targetPainPoints: data.targetPainPoints || [],
        primaryPlatform: Array.isArray(data.primaryPlatform) ? data.primaryPlatform.join(',') : data.primaryPlatform,
        contentFrequency: data.contentFrequency,
        contentStyle: data.contentStyle,
        targetAge: data.targetAge,
      },
      create: {
        userId: user.id,
        name: data.name || '',
        tagline: data.tagline,
        expertise: Array.isArray(data.expertise) ? data.expertise.join(',') : data.expertise,
        monetizationPlan: Array.isArray(data.monetizationPlan) ? data.monetizationPlan.join(',') : data.monetizationPlan,
        whatICanDo: data.whatICanDo || [],
        whatILove: data.whatILove || [],
        whoCanIHelp: data.whoCanIHelp || [],
        contentTopics: data.contentTopics || [],
        targetInterests: data.targetInterests || [],
        targetPainPoints: data.targetPainPoints || [],
        primaryPlatform: Array.isArray(data.primaryPlatform) ? data.primaryPlatform.join(',') : data.primaryPlatform,
        contentFrequency: data.contentFrequency,
        contentStyle: data.contentStyle,
        targetAge: data.targetAge,
      }
    })

    return NextResponse.json({ persona })
  } catch (error) {
    console.error('페르소나 저장 오류:', error)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}