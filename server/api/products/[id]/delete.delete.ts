import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'DELETE') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  try {
    // Get product ID from route
    const productId = getRouterParam(event, 'id')
    if (!productId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID produktu jest wymagane'
      })
    }

    // Get authorization token
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Wymagana autoryzacja'
      })
    }

    const token = authHeader.substring(7)
    const config = useRuntimeConfig()
    
    let userId: string
    let isAdmin = false
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as { userId: string }
      userId = decoded.userId
      
      // Check if user is admin
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { isAdmin: true }
      })
      isAdmin = user?.isAdmin || false
    } catch {
      throw createError({
        statusCode: 401,
        statusMessage: 'Nieprawidłowy token'
      })
    }

    // Find the product
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { sellerId: true, title: true }
    })

    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Produkt nie został znaleziony'
      })
    }

    // Check if user owns the product or is admin
    if (product.sellerId !== userId && !isAdmin) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Brak uprawnień do usunięcia tego produktu'
      })
    }

    // Delete the product (cascade will handle related records)
    await prisma.product.delete({
      where: { id: productId }
    })

    return {
      message: `Produkt "${product.title}" został usunięty`
    }
  } catch (error: any) {
    console.error('Delete product error:', error)
    throw error
  }
})