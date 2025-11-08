import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'GET') {
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

    // Get product with seller info and like count
    const product = await prisma.product.findUnique({
      where: { 
        id: productId,
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
      }
    })

    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Produkt nie został znaleziony'
      })
    }

    // Parse images JSON string
    const parsedProduct = {
      ...product,
      images: JSON.parse(product.images || '[]')
    }

    return parsedProduct
  } catch (error: any) {
    console.error('Get product error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Błąd pobierania produktu'
    })
  }
})