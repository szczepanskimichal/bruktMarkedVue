import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  try {
    const productId = getRouterParam(event, 'id')

    if (!productId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Product ID is required'
      })
    }

    // Check if product exists and is active
    const product = await prisma.product.findFirst({
      where: { 
        id: productId,
        status: 'active'
      }
    })

    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Produkt nie został znaleziony'
      })
    }

    // Increment view count
    await prisma.product.update({
      where: { id: productId },
      data: {
        views: {
          increment: 1
        }
      }
    })

    return { success: true }
  } catch (error: any) {
    console.error('Increment view error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Błąd aktualizacji wyświetleń'
    })
  }
})