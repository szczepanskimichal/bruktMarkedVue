import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'DELETE') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  try {
    // Delete all products and related data
    await prisma.$transaction(async (tx) => {
      // Delete likes first (foreign key constraint)
      await tx.like.deleteMany()
      
      // Delete messages related to products
      await tx.message.deleteMany({
        where: {
          productId: { not: null }
        }
      })
      
      // Delete all products
      await tx.product.deleteMany()
    })

    return {
      message: 'Wszystkie produkty zostały usunięte',
      success: true
    }
  } catch (error: any) {
    console.error('Reset products error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Błąd resetowania produktów'
    })
  }
})