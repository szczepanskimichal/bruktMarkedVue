import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { requireAuth } from '../../utils/auth'

const prisma = new PrismaClient()

const createProductSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(10).max(1000),
  price: z.number().min(1).max(50000),
  size: z.string().optional(),
  brand: z.string().optional(),
  condition: z.enum(['nowy', 'bardzo dobry', 'dobry', 'zadowalający']),
  category: z.enum([
    'koszulki', 'spodnie', 'sukienki', 'buty', 'kurtki', 
    'akcesoria', 'bielizna', 'sportowe'
  ]),
  color: z.string().optional(),
  images: z.array(z.string()).max(10)
})

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  try {
    // Verify authentication
    const user = await requireAuth(event)

    const body = await readBody(event)
    const productData = createProductSchema.parse(body)

    // Create product
    const product = await prisma.product.create({
      data: {
        ...productData,
        images: JSON.stringify(productData.images),
        sellerId: user.id
      },
      include: {
        seller: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      }
    })

    // Format response
    const formattedProduct = {
      ...product,
      images: JSON.parse(product.images),
      likes: 0
    }

    return { product: formattedProduct }
  } catch (error: any) {
    console.error('Product creation error:', error)
    
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nieprawidłowe dane produktu'
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Błąd podczas tworzenia produktu'
    })
  }
})