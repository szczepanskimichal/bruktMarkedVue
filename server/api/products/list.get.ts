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
    const query = getQuery(event)
    const {
      page = '1',
      limit = '12',
      category,
      search,
      minPrice,
      maxPrice,
      condition,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      ids
    } = query

    const pageNum = Math.max(1, parseInt(page as string))
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)))
    const skip = (pageNum - 1) * limitNum

    // Build where conditions
    const where: any = {
      status: 'active'
    }

    // Filter by specific IDs (for favorites)
    if (ids) {
      const idsArray = (ids as string).split(',').filter(id => id.trim())
      if (idsArray.length > 0) {
        where.id = { in: idsArray }
      }
    }

    if (category) {
      where.category = category
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ]
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice as string)
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string)
    }

    if (condition) {
      where.condition = condition
    }

    // Get products
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
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
        },
        orderBy: {
          [sortBy as string]: sortOrder
        },
        skip,
        take: limitNum
      }),
      prisma.product.count({ where })
    ])

    // Parse images JSON strings
    const parsedProducts = products.map(product => ({
      ...product,
      images: JSON.parse(product.images || '[]')
    }))

    return {
      products: parsedProducts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      }
    }
  } catch (error: any) {
    console.error('List products error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Błąd pobierania produktów'
    })
  }
})