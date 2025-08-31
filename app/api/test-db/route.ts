import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // DB 연결 테스트
    const userCount = await prisma.user.count()
    
    return NextResponse.json({ 
      status: 'DB 연결 성공!',
      userCount,
      message: 'DB가 정상적으로 작동합니다'
    })
  } catch (error) {
    console.error('DB 연결 실패:', error)
    return NextResponse.json({ 
      status: 'DB 연결 실패',
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'DB 연결에 문제가 있습니다. 환경변수를 확인하세요.'
    }, { status: 500 })
  }
}