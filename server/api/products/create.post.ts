import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const prisma = new PrismaClient()

const createProductSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  price: z.number().positive(),
  category: z.string(),
  size: z.string().optional(),
  condition: z.enum(['nowy', 'bardzo_dobry', 'dobry', 'przeciętny', 'słaby']),
  images: z.array(z.string()).optional(),
})

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  try {
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
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as { userId: string }
      userId = decoded.userId
    } catch {
      throw createError({
        statusCode: 401,
        statusMessage: 'Nieprawidłowy token'
      })
    }

    // Validate request body
    const body = await readBody(event)
    const productData = createProductSchema.parse(body)

    // Create product
    const product = await prisma.product.create({
      data: {
        title: productData.title,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        size: productData.size,
        condition: productData.condition,
        images: JSON.stringify(productData.images || []),
        sellerId: userId
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

    return {
      product,
      message: 'Produkt dodany pomyślnie'
    }
  } catch (error: any) {
    console.error('Create product error:', error)
    
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nieprawidłowe dane produktu'
      })
    }
    
    throw error
  }
})