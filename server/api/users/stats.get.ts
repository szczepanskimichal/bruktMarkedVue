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

    // Get user's products count
    const productsCount = await prisma.product.count({
      where: {
        sellerId: user.id
      }
    })

    // Get user's sold products count  
    const soldCount = await prisma.product.count({
      where: {
        sellerId: user.id,
        status: 'sold'
      }
    })

    return {
      productsCount,
      soldCount
    }
  } catch (error: any) {
    console.error('Get user stats error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Błąd pobierania statystyk użytkownika'
    })
  }
})