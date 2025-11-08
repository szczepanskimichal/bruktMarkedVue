import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../../utils/auth'
import { z } from 'zod'

const prisma = new PrismaClient()

const sendMessageSchema = z.object({
  content: z.string().min(1).max(1000),
  receiverId: z.string(),
  productId: z.string().optional()
})

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  try {
    const user = await requireAuth(event)
    const body = await readBody(event)
    const { content, receiverId, productId } = sendMessageSchema.parse(body)

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId }
    })

    if (!receiver) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Odbiorca nie został znaleziony'
      })
    }

    // Check if product exists (if specified)
    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId }
      })

      if (!product) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Produkt nie został znaleziony'
        })
      }
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        senderId: user.id,
        receiverId,
        productId
      }
    })

    return message
  } catch (error: any) {
    console.error('Send message error:', error)
    
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nieprawidłowe dane wiadomości'
      })
    }
    
    throw error
  }
})