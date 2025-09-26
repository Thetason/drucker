import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function ensureSuperAdmin() {
  const email = process.env.SUPER_ADMIN_EMAIL
  const password = process.env.SUPER_ADMIN_PASSWORD

  if (!email || !password) {
    return null
  }

  const name = process.env.SUPER_ADMIN_NAME ?? 'Super Admin'

  const existing = await prisma.user.findUnique({ where: { email } })

  const hashedPassword = await bcrypt.hash(password, 10)

  if (!existing) {
    return prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'MASTER',
        isActive: true
      }
    })
  }

  const updates: Record<string, any> = {}

  if (existing.role !== 'MASTER') {
    updates.role = 'MASTER'
  }

  if (!existing.isActive) {
    updates.isActive = true
  }

  const passwordMatches = await bcrypt.compare(password, existing.password)
  if (!passwordMatches) {
    updates.password = hashedPassword
  }

  if (Object.keys(updates).length === 0) {
    return existing
  }

  return prisma.user.update({
    where: { id: existing.id },
    data: updates
  })
}
