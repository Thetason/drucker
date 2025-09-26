import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

const combineDateTime = (date: string, time?: string | null) => {
  if (!date) {
    return new Date()
  }
  if (!time) {
    return new Date(`${date}T00:00:00.000Z`)
  }
  return new Date(`${date}T${time}:00.000Z`)
}

const mapTaskResponse = (task: any) => {
  return {
    id: task.id,
    title: task.title,
    description: task.description ?? '',
    date: task.date.toISOString().split('T')[0],
    startTime: task.startTime ?? '',
    endTime: task.endTime ?? '',
    status: task.status.toLowerCase(),
    priority: task.priority.toLowerCase(),
    reminder: task.reminderMinutes != null
      ? {
          enabled: true,
          time: task.reminderMinutes.toString(),
          method: task.reminderMethod ?? 'browser'
        }
      : { enabled: false },
    color: task.color ?? '',
    planId: task.planId ?? '',
    planTitle: task.plan?.title ?? '',
    planPlatform: task.plan?.platform ?? '',
    planHook: task.plan?.hook ?? null,
    planUpdatedAt: task.plan?.updatedAt ?? null
  }
}

const getCurrentUser = async () => {
  const cookieStore = await cookies()
  const email = cookieStore.get('user')?.value
  if (!email) return null

  return prisma.user.findUnique({ where: { email } })
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ tasks: [] })
    }

    const tasks = await prisma.task.findMany({
      where: { userId: user.id },
      orderBy: { date: 'asc' },
      include: {
        plan: true
      }
    })

    return NextResponse.json({ tasks: tasks.map(mapTaskResponse) })
  } catch (error) {
    console.error('Task GET error:', error)
    return NextResponse.json({ error: '일정을 불러오지 못했습니다.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      description,
      date,
      startTime,
      endTime,
      status,
      priority,
      reminder,
      color,
      planId
    } = body

    if (!planId) {
      return NextResponse.json({ error: '기획서를 선택해주세요.' }, { status: 400 })
    }

    const plan = await prisma.contentPlan.findFirst({
      where: { id: planId, userId: user.id }
    })

    if (!plan) {
      return NextResponse.json({ error: '기획서를 찾을 수 없습니다.' }, { status: 404 })
    }

    const newTask = await prisma.task.create({
      data: {
        userId: user.id,
        planId,
        title: title || plan.title,
        description: description || null,
        date: combineDateTime(date, startTime),
        startTime: startTime || null,
        endTime: endTime || null,
        status: (status || 'pending').toUpperCase(),
        priority: (priority || 'medium').toUpperCase(),
        reminderMinutes: reminder?.enabled ? parseInt(reminder.time ?? '0', 10) : null,
        reminderMethod: reminder?.enabled ? reminder.method ?? 'browser' : null,
        color: color || null
      },
      include: {
        plan: true
      }
    })

    return NextResponse.json({ task: mapTaskResponse(newTask) }, { status: 201 })
  } catch (error) {
    console.error('Task POST error:', error)
    return NextResponse.json({ error: '일정을 생성하지 못했습니다.' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    const body = await request.json()
    const {
      id,
      title,
      description,
      date,
      startTime,
      endTime,
      status,
      priority,
      reminder,
      color,
      planId
    } = body

    if (!id) {
      return NextResponse.json({ error: '일정 ID가 필요합니다.' }, { status: 400 })
    }

    const existing = await prisma.task.findFirst({
      where: {
        id,
        userId: user.id
      }
    })

    if (!existing) {
      return NextResponse.json({ error: '일정을 찾을 수 없습니다.' }, { status: 404 })
    }

    let verifiedPlanId = planId || existing.planId
    if (planId) {
      const plan = await prisma.contentPlan.findFirst({
        where: { id: planId, userId: user.id }
      })
      if (!plan) {
        return NextResponse.json({ error: '기획서를 찾을 수 없습니다.' }, { status: 404 })
      }
      verifiedPlanId = planId
    }

    const updated = await prisma.task.update({
      where: { id: existing.id },
      data: {
        planId: verifiedPlanId,
        title: title ?? existing.title,
        description: description ?? existing.description,
        date: date ? combineDateTime(date, startTime ?? existing.startTime) : existing.date,
        startTime: startTime ?? existing.startTime,
        endTime: endTime ?? existing.endTime,
        status: status ? status.toUpperCase() : existing.status,
        priority: priority ? priority.toUpperCase() : existing.priority,
        reminderMinutes: reminder?.enabled
          ? parseInt(reminder.time ?? '0', 10)
          : reminder?.enabled === false
            ? null
            : existing.reminderMinutes,
        reminderMethod: reminder?.enabled
          ? reminder.method ?? 'browser'
          : reminder?.enabled === false
            ? null
            : existing.reminderMethod,
        color: color ?? existing.color
      },
      include: {
        plan: true
      }
    })

    return NextResponse.json({ task: mapTaskResponse(updated) })
  } catch (error) {
    console.error('Task PUT error:', error)
    return NextResponse.json({ error: '일정을 업데이트하지 못했습니다.' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: '일정 ID가 필요합니다.' }, { status: 400 })
    }

    await prisma.task.deleteMany({
      where: {
        id,
        userId: user.id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Task DELETE error:', error)
    return NextResponse.json({ error: '일정을 삭제하지 못했습니다.' }, { status: 500 })
  }
}
