import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../../utils/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'DELETE') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  try {
    const user = await requireAuth(event)
    const productId = getRouterParam(event, 'productId')

    if (!productId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Product ID required'
      })
    }

    // Find and delete like
    const like = await prisma.like.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId
        }
      }
    })

    if (!like) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Like not found'
      })
    }

    await prisma.like.delete({
      where: { id: like.id }
    })

    return { success: true }
  } catch (error: any) {
    console.error('Like deletion error:', error)
    throw error
  }
})