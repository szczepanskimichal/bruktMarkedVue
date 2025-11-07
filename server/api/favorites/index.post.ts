import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../../utils/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  try {
    const user = await requireAuth(event)
    const { productId } = await readBody(event)

    if (!productId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Product ID required'
      })
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found'
      })
    }

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId
        }
      }
    })

    if (existingLike) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Product already liked'
      })
    }

    // Create like
    await prisma.like.create({
      data: {
        userId: user.id,
        productId
      }
    })

    return { success: true }
  } catch (error: any) {
    console.error('Like creation error:', error)
    throw error
  }
})