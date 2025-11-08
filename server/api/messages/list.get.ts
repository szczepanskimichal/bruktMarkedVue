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
    const query = getQuery(event)
    const { otherUserId, productId } = query

    if (!otherUserId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Other user ID is required'
      })
    }

    // Build where condition
    const where: any = {
      OR: [
        {
          senderId: user.id,
          receiverId: otherUserId as string
        },
        {
          senderId: otherUserId as string,
          receiverId: user.id
        }
      ]
    }

    // Add product filter if specified
    if (productId) {
      where.productId = productId as string
    }

    // Get messages
    const messages = await prisma.message.findMany({
      where,
      orderBy: {
        createdAt: 'asc'
      }
    })

    return messages
  } catch (error: any) {
    console.error('Get messages error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Błąd pobierania wiadomości'
    })
  }
})