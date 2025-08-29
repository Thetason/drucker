// 마스터 관리자 계정 생성 스크립트
// 실행: npx tsx scripts/create-master.ts

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// 마스터 관리자 정보 (환경 변수에서 읽어오기)
const MASTER_ADMIN = {
  email: process.env.MASTER_EMAIL || 'master@drucker.com',
  password: process.env.MASTER_PASSWORD || generateSecurePassword(),  // 환경변수 또는 자동 생성
  name: '마스터 관리자'
}

function generateSecurePassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  let password = ''
  for (let i = 0; i < 16; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

async function createMasterAdmin() {
  try {
    console.log('🔧 마스터 관리자 계정 생성 중...')

    // 기존 마스터 계정 확인
    const existingMaster = await prisma.user.findUnique({
      where: { email: MASTER_ADMIN.email }
    })

    if (existingMaster) {
      if (existingMaster.role === 'MASTER') {
        console.log('✅ 마스터 관리자 계정이 이미 존재합니다.')
        console.log(`📧 이메일: ${MASTER_ADMIN.email}`)
        return
      } else {
        // 기존 계정을 마스터로 업그레이드
        await prisma.user.update({
          where: { email: MASTER_ADMIN.email },
          data: { role: 'MASTER' }
        })
        console.log('✅ 기존 계정을 마스터 관리자로 업그레이드했습니다.')
        return
      }
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(MASTER_ADMIN.password, 10)

    // 마스터 관리자 생성
    const master = await prisma.user.create({
      data: {
        email: MASTER_ADMIN.email,
        password: hashedPassword,
        name: MASTER_ADMIN.name,
        role: 'MASTER',
        isActive: true
      }
    })

    console.log('✅ 마스터 관리자 계정이 생성되었습니다!')
    console.log('=====================================')
    console.log('📧 이메일:', MASTER_ADMIN.email)
    console.log('🔑 비밀번호:', MASTER_ADMIN.password)
    console.log('=====================================')
    console.log('⚠️  보안 주의: 비밀번호를 안전한 곳에 저장하고 즉시 변경하세요!')
    
    // 현재 사용자 통계
    const userStats = await prisma.user.groupBy({
      by: ['role'],
      _count: true
    })

    console.log('\n📊 현재 사용자 통계:')
    userStats.forEach(stat => {
      console.log(`   ${stat.role}: ${stat._count}명`)
    })

    const totalActiveUsers = await prisma.user.count({
      where: { isActive: true, role: 'USER' }
    })
    console.log(`\n👥 활성 일반 사용자: ${totalActiveUsers}/100명`)

  } catch (error) {
    console.error('❌ 마스터 관리자 생성 실패:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// 스크립트 실행
createMasterAdmin()