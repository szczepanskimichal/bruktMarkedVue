import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../../utils/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'GET') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  try {
    const user = await requireAuth(event)

    // Count unread messages for the user
    const unreadCount = await prisma.message.count({
      where: {
        receiverId: user.id,
        isRead: false
      }
    })

    return { count: unreadCount }
  } catch (error: any) {
    console.error('Get unread count error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Błąd pobierania liczby nieprzeczytanych wiadomości'
    })
  }
})