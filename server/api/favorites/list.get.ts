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

    // Get user's favorite product IDs
    const likes = await prisma.like.findMany({
      where: { userId: user.id },
      select: { productId: true }
    })

    const favoriteIds = likes.map(like => like.productId)

    if (favoriteIds.length === 0) {
      return {
        products: [],
        count: 0
      }
    }

    // Get the actual products
    const products = await prisma.product.findMany({
      where: {
        id: { in: favoriteIds },
        status: 'active'
      },
      include: {
        seller: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        _count: {
          select: {
            likes: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Parse images JSON strings
    const parsedProducts = products.map(product => ({
      ...product,
      images: JSON.parse(product.images || '[]')
    }))

    return {
      products: parsedProducts,
      count: parsedProducts.length
    }
  } catch (error: any) {
    console.error('Get favorites error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Błąd pobierania ulubionych produktów'
    })
  }
})