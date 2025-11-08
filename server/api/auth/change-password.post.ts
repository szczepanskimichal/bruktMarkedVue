import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { requireAuth } from '../../utils/auth'
import { z } from 'zod'

const prisma = new PrismaClient()

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6)
})

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  try {
    const user = await requireAuth(event)
    const body = await readBody(event)
    const { currentPassword, newPassword } = changePasswordSchema.parse(body)

    // Get user with password
    const userWithPassword = await prisma.user.findUnique({
      where: { id: user.id }
    })

    if (!userWithPassword) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Użytkownik nie został znaleziony'
      })
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, userWithPassword.password)
    if (!isCurrentPasswordValid) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nieprawidłowe obecne hasło'
      })
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12)

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword }
    })

    return { success: true }
  } catch (error: any) {
    console.error('Change password error:', error)
    
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nieprawidłowe dane'
      })
    }
    
    throw error
  }
})