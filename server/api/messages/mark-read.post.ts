import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../../utils/auth'
import { z } from 'zod'

const prisma = new PrismaClient()

const markReadSchema = z.object({
  messageIds: z.array(z.string())
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
    const { messageIds } = markReadSchema.parse(body)

    // Update messages as read (only for messages where user is receiver)
    await prisma.message.updateMany({
      where: {
        id: { in: messageIds },
        receiverId: user.id
      },
      data: {
        isRead: true
      }
    })

    return { success: true }
  } catch (error: any) {
    console.error('Mark messages as read error:', error)
    
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nieprawidłowe dane'
      })
    }
    
    throw error
  }
})