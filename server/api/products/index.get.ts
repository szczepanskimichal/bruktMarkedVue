import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const querySchema = z.object({
  kategoria: z.string().optional(),
  szukaj: z.string().optional(),
  minCena: z.string().optional(),
  maxCena: z.string().optional(),
  rozmiar: z.string().optional(),
  stan: z.string().optional(),
  strona: z.string().optional(),
  limit: z.string().optional()
})

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'GET') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  try {
    const query = getQuery(event)
    const {
      kategoria,
      szukaj,
      minCena,
      maxCena,
      rozmiar,
      stan,
      strona = '1',
      limit = '20'
    } = querySchema.parse(query)

    const page = parseInt(strona)
    const take = parseInt(limit)
    const skip = (page - 1) * take

    // Build where clause
    const where: any = {
      status: 'active'
    }

    if (kategoria) {
      where.category = kategoria
    }

    if (szukaj) {
      where.OR = [
        { title: { contains: szukaj, mode: 'insensitive' } },
        { description: { contains: szukaj, mode: 'insensitive' } },
        { brand: { contains: szukaj, mode: 'insensitive' } }
      ]
    }

    if (minCena || maxCena) {
      where.price = {}
      if (minCena) where.price.gte = parseFloat(minCena)
      if (maxCena) where.price.lte = parseFloat(maxCena)
    }

    if (rozmiar) {
      where.size = rozmiar
    }

    if (stan) {
      where.condition = stan
    }

    // Get products with seller info and like count
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          seller: {
            select: {
              id: true,
              username: true,
              avatar: true
            }
          },
          _count: {
            select: {
              likes: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take
      }),
      prisma.product.count({ where })
    ])

    // Parse images JSON and format response
    const formattedProducts = products.map(product => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      likes: product._count.likes
    }))

    return {
      products: formattedProducts,
      pagination: {
        current: page,
        total: Math.ceil(total / take),
        count: total,
        limit: take
      }
    }
  } catch (error: any) {
    console.error('Products fetch error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Błąd podczas pobierania produktów'
    })
  }
})